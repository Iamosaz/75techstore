// 75Backend/controllers/chatbotController.js
import ChatbotConfig from '../models/ChatbotConfig.js';
import ChatbotLog from '../models/ChatbotLog.js';
import Blog from '../models/Blog.js';
import Groq from 'groq-sdk';

const getWorkingGroqModel = async (groq) => {
  try {
    const list = await groq.models.list();
    const available = list.data
      .map(m => m.id)
      .filter(id => !id.includes('whisper') && !id.includes('guard'));

    const priority = [
      'llama-3.3-70b-versatile',
      'llama-3.1-70b-versatile',
      'llama3-70b-8192',
      'llama-3.1-8b-instant',
      'llama3-8b-8192',
      'qwen-2.5-32b',
      'qwen/qwen3.8-27b',
      'mixtral-8x7b-32768'
    ];

    const match = priority.find(p => available.includes(p));
    return match || available[0] || 'llama3-8b-8192';
  } catch {
    return 'llama3-8b-8192';
  }
};

const detectLanguage = (text) => {
  const pidginKeywords = [
    'abeg', 'wetin', 'dey', 'sabi', 'oya', 'wahala', 'chop',
    'sef', 'kai', 'omo', 'wey', 'na', 'no be', 'shey', 'jare',
    'biko', 'walahi', 'joor', 'gan', 'sha', 'abi'
  ];
  const lower = text.toLowerCase();
  const pidginCount = pidginKeywords.filter(k => lower.includes(k)).length;
  if (pidginCount >= 2) return 'pidgin';
  if (pidginCount === 1) return 'mixed';
  return 'english';
};

const detectScam = (message, scamKeywords = []) => {
  const lower = message.toLowerCase();
  const matches = scamKeywords.filter(k => lower.includes(k.toLowerCase()));
  if (matches.length === 0) return { flagged: false };
  let severity = matches.length >= 3 ? 'critical' : matches.length === 2 ? 'high' : 'low';
  return { flagged: true, reason: `Suspicious keywords: ${matches.join(', ')}`, severity, matches };
};

const getFallbackReply = (message, config) => {
  const lower = message.toLowerCase();
  if (config.customKnowledge?.length) {
    for (const k of config.customKnowledge) {
      if (k.isActive && lower.includes(k.topic.toLowerCase())) return k.content;
    }
  }
  if (lower.match(/hi|hello|hey|good (morning|afternoon|evening)/)) return config.welcomeMessage;
  if (lower.includes('delivery') || lower.includes('shipping')) return 'We offer nationwide delivery across Nigeria.';
  if (lower.includes('payment')) return 'We accept card payments, bank transfers, and pay-on-delivery (Lagos only).';
  if (lower.includes('warranty')) return 'All products come with a manufacturer warranty.';
  if (lower.includes('contact') || lower.includes('support')) return 'Reach us at support@75techstore.com';
  return "I'm not sure about that. Please contact support@75techstore.com.";
};

export const getConfig = async (req, res) => {
  try {
    const config = await ChatbotConfig.getConfig();
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch config', error: error.message });
  }
};

export const updateConfig = async (req, res) => {
  try {
    const updates = req.body;
    if (req.user?._id) updates.lastUpdatedBy = req.user._id;
    let config = await ChatbotConfig.findOne();
    if (!config) config = await ChatbotConfig.create(updates);
    else { Object.assign(config, updates); await config.save(); }
    res.json({ message: 'Config updated successfully', config });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update config', error: error.message });
  }
};

export const sendMessage = async (req, res) => {
  const startTime = Date.now();
  try {
    const { sessionId, message } = req.body;
    if (!sessionId || !message) return res.status(400).json({ message: 'sessionId and message required' });

    const config = await ChatbotConfig.getConfig();
    if (!config.isActive) {
      return res.status(503).json({ reply: 'Our chatbot is offline.', offline: true });
    }

    const security = config.securityEnabled ? detectScam(message, config.scamKeywords) : { flagged: false };
    const language = detectLanguage(message);

    let log = await ChatbotLog.findOne({ sessionId });
    if (!log) {
      log = new ChatbotLog({ sessionId, userId: req.user?._id || null, userIP: req.ip, language });
    }

    log.messages.push({ role: 'user', content: message });

    if (security.flagged) {
      const safeReply = "⚠️ For security, please contact support@75techstore.com.";
      log.messages.push({ role: 'assistant', content: safeReply });
      await log.save();
      return res.json({ reply: safeReply, flagged: true });
    }

    let reply = '';
    let aiUsed = false;
    const apiKey = process.env.GROQ_API_KEY?.trim();

    if (config.isAIEnabled && apiKey) {
      try {
        const groq = new Groq({ apiKey });
        const modelToUse = await getWorkingGroqModel(groq);

        const completion = await groq.chat.completions.create({
          model: modelToUse,
          messages: [
            { role: 'system', content: config.systemPrompt || 'You are 75TechStore assistant.' },
            ...log.messages.slice(-8).map(m => ({ role: m.role, content: m.content }))
          ],
          temperature: 0.7,
          max_tokens: 1024
        });
        reply = completion.choices[0]?.message?.content || getFallbackReply(message, config);
        aiUsed = true;
      } catch {
        reply = getFallbackReply(message, config);
      }
    } else {
      reply = getFallbackReply(message, config);
    }

    log.messages.push({ role: 'assistant', content: reply });
    log.aiUsed = aiUsed;
    log.responseTime = Date.now() - startTime;
    await log.save();

    res.json({ reply, aiUsed, language, sessionId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAnalytics = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalChats, todayChats, flaggedChats, recentChats] = await Promise.all([
      ChatbotLog.countDocuments(),
      ChatbotLog.countDocuments({ createdAt: { $gte: today } }),
      ChatbotLog.countDocuments({ isFlagged: true }),
      ChatbotLog.find().sort({ createdAt: -1 }).limit(20).lean()
    ]);

    res.json({ totalChats, todayChats, flaggedChats, recentChats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLogs = async (req, res) => {
  try {
    const logs = await ChatbotLog.find().sort({ createdAt: -1 }).limit(20).lean();
    res.json({ logs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteLog = async (req, res) => {
  try {
    await ChatbotLog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Log deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resolveLog = async (req, res) => {
  try {
    const log = await ChatbotLog.findByIdAndUpdate(req.params.id, { resolved: true }, { new: true });
    res.json({ message: 'Log resolved', log });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const generateBlog = async (req, res) => {
  try {
    const { topic, category = 'Tech News', keywords = '', saveToDraft = true } = req.body;
    if (!topic || !topic.trim()) return res.status(400).json({ message: 'Topic is required' });

    const apiKey = process.env.GROQ_API_KEY?.trim();
    if (!apiKey) return res.status(400).json({ message: 'GROQ_API_KEY is not configured.' });

    const groq = new Groq({ apiKey });
    const modelToUse = await getWorkingGroqModel(groq);

    const systemPrompt = `You are a professional tech blog writer for 75TechStore Nigeria.
Write comprehensive, high-quality blog posts formatted with HTML tags (<p>, <h2>, <h3>, <ul>, <li>, <strong>).
Do NOT use Markdown symbols like # or **. Output clean HTML for all paragraphs and headings.`;

    const userPrompt = `Write a detailed article about: "${topic}"
Category: ${category}
Keywords: ${keywords || 'tech, gadgets, nigeria'}

Return ONLY a JSON object:
{
  "title": "SEO Optimized Title",
  "excerpt": "Brief 2-sentence summary",
  "content": "<p>Introductory paragraph...</p><h2>Key Features</h2><p>Details...</p><ul><li>Benefit 1</li><li>Benefit 2</li></ul><h2>Conclusion</h2><p>Summary and call to action...</p>",
  "tags": ["gadgets", "nigeria", "tech"],
  "readTime": 4
}`;

    const completion = await groq.chat.completions.create({
      model: modelToUse,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 3500,
      response_format: { type: 'json_object' }
    });

    const rawContent = completion.choices[0]?.message?.content || '{}';
    const blogData = JSON.parse(rawContent);

    if (saveToDraft) {
      const slug = (blogData.title || topic)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 100);

      const blogDoc = {
        title: blogData.title,
        slug: `${slug}-${Date.now()}`,
        excerpt: blogData.excerpt || '',
        content: blogData.content,
        category,
        tags: blogData.tags || [],
        readTime: blogData.readTime || 4,
        status: 'draft',
        isAIGenerated: true
      };

      if (req.user?._id) blogDoc.author = req.user._id;
      await Blog.create(blogDoc);
    }

    res.json(blogData);
  } catch (error) {
    console.error('generateBlog error:', error);
    res.status(500).json({ message: error.message || 'Failed to generate blog.' });
  }
};