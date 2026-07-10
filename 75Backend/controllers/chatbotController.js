// 75Backend/controllers/chatbotController.js
import Groq from 'groq-sdk';
import { ChatbotConfig } from '../models/ChatbotConfig.js';
import { ChatHistory } from '../models/ChatHistory.js';
import { Product } from '../models/Product.js';
import { Blog } from '../models/Blog.js';

// ✅ Lazy Groq initialization
let groqInstance = null;

const getGroq = () => {
  if (!groqInstance && process.env.GROQ_API_KEY) {
    groqInstance = new Groq({ apiKey: process.env.GROQ_API_KEY });
    console.log('✅ Groq initialized successfully');
  }
  return groqInstance;
};

// ✅ Default scam keywords
const defaultScamKeywords = [
  'send money', 'wire transfer', 'western union',
  'bitcoin', 'crypto payment', 'gift card',
  'urgent transfer', 'bank account', 'pin number',
  'otp code', 'verify account', 'suspicious',
  'hack', 'steal', 'fraud', 'scam'
];

// ✅ Detect scam
const detectScam = (message, scamKeywords = []) => {
  const allKeywords = [...defaultScamKeywords, ...scamKeywords];
  const lowerMessage = message.toLowerCase();
  const found = allKeywords.filter(keyword =>
    lowerMessage.includes(keyword.toLowerCase())
  );
  return { isScam: found.length > 0, keywords: found };
};

// ✅ Detect language
const detectLanguage = (message) => {
  const pidginWords = [
    'abeg', 'wetin', 'wahala', 'oga', 'na', 'dey',
    'wey', 'dem', 'una', 'nah', 'sabi', 'abi',
    'comot', 'chop', 'beta', 'e don'
  ];
  const lowerMsg = message.toLowerCase();
  const isPidgin = pidginWords.some(word => lowerMsg.includes(word));
  return isPidgin ? 'pidgin' : 'english';
};

// ✅ Call Groq AI - model parameter added
const callGroqAI = async (systemPrompt, messages, maxTokens = 500, model = 'llama-3.1-8b-instant') => {
  const groq = getGroq();

  if (!groq) {
    throw new Error('Groq API key not configured');
  }

  const completion = await groq.chat.completions.create({
    model,  // ✅ Dynamic model - no more hardcoded decommissioned model
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages
    ],
    max_tokens: maxTokens,
    temperature: 0.7
  });

  return completion.choices[0].message.content;
};

// ─── GET Chatbot Config ───────────────────────────────────────────
export const getChatbotConfig = async (req, res) => {
  try {
    let config = await ChatbotConfig.findOne();
    if (!config) {
      config = await ChatbotConfig.create({
        botName: '75TechStore AI',
        quickReplies: [
          { icon: '🛍️', text: 'Browse Products', query: 'Show me your products', isActive: true },
          { icon: '📞', text: 'Contact Info', query: 'How can I contact you?', isActive: true },
          { icon: '🔧', text: 'Repair Services', query: 'Tell me about repair services', isActive: true },
          { icon: '❓', text: 'FAQs', query: 'What are your FAQs?', isActive: true }
        ],
        scamKeywords: defaultScamKeywords,
        customKnowledge: [
          {
            topic: 'About Store',
            content: '75TechStore is located at M Plaza, Computer Village, Ikeja, Lagos. We sell phones, laptops, tablets, gaming consoles, accessories and more. Contact: +234 703 562 0709',
            isActive: true
          },
          {
            topic: 'Delivery',
            content: 'We deliver nationwide in Nigeria. Lagos delivery takes 1-2 days. Other states take 2-5 days. Free delivery on orders above ₦50,000.',
            isActive: true
          },
          {
            topic: 'Payment',
            content: 'We accept bank transfer, card payment, and cash on delivery in Lagos. We do NOT accept cryptocurrency or gift cards.',
            isActive: true
          },
          {
            topic: 'Returns',
            content: 'We have a 7-day return policy. Items must be in original condition. Contact us within 7 days of purchase.',
            isActive: true
          }
        ]
      });
    }
    res.json(config);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── UPDATE Chatbot Config ────────────────────────────────────────
export const updateChatbotConfig = async (req, res) => {
  try {
    let config = await ChatbotConfig.findOne();
    if (!config) config = new ChatbotConfig();

    const fields = [
      'botName', 'welcomeMessage', 'language',
      'customKnowledge', 'quickReplies', 'securityEnabled',
      'scamKeywords', 'securityAlertEmail',
      'blogGenerationEnabled', 'isActive', 'isAIEnabled'
    ];

    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        config[field] = req.body[field];
      }
    });

    await config.save();
    res.json({ message: 'Chatbot config updated successfully', config });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── MAIN Chat Endpoint ───────────────────────────────────────────
export const chat = async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message || !sessionId) {
      return res.status(400).json({ message: 'Message and sessionId are required' });
    }

    const config = await ChatbotConfig.findOne();

    if (!config?.isActive) {
      return res.json({
        response: "Sorry, the chatbot is currently offline. Please contact us directly at +234 703 562 0709",
        isScam: false
      });
    }

    if (config.securityEnabled) {
      const scamCheck = detectScam(message, config.scamKeywords || []);
      if (scamCheck.isScam) {
        await ChatHistory.findOneAndUpdate(
          { sessionId },
          {
            $push: { messages: { role: 'user', content: message } },
            isFlagged: true,
            flagReason: `Scam keywords: ${scamCheck.keywords.join(', ')}`
          },
          { upsert: true, new: true }
        );
        return res.json({
          response: "⚠️ Warning! This looks like a suspicious request. 75TechStore will NEVER ask for your bank PIN, OTP, or request cryptocurrency payments. If someone is asking you for this, please report to us immediately at +234 703 562 0709.",
          isScam: true,
          flagged: true
        });
      }
    }

    const detectedLang = detectLanguage(message);

    const recentProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(8)
      .select('name price category brand stock isFeatured isDealOfDay');

    const recentBlogs = await Blog.find({ status: 'published' })
      .sort({ createdAt: -1 })
      .limit(3)
      .select('title category excerpt');

    const activeKnowledge = config.customKnowledge
      ?.filter(k => k.isActive)
      .map(k => `${k.topic}: ${k.content}`)
      .join('\n') || '';

    const systemPrompt = `You are the AI assistant for 75TechStore, a tech store in Lagos, Nigeria.

STORE KNOWLEDGE:
${activeKnowledge}

CURRENT PRODUCTS IN STORE:
${recentProducts.map(p =>
  `- ${p.name} (${p.category}) - ₦${Number(p.price).toLocaleString()} - ${
    p.stock > 0 ? 'In Stock' : 'Out of Stock'
  }${p.isDealOfDay ? ' 🔥 DEAL' : ''}${p.isFeatured ? ' ⭐ FEATURED' : ''}`
).join('\n')}

RECENT BLOG POSTS:
${recentBlogs.map(b => `- ${b.title} (${b.category})`).join('\n')}

LANGUAGE RULES:
${detectedLang === 'pidgin'
  ? 'Respond in friendly Pidgin English. Use: Oga, Abeg, Na, Wahala, Sabi, E dey'
  : 'Respond in clear, friendly Standard English.'
}

RULES:
1. Only help with 75TechStore questions
2. NEVER ask for passwords, PINs, OTPs or banking details
3. NEVER accept cryptocurrency
4. Always be helpful and professional
5. Use ₦ for prices
6. Direct unknowns to +234 703 562 0709
7. Max 3 paragraphs
8. Use emojis`;

    let chatSession = await ChatHistory.findOne({ sessionId });
    if (!chatSession) {
      chatSession = new ChatHistory({ sessionId, messages: [], language: detectedLang });
    }

    chatSession.messages.push({ role: 'user', content: message });

    const recentMessages = chatSession.messages
      .slice(-10)
      .map(m => ({ role: m.role, content: m.content }));

    let botResponse = '';
    const groq = getGroq();

    if (config.isAIEnabled && groq) {
      try {
        // ✅ Fast model for chatbot responses
        botResponse = await callGroqAI(
          systemPrompt,
          recentMessages,
          500,
          'llama-3.1-8b-instant'  // ✅ Fast model for chat
        );
      } catch (aiError) {
        console.error('Groq chat error:', aiError.message);
        botResponse = getFallbackResponse(message, detectedLang);
      }
    } else {
      botResponse = getFallbackResponse(message, detectedLang);
    }

    chatSession.messages.push({ role: 'assistant', content: botResponse });
    await chatSession.save();

    res.json({ response: botResponse, language: detectedLang, isScam: false });

  } catch (err) {
    console.error('Chat error:', err.message);
    res.status(500).json({
      message: 'Chat service error',
      response: "Sorry, I'm having trouble right now. Please call us at +234 703 562 0709"
    });
  }
};

// ✅ Fallback responses
const getFallbackResponse = (message, lang) => {
  const lowerMsg = message.toLowerCase();

  const responses = {
    products: {
      english: "🛍️ We sell Phones, Laptops, Tablets, Gaming Consoles, Accessories and more! Visit our shop page to browse all products with current prices.",
      pidgin: "🛍️ We get Phones, Laptops, Tablets, Game Console, Accessories and plenty more! Go our shop page see everything wey we get with price!"
    },
    contact: {
      english: "📞 Contact us:\n📱 Phone: +234 703 562 0709\n💬 WhatsApp: wa.me/2347035620709\n📧 Email: support@75techstore.com\n📍 M Plaza, Computer Village, Ikeja, Lagos",
      pidgin: "📞 Oya contact us:\n📱 Phone: +234 703 562 0709\n💬 WhatsApp: wa.me/2347035620709\n📧 Email: support@75techstore.com\n📍 M Plaza, Computer Village, Ikeja, Lagos"
    },
    repair: {
      english: "🔧 We fix Smartphones, Laptops and Tablets! Fast turnaround with professional technicians. Call: +234 703 562 0709",
      pidgin: "🔧 We dey fix Phone, Laptop and Tablet! We go do am fast with our professional guys. Call: +234 703 562 0709"
    },
    delivery: {
      english: "🚚 We deliver nationwide! Lagos: 1-2 days. Other states: 2-5 days. Free delivery on orders above ₦50,000!",
      pidgin: "🚚 We dey deliver everywhere for Nigeria! Lagos: 1-2 days. Other states: 2-5 days. Order above ₦50,000 delivery na free!"
    },
    payment: {
      english: "💳 We accept Bank Transfer, Card Payment and Cash on Delivery (Lagos only). We do NOT accept crypto or gift cards.",
      pidgin: "💳 We accept Bank Transfer, Card Payment and Cash on Delivery (Lagos only). We NO dey accept crypto or gift card abeg."
    },
    price: {
      english: "💰 Our prices are very competitive! Visit our shop to see current prices. We also offer payment plans. Call +234 703 562 0709 for bulk pricing.",
      pidgin: "💰 Our price dey very good! Go our shop see all price. We also get payment plan. Call +234 703 562 0709 for bulk order price."
    }
  };

  if (lowerMsg.includes('product') || lowerMsg.includes('phone') ||
    lowerMsg.includes('laptop') || lowerMsg.includes('buy') ||
    lowerMsg.includes('tablet') || lowerMsg.includes('console')) return responses.products[lang];
  if (lowerMsg.includes('contact') || lowerMsg.includes('call') ||
    lowerMsg.includes('whatsapp') || lowerMsg.includes('address')) return responses.contact[lang];
  if (lowerMsg.includes('repair') || lowerMsg.includes('fix')) return responses.repair[lang];
  if (lowerMsg.includes('deliver') || lowerMsg.includes('shipping')) return responses.delivery[lang];
  if (lowerMsg.includes('pay') || lowerMsg.includes('payment')) return responses.payment[lang];
  if (lowerMsg.includes('price') || lowerMsg.includes('cost') ||
    lowerMsg.includes('how much') || lowerMsg.includes('cheap')) return responses.price[lang];

  return lang === 'pidgin'
    ? "Abeg, I no fully understand. Try ask me again or call +234 703 562 0709. Make I help you! 😊"
    : "I'm not sure about that. Contact us at +234 703 562 0709 or ask something else. Happy to help! 😊";
};

// ─── GENERATE Blog Post ───────────────────────────────────────────
export const generateBlogPost = async (req, res) => {
  try {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📥 GENERATE BLOG CALLED');
    console.log('📥 Body:', req.body);
    console.log('👤 User:', req.user);
    console.log('🔑 GROQ_API_KEY:', process.env.GROQ_API_KEY ? 'SET ✅' : 'MISSING ❌');

    const groq = getGroq();
    console.log('🔑 Groq instance:', groq ? 'READY ✅' : 'NULL ❌');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    const { topic, category, keywords } = req.body;

    if (!topic) {
      return res.status(400).json({ message: 'Topic is required' });
    }

    if (!groq) {
      return res.status(400).json({
        message: 'Groq API key not configured. Add GROQ_API_KEY to your .env file'
      });
    }

    const prompt = `Write a detailed, SEO-optimized blog post for 75TechStore Nigeria about: "${topic}"

Category: ${category || 'Tech News'}
Keywords to include: ${keywords || topic}

Requirements:
- Write for Nigerian tech audience
- Include prices in Naira where relevant
- Make it informative and engaging
- Include practical tips
- Length: 600-900 words
- Use HTML formatting (h2, p, ul, li, strong tags)
- Include a call to action mentioning 75TechStore at Computer Village Lagos

Return EXACTLY in this format:
TITLE: [Your blog title here]
META: [Your meta description - max 160 chars]
TAGS: [tag1, tag2, tag3, tag4, tag5]
CONTENT:
[Your full HTML blog content here]`;

    const systemPrompt = `You are a professional tech blog writer for 75TechStore, a Nigerian tech store in Computer Village, Ikeja Lagos.
Write engaging, SEO-optimized content for Nigerian audience.
Always mention 75TechStore naturally in the content.
Use Nigerian context (prices in Naira, Nigerian tech market).
Return content EXACTLY in the format requested.`;

    console.log('🤖 Calling Groq AI for blog generation...');

    let generatedContent;
    try {
      generatedContent = await callGroqAI(
        systemPrompt,
        [{ role: 'user', content: prompt }],
        2000,
        'llama-3.3-70b-versatile'  // ✅ Powerful model for blog quality
      );
    } catch (groqError) {
      console.error('❌ Groq API error:', groqError.message);
      return res.status(500).json({
        message: 'Groq AI failed',
        error: groqError.message
      });
    }

    console.log('✅ Groq responded, length:', generatedContent?.length);

    if (!generatedContent || generatedContent.trim() === '') {
      return res.status(500).json({ message: 'AI returned empty response' });
    }

    // ✅ Parse response
    const lines = generatedContent.split('\n');
    let title = '';
    let metaDescription = '';
    let tags = [];
    let content = '';
    let isContent = false;

    for (const line of lines) {
      if (line.startsWith('TITLE:')) {
        title = line.replace('TITLE:', '').trim();
      } else if (line.startsWith('META:')) {
        metaDescription = line.replace('META:', '').trim();
      } else if (line.startsWith('TAGS:')) {
        tags = line.replace('TAGS:', '').trim()
          .split(',').map(t => t.trim()).filter(Boolean);
      } else if (line.startsWith('CONTENT:')) {
        isContent = true;
      } else if (isContent) {
        content += line + '\n';
      }
    }

    if (!title) title = topic;
    if (!content || content.trim() === '') content = `<p>${generatedContent}</p>`;
    content = content.trim();

    console.log('📊 Title:', title);
    console.log('📊 Content length:', content.length);
    console.log('📊 Tags:', tags);

    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200);

    console.log('💾 Saving to MongoDB...');

    let savedBlog;
    try {
      savedBlog = await Blog.create({
        title,
        content,
        excerpt: metaDescription ||
          content.replace(/<[^>]*>/g, '').substring(0, 160) + '...',
        category: category || 'Tech News',
        tags,
        metaTitle: title,
        metaDescription: metaDescription || '',
        readTime,
        status: 'draft',
        author: '75TechStore Team',
        coverImage: '',
        isFeatured: false
      });
      console.log('✅ Blog saved! ID:', savedBlog._id);

    } catch (dbError) {
      console.error('❌ DB Error:', dbError.message);
      console.error('❌ DB Code:', dbError.code);

      // ✅ Handle duplicate slug error
      if (dbError.code === 11000) {
        console.log('⚠️ Duplicate slug - retrying with timestamp...');
        const retryData = {
          title,
          content,
          slug: `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`,
          excerpt: metaDescription ||
            content.replace(/<[^>]*>/g, '').substring(0, 160) + '...',
          category: category || 'Tech News',
          tags,
          metaTitle: title,
          metaDescription: metaDescription || '',
          readTime,
          status: 'draft',
          author: '75TechStore Team',
          coverImage: '',
          isFeatured: false
        };
        savedBlog = await Blog.create(retryData);
        console.log('✅ Blog saved with unique slug! ID:', savedBlog._id);
      } else {
        return res.status(500).json({
          message: 'Failed to save blog to database',
          error: dbError.message
        });
      }
    }

    console.log('🎉 SUCCESS - Blog generated and saved!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    return res.status(201).json({
      success: true,
      message: 'Blog post generated and saved as draft!',
      blogId: savedBlog._id,
      title: savedBlog.title,
      metaDescription,
      content,
      tags,
      category: savedBlog.category,
      readTime: savedBlog.readTime,
      savedAsDraft: true
    });

  } catch (err) {
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('❌ FATAL ERROR:', err.message);
    console.error('❌ Stack:', err.stack);
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    return res.status(500).json({
      message: 'Failed to generate blog post',
      error: err.message
    });
  }
};

// ─── GET Chat Analytics ───────────────────────────────────────────
export const getChatAnalytics = async (req, res) => {
  try {
    const totalChats = await ChatHistory.countDocuments();
    const flaggedChats = await ChatHistory.countDocuments({ isFlagged: true });
    const recentChats = await ChatHistory.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('sessionId createdAt isFlagged flagReason language');

    const englishChats = await ChatHistory.countDocuments({ language: 'english' });
    const pidginChats = await ChatHistory.countDocuments({ language: 'pidgin' });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayChats = await ChatHistory.countDocuments({ createdAt: { $gte: today } });

    res.json({
      totalChats,
      flaggedChats,
      todayChats,
      englishChats,
      pidginChats,
      recentChats
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};