// src/admin/pages/ChatbotManager.jsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FiSettings, FiCpu, FiShield, FiEdit, FiBarChart2,
  FiRefreshCw, FiSave, FiCheckCircle, FiAlertTriangle,
  FiPlusCircle, FiTrash2, FiX, FiZap, FiActivity, FiSend
} from 'react-icons/fi';

const API_URL = 'http://localhost:5000/api';

// Safe header retrieval helper
const getHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
});

const ChatbotManager = () => {
  const navigate = useNavigate();
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('general');
  const [analytics, setAnalytics] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Blog Generator State
  const [blogTopic, setBlogTopic] = useState('');
  const [blogCategory, setBlogCategory] = useState('Tech News');
  const [blogKeywords, setBlogKeywords] = useState('');
  const [generatedBlog, setGeneratedBlog] = useState(null);
  const [generating, setGenerating] = useState(false);

  // Strict Mount Lock Ref to prevent duplicate concurrent mount requests
  const hasFetchedOnMount = useRef(false);

  // Stable data fetch handler
  const fetchData = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const headers = getHeaders();
      const [configRes, analyticsRes] = await Promise.all([
        axios.get(`${API_URL}/chatbot/config`, headers),
        axios.get(`${API_URL}/chatbot/analytics`, headers)
      ]);
      setConfig(configRes.data);
      setAnalytics(analyticsRes.data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Chatbot fetch error:', err);
      setError('Failed to load chatbot data. Please verify authorization.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Safe Mount Trigger (Prevents React 18 Strict Mode double-firing)
  useEffect(() => {
    if (!hasFetchedOnMount.current) {
      hasFetchedOnMount.current = true;
      fetchData();
    }
  }, [fetchData]);

  // Safe auto-refresh every 45 seconds (increased from 30s to mitigate 429 errors)
  useEffect(() => {
    const interval = setInterval(() => {
      // Only poll if the tab is active to save system/network resources
      if (document.visibilityState === 'visible') {
        fetchData(true);
      }
    }, 45000);

    return () => clearInterval(interval);
  }, [fetchData]);

  const showSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 4000);
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await axios.put(`${API_URL}/chatbot/config`, config, getHeaders());
      showSuccess('✅ Chatbot updated successfully!');
    } catch {
      setError('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const addKnowledge = () => {
    setConfig(prev => ({
      ...prev,
      customKnowledge: [
        ...(prev.customKnowledge || []),
        { topic: '', content: '', isActive: true }
      ]
    }));
  };

  const updateKnowledge = (i, field, value) => {
    setConfig(prev => {
      const updated = [...prev.customKnowledge];
      updated[i] = { ...updated[i], [field]: value };
      return { ...prev, customKnowledge: updated };
    });
  };

  const removeKnowledge = (i) => {
    setConfig(prev => ({
      ...prev,
      customKnowledge: prev.customKnowledge.filter((_, idx) => idx !== i)
    }));
  };

  const handleGenerateBlog = async () => {
    if (!blogTopic.trim()) {
      setError('Please enter a blog topic');
      return;
    }
    setGenerating(true);
    setGeneratedBlog(null);
    setError('');

    try {
      const { data } = await axios.post(
        `${API_URL}/chatbot/generate-blog`,
        { topic: blogTopic, category: blogCategory, keywords: blogKeywords, saveToDraft: true },
        getHeaders()
      );
      setGeneratedBlog(data);
      showSuccess('🚀 Blog generated and saved as draft!');
      setTimeout(() => navigate('/admin/blog'), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate blog. Verify Groq API key.');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-500 text-sm font-medium">Loading Chatbot Manager...</p>
      </div>
    );
  }

  const tabs = [
    { key: 'general', label: 'General', icon: <FiSettings size={15} /> },
    { key: 'knowledge', label: 'Knowledge', icon: <FiCpu size={15} /> },
    { key: 'security', label: 'Security', icon: <FiShield size={15} /> },
    { key: 'blog', label: 'AI Blog', icon: <FiEdit size={15} /> },
    { key: 'analytics', label: 'Analytics', icon: <FiBarChart2 size={15} /> }
  ];

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen space-y-5">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <FiZap className="text-purple-600" />
            Chatbot Manager
          </h1>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-gray-400 text-xs">Powered by Groq AI (Llama 3)</p>
            {lastUpdated && (
              <span className="flex items-center gap-1.5 text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"/>
                  <span className="relative rounded-full h-1.5 w-1.5 bg-green-500"/>
                </span>
                Live · {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchData()}
            className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 
                       px-3.5 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2 shadow-sm">
            <FiRefreshCw size={14} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700
                       text-white px-4 py-2 rounded-xl font-semibold text-sm transition
                       flex items-center gap-2 shadow-md disabled:opacity-60">
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <FiSave size={15} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* ALERTS */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2 font-medium">
          <FiCheckCircle /> {success}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2 font-medium">
          <FiAlertTriangle /> {error}
          <button onClick={() => setError('')} className="ml-auto"><FiX size={14} /></button>
        </div>
      )}

      {/* STATS GRID */}
      {analytics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: 'Total Chats', value: analytics.totalChats, icon: '💬', color: 'from-blue-500 to-blue-700' },
            { label: 'Today', value: analytics.todayChats || 0, icon: '📅', color: 'from-green-500 to-emerald-600' },
            { label: 'Flagged', value: analytics.flaggedChats, icon: '🚨', color: 'from-red-500 to-red-700' },
            { label: 'Bot Status', value: config?.isActive ? 'Online' : 'Offline', icon: config?.isActive ? '🟢' : '🔴', color: config?.isActive ? 'from-teal-500 to-green-600' : 'from-gray-400 to-gray-500' }
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-all">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-lg mb-2`}>
                <span>{stat.icon}</span>
              </div>
              <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
              <p className="text-xl font-extrabold text-gray-900 mt-0.5">{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* AI STATUS BANNER */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 rounded-2xl p-4 text-white flex items-center gap-3 shadow-lg">
        <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center text-2xl">🤖</div>
        <div className="flex-1">
          <p className="font-bold text-sm">Groq AI (Llama 3) Integration</p>
          <p className="text-purple-100 text-xs mt-0.5">
            Get free API key at <span className="font-mono bg-white/10 px-1.5 py-0.5 rounded">console.groq.com</span> · Add to backend .env
          </p>
        </div>
        <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
          config?.isAIEnabled ? 'bg-white text-green-700' : 'bg-white/20 text-white'
        }`}>
          {config?.isAIEnabled ? 'AI ON ✅' : 'AI OFF ⭕'}
        </span>
      </div>

      {/* TABS CONTAINER */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="flex border-b border-gray-100 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition ${
                activeTab === tab.key
                  ? 'border-blue-600 text-blue-600 bg-blue-50/30'
                  : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50'
              }`}>
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-5 sm:p-6">
          {/* GENERAL TAB */}
          {activeTab === 'general' && config && (
            <div className="space-y-4">
              {[
                { label: 'Bot Status', desc: 'Enable or disable for all customers', key: 'isActive' },
                { label: 'AI Mode', desc: 'Use Groq AI for smarter responses', key: 'isAIEnabled' }
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{item.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={config[item.key] || false}
                      onChange={(e) => setConfig(p => ({ ...p, [item.key]: e.target.checked }))}
                      className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer 
                                     peer-checked:after:translate-x-full peer-checked:after:border-white
                                     after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                                     after:bg-white after:border-gray-300 after:border after:rounded-full
                                     after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
                  </label>
                </div>
              ))}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Bot Name</label>
                <input type="text" value={config.botName || ''}
                  onChange={(e) => setConfig(p => ({ ...p, botName: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Welcome Message</label>
                <textarea value={config.welcomeMessage || ''}
                  onChange={(e) => setConfig(p => ({ ...p, welcomeMessage: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Language Mode</label>
                <select value={config.language || 'english'}
                  onChange={(e) => setConfig(p => ({ ...p, language: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="english">🇬🇧 English Only</option>
                  <option value="pidgin">🇳🇬 Pidgin Only</option>
                  <option value="both">🌍 Both (Auto Detect)</option>
                </select>
              </div>
            </div>
          )}

          {/* KNOWLEDGE BASE TAB */}
          {activeTab === 'knowledge' && config && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-bold text-gray-900">Knowledge Base</h3>
                  <p className="text-sm text-gray-500">Train your bot with store-specific info</p>
                </div>
                <button onClick={addKnowledge}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5 transition shadow-sm">
                  <FiPlusCircle size={15} />
                  Add Topic
                </button>
              </div>

              {(!config.customKnowledge || config.customKnowledge.length === 0) ? (
                <div className="text-center py-14 text-gray-400 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                  <FiCpu size={30} className="mx-auto mb-2 text-gray-300" />
                  <p className="text-sm font-medium">No knowledge added yet</p>
                  <p className="text-xs mt-1">Add topics like Delivery, Payment, Warranty</p>
                </div>
              ) : (
                config.customKnowledge.map((k, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-blue-200 transition">
                    <div className="flex items-center gap-2 mb-2">
                      <input type="text" value={k.topic}
                        onChange={(e) => updateKnowledge(i, 'topic', e.target.value)}
                        placeholder="Topic name..."
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                      <label className="flex items-center gap-1 text-xs text-gray-600 cursor-pointer bg-white px-2 py-2 rounded-lg border border-gray-200">
                        <input type="checkbox" checked={k.isActive}
                          onChange={(e) => updateKnowledge(i, 'isActive', e.target.checked)}
                          className="accent-blue-600" />
                        Active
                      </label>
                      <button onClick={() => removeKnowledge(i)}
                        className="text-red-500 hover:text-white hover:bg-red-500 p-2 rounded-lg transition">
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                    <textarea value={k.content}
                      onChange={(e) => updateKnowledge(i, 'content', e.target.value)}
                      placeholder="What should the bot know about this topic?"
                      rows={3}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
                  </div>
                ))
              )}
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'security' && config && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-red-50 border border-red-100">
                <div>
                  <p className="font-semibold text-gray-900 text-sm">🔒 Fraud Detection</p>
                  <p className="text-xs text-gray-500 mt-0.5">Block scam attempts automatically</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={config.securityEnabled || false}
                    onChange={(e) => setConfig(p => ({ ...p, securityEnabled: e.target.checked }))}
                    className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer 
                                  peer-checked:after:translate-x-full peer-checked:after:border-white
                                  after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                                  after:bg-white after:border-gray-300 after:border after:rounded-full
                                  after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500" />
                </label>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Scam Keywords <span className="text-gray-400 font-normal text-xs">(one per line)</span>
                </label>
                <textarea value={config.scamKeywords?.join('\n') || ''}
                  onChange={(e) => setConfig(p => ({ ...p, scamKeywords: e.target.value.split('\n').filter(Boolean) }))}
                  rows={7}
                  placeholder="send money&#10;wire transfer&#10;bitcoin&#10;gift card"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Security Alert Email</label>
                <input type="email" value={config.securityAlertEmail || ''}
                  onChange={(e) => setConfig(p => ({ ...p, securityAlertEmail: e.target.value }))}
                  placeholder="admin@75techstore.com"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              {analytics?.flaggedChats > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mt-4">
                  <p className="font-bold text-red-700 mb-2 flex items-center gap-2">
                    <FiAlertTriangle /> {analytics.flaggedChats} Flagged Conversations
                  </p>
                  {analytics.recentChats?.filter(c => c.isFlagged).map((chat, i) => (
                    <div key={i} className="bg-white rounded-lg p-3 mb-2 border border-red-100">
                      <p className="text-xs text-red-600 font-semibold">{chat.flagReason}</p>
                      <p className="text-xs text-gray-400 mt-1">{new Date(chat.createdAt).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* AI BLOG GENERATOR */}
          {activeTab === 'blog' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-4">
                <p className="font-bold text-purple-800">✍️ AI Blog Post Generator</p>
                <p className="text-sm text-purple-600 mt-1">
                  Generate SEO-optimized posts using Groq AI. Auto-saved as drafts in Blog panel.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { step: '1', label: 'Enter Topic', icon: '✏️' },
                  { step: '2', label: 'AI Generates', icon: '🤖' },
                  { step: '3', label: 'Auto Saved', icon: '💾' }
                ].map(s => (
                  <div key={s.step} className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                    <p className="text-2xl mb-1">{s.icon}</p>
                    <p className="text-[10px] uppercase text-gray-400 font-bold">Step {s.step}</p>
                    <p className="text-sm font-semibold text-gray-800">{s.label}</p>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Blog Topic <span className="text-red-500">*</span>
                </label>
                <input type="text" value={blogTopic}
                  onChange={(e) => setBlogTopic(e.target.value)}
                  placeholder="e.g. Best smartphones under ₦100,000 in Nigeria 2025"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                  <select value={blogCategory} onChange={(e) => setBlogCategory(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none">
                    {['Tech News', 'Product Reviews', 'How To', 'Deals & Offers', 'Gaming', 'Phones', 'Laptops', 'Accessories', 'Other'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Keywords</label>
                  <input type="text" value={blogKeywords} onChange={(e) => setBlogKeywords(e.target.value)}
                    placeholder="e.g. smartphone, nigeria, budget"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none" />
                </div>
              </div>

              <button onClick={handleGenerateBlog} disabled={generating || !blogTopic}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700
                           text-white py-3 rounded-xl font-bold transition disabled:opacity-60 flex items-center justify-center gap-2 shadow-md">
                {generating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating with Groq AI...
                  </>
                ) : (
                  <>
                    <FiSend />
                    Generate & Save to Blog
                  </>
                )}
              </button>

              {generatedBlog && (
                <div className="bg-white border-2 border-green-200 rounded-2xl p-5 space-y-3 shadow-md">
                  <div className="flex items-center gap-2">
                    <FiCheckCircle className="text-green-500" size={22} />
                    <div>
                      <h3 className="font-bold text-gray-900">Blog Generated!</h3>
                      <p className="text-sm text-green-600">Redirecting to blog panel...</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                    <p><span className="text-xs uppercase text-gray-400 font-bold">Title:</span> <strong>{generatedBlog.title}</strong></p>
                    <p><span className="text-xs uppercase text-gray-400 font-bold">Read Time:</span> {generatedBlog.readTime} min</p>
                    <div className="flex flex-wrap gap-1 pt-2">
                      {generatedBlog.tags?.map((t, i) => (
                        <span key={i} className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ANALYTICS TAB */}
          {activeTab === 'analytics' && analytics && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: 'Total Chats', value: analytics.totalChats, color: 'bg-blue-50 text-blue-700' },
                  { label: "Today", value: analytics.todayChats || 0, color: 'bg-green-50 text-green-700' },
                  { label: 'Flagged', value: analytics.flaggedChats, color: 'bg-red-50 text-red-700' },
                  { label: 'English', value: analytics.englishChats || 0, color: 'bg-purple-50 text-purple-700' },
                  { label: 'Pidgin', value: analytics.pidginChats || 0, color: 'bg-orange-50 text-orange-700' },
                  { label: 'Active Now', value: config?.isActive ? '1' : '0', color: 'bg-teal-50 text-teal-700' }
                ].map((s, i) => (
                  <div key={i} className={`${s.color} rounded-xl p-4 border border-gray-100 shadow-sm`}>
                    <p className="text-xs font-medium opacity-80">{s.label}</p>
                    <p className="text-2xl font-extrabold mt-1">{s.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-3">
                  <FiActivity className="text-blue-600" />
                  Recent Conversations
                </h3>
                {(!analytics.recentChats || analytics.recentChats.length === 0) ? (
                  <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <p className="text-3xl mb-2">💬</p>
                    <p className="text-sm font-medium">No conversations yet</p>
                  </div>
                ) : (
                  analytics.recentChats.map((chat, i) => (
                    <div key={i} className={`rounded-xl p-4 border mb-2 ${
                      chat.isFlagged ? 'bg-red-50 border-red-200' : 'bg-white border-gray-100 hover:border-blue-200'
                    } transition`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{chat.isFlagged ? '🚨' : '💬'}</span>
                          <div>
                            <p className="text-xs font-semibold text-gray-700">
                              Session: <span className="font-mono">{chat.sessionId?.substring(0, 24)}...</span>
                            </p>
                            <p className="text-[10px] text-gray-400">
                              {new Date(chat.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-1.5">
                          {chat.language && (
                            <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                              {chat.language}
                            </span>
                          )}
                          {chat.isFlagged && (
                            <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">
                              🚨 Flagged
                            </span>
                          )}
                        </div>
                      </div>
                      {chat.flagReason && (
                        <p className="text-xs text-red-600 mt-2 bg-red-100/40 p-2 rounded-lg">
                          {chat.flagReason}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatbotManager;