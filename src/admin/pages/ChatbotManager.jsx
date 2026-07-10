// src/admin/pages/ChatbotManager.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ChatbotManager = () => {
  const navigate = useNavigate();
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('general');
  const [analytics, setAnalytics] = useState(null);

  // Blog generation
  const [blogTopic, setBlogTopic] = useState('');
  const [blogCategory, setBlogCategory] = useState('Tech News');
  const [blogKeywords, setBlogKeywords] = useState('');
  const [generatedBlog, setGeneratedBlog] = useState(null);
  const [generating, setGenerating] = useState(false);

  const getToken = () => localStorage.getItem('adminToken');
  const getAuthConfig = () => ({
    headers: { Authorization: `Bearer ${getToken()}` }
  });

  // ✅ Fetch config and analytics
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [configRes, analyticsRes] = await Promise.all([
          axios.get(`${API_URL}/chatbot/config`),
          axios.get(`${API_URL}/chatbot/analytics`, getAuthConfig())
        ]);
        setConfig(configRes.data);
        setAnalytics(analyticsRes.data);
      } catch (err) {
        setError('Failed to load chatbot config');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ✅ Save config
  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await axios.put(`${API_URL}/chatbot/config`, config, getAuthConfig());
      setSuccess('Chatbot updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to save config');
    } finally {
      setSaving(false);
    }
  };

  // ✅ Add knowledge
  const addKnowledge = () => {
    setConfig(prev => ({
      ...prev,
      customKnowledge: [
        ...prev.customKnowledge,
        { topic: '', content: '', isActive: true }
      ]
    }));
  };

  const updateKnowledge = (index, field, value) => {
    setConfig(prev => {
      const updated = [...prev.customKnowledge];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, customKnowledge: updated };
    });
  };

  const removeKnowledge = (index) => {
    setConfig(prev => ({
      ...prev,
      customKnowledge: prev.customKnowledge.filter((_, i) => i !== index)
    }));
  };

  // ✅ Generate blog - saves to draft and redirects to blog panel
  const handleGenerateBlog = async () => {
    if (!blogTopic) {
      setError('Please enter a blog topic');
      return;
    }
    setGenerating(true);
    setGeneratedBlog(null);
    setError('');

    try {
      const { data } = await axios.post(
        `${API_URL}/chatbot/generate-blog`,
        {
          topic: blogTopic,
          category: blogCategory,
          keywords: blogKeywords,
          saveToDraft: true
        },
        getAuthConfig()
      );
      setGeneratedBlog(data);
      setSuccess('Blog generated and saved as draft! Redirecting to Blog panel...');

      // ✅ Redirect to blog panel after 2 seconds
      setTimeout(() => {
        navigate('/admin/blog');
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate blog. Check your Groq API key.');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const tabs = [
    { key: 'general', label: '⚙️ General' },
    { key: 'knowledge', label: '🧠 Knowledge Base' },
    { key: 'security', label: '🔒 Security' },
    { key: 'blog', label: '✍️ Blog Generator' },
    { key: 'analytics', label: '📊 Analytics' }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">🤖 Chatbot Manager</h1>
          <p className="text-gray-500 text-sm mt-1">
            Powered by Groq AI (Llama 3) - Free & Fast
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition flex items-center gap-2 disabled:opacity-60"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : '💾 Save Changes'}
        </button>
      </div>

      {/* Alerts */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-4 text-sm flex items-center gap-2">
          ✅ {success}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm flex items-center gap-2">
          ❌ {error}
          <button onClick={() => setError('')} className="ml-auto">✕</button>
        </div>
      )}

      {/* Stats */}
      {analytics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Chats', value: analytics.totalChats, icon: '💬', color: 'text-blue-600' },
            { label: "Today's Chats", value: analytics.todayChats || 0, icon: '📅', color: 'text-green-600' },
            { label: 'Flagged Chats', value: analytics.flaggedChats, icon: '🚨', color: 'text-red-600' },
            { label: 'Bot Status', value: config?.isActive ? 'Online' : 'Offline', icon: config?.isActive ? '🟢' : '🔴', color: config?.isActive ? 'text-green-600' : 'text-red-600' }
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <p className="text-2xl mb-1">{stat.icon}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Groq AI Status Banner */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-4 mb-6 flex items-center gap-3">
        <span className="text-2xl">🤖</span>
        <div>
          <p className="font-semibold text-purple-800 text-sm">
            Powered by Groq AI (Llama 3) - FREE
          </p>
          <p className="text-purple-600 text-xs mt-0.5">
            Get your free API key at console.groq.com → Add GROQ_API_KEY to your .env file
          </p>
        </div>
        <span className={`ml-auto px-3 py-1 rounded-full text-xs font-bold ${
          config?.isAIEnabled
            ? 'bg-green-100 text-green-700'
            : 'bg-gray-100 text-gray-600'
        }`}>
          {config?.isAIEnabled ? '✅ AI ON' : '⭕ AI OFF'}
        </span>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex border-b border-gray-100 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition ${
                activeTab === tab.key
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">

          {/* ── GENERAL TAB ── */}
          {activeTab === 'general' && config && (
            <div className="space-y-5">

              {/* Bot Status */}
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
                <div>
                  <p className="font-medium text-gray-900">Bot Status</p>
                  <p className="text-sm text-gray-500">Enable or disable the chatbot for customers</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.isActive}
                    onChange={(e) => setConfig(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
                </label>
              </div>

              {/* AI Mode */}
              <div className="flex items-center justify-between bg-purple-50 border border-purple-100 p-4 rounded-xl">
                <div>
                  <p className="font-medium text-gray-900">AI Mode (Groq - Llama 3)</p>
                  <p className="text-sm text-gray-500">Use FREE Groq AI for smarter responses</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.isAIEnabled}
                    onChange={(e) => setConfig(prev => ({ ...prev, isAIEnabled: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600" />
                </label>
              </div>

              {/* Bot Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Bot Name</label>
                <input
                  type="text"
                  value={config.botName}
                  onChange={(e) => setConfig(prev => ({ ...prev, botName: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Welcome Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Welcome Message</label>
                <textarea
                  value={config.welcomeMessage}
                  onChange={(e) => setConfig(prev => ({ ...prev, welcomeMessage: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Language */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Language Mode</label>
                <select
                  value={config.language}
                  onChange={(e) => setConfig(prev => ({ ...prev, language: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="english">English Only</option>
                  <option value="pidgin">Pidgin Only</option>
                  <option value="both">Both (Auto Detect)</option>
                </select>
              </div>
            </div>
          )}

          {/* ── KNOWLEDGE BASE TAB ── */}
          {activeTab === 'knowledge' && config && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Custom Knowledge Base</h3>
                  <p className="text-sm text-gray-500">Train your bot with store-specific information</p>
                </div>
                <button
                  onClick={addKnowledge}
                  className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition"
                >
                  + Add Topic
                </button>
              </div>

              {config.customKnowledge?.map((knowledge, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <input
                      type="text"
                      value={knowledge.topic}
                      onChange={(e) => updateKnowledge(index, 'topic', e.target.value)}
                      placeholder="Topic (e.g. Delivery, Payment)"
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mr-3"
                    />
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-1 text-xs text-gray-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={knowledge.isActive}
                          onChange={(e) => updateKnowledge(index, 'isActive', e.target.checked)}
                          className="accent-blue-600"
                        />
                        Active
                      </label>
                      <button
                        onClick={() => removeKnowledge(index)}
                        className="text-red-500 hover:text-red-700 text-xs font-medium px-2 py-1 rounded transition"
                      >
                        ✕ Remove
                      </button>
                    </div>
                  </div>
                  <textarea
                    value={knowledge.content}
                    onChange={(e) => updateKnowledge(index, 'content', e.target.value)}
                    placeholder="Enter information the bot should know about this topic..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
              ))}
            </div>
          )}

          {/* ── SECURITY TAB ── */}
          {activeTab === 'security' && config && (
            <div className="space-y-5">
              <div className="flex items-center justify-between bg-red-50 border border-red-100 p-4 rounded-xl">
                <div>
                  <p className="font-medium text-gray-900">🔒 Fraud Detection</p>
                  <p className="text-sm text-gray-500">Detect and block scam attempts automatically</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.securityEnabled}
                    onChange={(e) => setConfig(prev => ({ ...prev, securityEnabled: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500" />
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Scam Keywords <span className="text-gray-400 font-normal">(one per line)</span>
                </label>
                <textarea
                  value={config.scamKeywords?.join('\n')}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    scamKeywords: e.target.value.split('\n').filter(Boolean)
                  }))}
                  rows={8}
                  placeholder="send money&#10;wire transfer&#10;bitcoin&#10;gift card"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Security Alert Email</label>
                <input
                  type="email"
                  value={config.securityAlertEmail}
                  onChange={(e) => setConfig(prev => ({ ...prev, securityAlertEmail: e.target.value }))}
                  placeholder="admin@75techstore.com"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {analytics?.flaggedChats > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="font-semibold text-red-700 mb-2">
                    🚨 {analytics.flaggedChats} Suspicious Conversations
                  </p>
                  {analytics.recentChats
                    ?.filter(c => c.isFlagged)
                    .map((chat, i) => (
                      <div key={i} className="bg-white rounded-lg p-3 mb-2 border border-red-100">
                        <p className="text-xs text-red-600 font-medium">{chat.flagReason}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(chat.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))
                  }
                </div>
              )}
            </div>
          )}

          {/* ── BLOG GENERATOR TAB ── */}
          {activeTab === 'blog' && (
            <div className="space-y-5">

              {/* Info Banner */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4">
                <p className="font-semibold text-blue-800">✍️ AI Blog Post Generator</p>
                <p className="text-sm text-blue-600 mt-1">
                  Generate SEO-optimized blog posts using <strong>Groq AI (Free)</strong>.
                  Generated posts are automatically saved as <strong>drafts</strong> in your Blog panel.
                  You can then add images and publish from there!
                </p>
              </div>

              {/* How it works */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { step: '1', label: 'Enter Topic', icon: '✏️' },
                  { step: '2', label: 'AI Generates', icon: '🤖' },
                  { step: '3', label: 'Saved to Blog Panel', icon: '📝' }
                ].map(s => (
                  <div key={s.step} className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                    <p className="text-2xl mb-1">{s.icon}</p>
                    <p className="text-xs text-gray-500">Step {s.step}</p>
                    <p className="text-sm font-medium text-gray-700">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Topic */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Blog Topic <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={blogTopic}
                  onChange={(e) => setBlogTopic(e.target.value)}
                  placeholder="e.g. Best smartphones under ₦100,000 in Nigeria 2025"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Category + Keywords */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                  <select
                    value={blogCategory}
                    onChange={(e) => setBlogCategory(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {['Tech News', 'Product Reviews', 'How To', 'Deals & Offers', 'Gaming', 'Phones', 'Laptops', 'Accessories', 'Other'].map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Keywords</label>
                  <input
                    type="text"
                    value={blogKeywords}
                    onChange={(e) => setBlogKeywords(e.target.value)}
                    placeholder="e.g. smartphone, nigeria, budget"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerateBlog}
                disabled={generating || !blogTopic}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl font-semibold transition disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {generating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating with Groq AI...
                  </>
                ) : '🤖 Generate & Save to Blog Panel'}
              </button>

              {/* Generated Preview */}
              {generatedBlog && (
                <div className="bg-white border border-green-200 rounded-xl p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-green-500 text-xl">✅</span>
                    <div>
                      <h3 className="font-bold text-gray-900">Blog Generated Successfully!</h3>
                      <p className="text-sm text-green-600">
                        Saved as draft in Blog Panel · Redirecting you now...
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase">Title</p>
                      <p className="text-sm font-bold text-gray-900">{generatedBlog.title}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase">Category</p>
                      <p className="text-sm text-gray-700">{generatedBlog.category}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase">Tags</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {generatedBlog.tags?.map((tag, i) => (
                          <span key={i} className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase">Read Time</p>
                      <p className="text-sm text-gray-700">{generatedBlog.readTime} min read</p>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate('/admin/blog')}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl text-sm font-semibold transition"
                  >
                    📝 Go to Blog Panel Now
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── ANALYTICS TAB ── */}
          {activeTab === 'analytics' && analytics && (
            <div className="space-y-4">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                {[
                  { label: 'Total Conversations', value: analytics.totalChats, color: 'text-blue-600' },
                  { label: "Today's Chats", value: analytics.todayChats || 0, color: 'text-green-600' },
                  { label: 'Flagged Suspicious', value: analytics.flaggedChats, color: 'text-red-600' },
                  { label: 'English Chats', value: analytics.englishChats || 0, color: 'text-purple-600' },
                  { label: 'Pidgin Chats', value: analytics.pidginChats || 0, color: 'text-orange-600' },
                ].map((stat, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-xs text-gray-500">{stat.label}</p>
                    <p className={`text-2xl font-bold ${stat.color} mt-1`}>{stat.value}</p>
                  </div>
                ))}
              </div>

              <h3 className="font-semibold text-gray-900">Recent Conversations</h3>

              {analytics.recentChats?.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  <p className="text-3xl mb-2">💬</p>
                  <p>No conversations yet</p>
                </div>
              ) : (
                analytics.recentChats?.map((chat, i) => (
                  <div key={i} className={`rounded-xl p-4 border ${
                    chat.isFlagged ? 'bg-red-50 border-red-200' : 'bg-white border-gray-100'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{chat.isFlagged ? '🚨' : '💬'}</span>
                        <div>
                          <p className="text-xs font-medium text-gray-700">
                            Session: {chat.sessionId?.substring(0, 20)}...
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(chat.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {chat.language && (
                          <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                            {chat.language}
                          </span>
                        )}
                        {chat.isFlagged && (
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
                            🚨 Flagged
                          </span>
                        )}
                      </div>
                    </div>
                    {chat.flagReason && (
                      <p className="text-xs text-red-600 mt-2 bg-red-50 p-2 rounded-lg">
                        Reason: {chat.flagReason}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatbotManager;