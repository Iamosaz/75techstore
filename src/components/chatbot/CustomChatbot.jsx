// src/components/chatbot/CustomChatbot.jsx
import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import {
  FaRobot,
  FaTimes,
  FaPaperPlane,
  FaExclamationTriangle,
  FaMinus,
  FaInfoCircle
} from 'react-icons/fa'
import { trackEvent } from '../../utils/trafficTracker' // ✅ Link directly to your SEO & Conversion dashboard

// ✅ Use environment variable with a robust fallback
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function CustomChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showQuickReplies, setShowQuickReplies] = useState(true)
  const [config, setConfig] = useState(null)
  const [securityAlert, setSecurityAlert] = useState(false)
  const messagesEndRef = useRef(null)

  // ✅ Retrieve the unified session ID from your tracking system so journeys are completely synced
  const getSessionId = () => {
    let id = sessionStorage.getItem("75tech_analytics_session")
    if (!id) {
      id = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      sessionStorage.setItem("75tech_analytics_session", id)
    }
    return id
  }

  const sessionId = getSessionId()

  // Fetch bot configurations on mount
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/chatbot/config`)
        setConfig(data)
        setMessages([{
          id: 1,
          text: data.welcomeMessage ||
            "Hi! 👋 I'm Weby, your 75TechStore Assistant. How can I help you today?",
          sender: 'bot',
          timestamp: new Date()
        }])
      } catch (err) {
        setMessages([{
          id: 1,
          text: "Hi! 👋 I'm Weby, your 75TechStore Assistant. How can I help you today?",
          sender: 'bot',
          timestamp: new Date()
        }])
      }
    }
    fetchConfig()
  }, [])

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Track when user opens the chat bubble
  const handleOpenChat = () => {
    setIsOpen(true)
    setIsMinimized(false)
    trackEvent("chatbot_opened", { sessionId })
  }

  // Sanitize message input (Amazon-level client-side sanitization)
  const sanitizeMessage = (text) => {
    return text
      .replace(/<script[^>]*>([\S\s]*?)<\/script>/gi, '') // Strip script tags
      .replace(/on\w+\s*=/gi, '') // Strip inline JS handlers
      .replace(/[\$\{\}]/g, '') // Strip NoSQL/Shell operators
      .trim()
  }

  const handleSendMessage = async (messageText = inputValue) => {
    const cleanText = sanitizeMessage(messageText)
    if (!cleanText) return

    const userMessage = {
      id: messages.length + 1,
      text: cleanText,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setShowQuickReplies(false)
    setIsLoading(true)
    setSecurityAlert(false)

    // ✅ Track message event in real-time analytics
    trackEvent("chatbot_message_sent", {
      text: cleanText.substring(0, 100),
      sessionId
    })

    try {
      const { data } = await axios.post(`${API_URL}/chatbot/chat`, {
        message: cleanText,
        sessionId
      })

      const isSuspicious = data.isScam || data.flagged

      if (isSuspicious) {
        setSecurityAlert(true)
        // ✅ Track blocked attack attempts or scams directly in your dashboard
        trackEvent("security_alert_triggered", {
          messageSnippet: cleanText.substring(0, 50),
          sessionId
        })
      }

      setMessages(prev => [...prev, {
        id: prev.length + 2,
        text: data.response,
        sender: 'bot',
        timestamp: new Date(),
        isAlert: isSuspicious
      }])

    } catch (err) {
      setMessages(prev => [...prev, {
        id: prev.length + 2,
        text: "Sorry, I'm experiencing connectivity issues. You can reach our support line directly at +234 706 645 9689",
        sender: 'bot',
        timestamp: new Date()
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const quickReplies = config?.quickReplies?.filter(q => q.isActive) || [
    { icon: '🛍️', text: 'Browse Products', query: 'Show me your products' },
    { icon: '📞', text: 'Contact Info', query: 'How can I contact you?' },
    { icon: '🔧', text: 'Repair Services', query: 'Tell me about repair services' },
    { icon: '❓', text: 'FAQs', query: 'What are your FAQs?' }
  ]

  return (
    <>
      {/* ─── FLOATING CHAT LAUNCHER ─── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}
          >
            <button onClick={handleOpenChat} className="outline-none focus:outline-none">
              <motion.div
                className="relative"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* Active Notification Dot */}
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-black shadow-lg z-10 animate-pulse">
                  1
                </div>
                
                {/* Main Floating Button */}
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-white shadow-2xl cursor-pointer hover:scale-110 transition-all duration-300">
                  <FaRobot size={24} />
                </div>

                {/* Glowing Outer Ring */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-blue-500 pointer-events-none"
                  animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                />
              </motion.div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── CHAT CONSOLE WINDOW ─── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 40 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              zIndex: 9999,
              height: isMinimized ? 'auto' : '520px',
              width: '360px',
              maxWidth: 'calc(100vw - 48px)'
            }}
            className="bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-150 backdrop-blur-md"
          >
            {/* Header Block */}
            <div className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 text-white px-5 py-4 flex items-center justify-between flex-shrink-0 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                  <FaRobot size={18} className="text-blue-400" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm tracking-wide">{config?.botName || 'Weby'}</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-ping" />
                    <p className="text-white/60 text-[10px] font-bold uppercase tracking-wider">Online Assistant</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition text-white/80 hover:text-white"
                  title={isMinimized ? 'Expand' : 'Minimize'}
                >
                  <FaMinus size={12} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-red-500/20 rounded-lg transition text-white/80 hover:text-red-400"
                  title="Close chat"
                >
                  <FaTimes size={14} />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Security Alert Strip */}
                {securityAlert && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="bg-red-50 border-b border-red-200 px-4 py-2 flex items-center gap-2 flex-shrink-0"
                  >
                    <FaExclamationTriangle className="text-red-500 flex-shrink-0" size={13} />
                    <p className="text-red-700 text-xs font-bold leading-tight">
                      System Protection: Input flagged. Request denied.
                    </p>
                  </motion.div>
                )}

                {/* Messages Body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50 scrollbar-thin">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.sender === 'bot' && (
                        <div className="w-7 h-7 bg-gray-900 rounded-full flex items-center justify-center text-white flex-shrink-0 border">
                          <FaRobot size={11} className="text-blue-400" />
                        </div>
                      )}
                      
                      <div className={`max-w-[78%] px-4 py-3 rounded-2xl text-xs leading-relaxed shadow-sm ${
                        msg.sender === 'user'
                          ? 'bg-blue-600 text-white rounded-br-none font-medium'
                          : msg.isAlert
                          ? 'bg-red-50 border border-red-200 text-red-800 rounded-bl-none font-semibold'
                          : 'bg-white text-gray-800 rounded-bl-none border border-gray-100 font-medium'
                      }`}>
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                        <span className={`text-[9px] mt-1.5 block text-right font-mono ${
                          msg.sender === 'user' ? 'text-blue-200' : 'text-gray-400'
                        }`}>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </motion.div>
                  ))}

                  {/* Typing Indicator */}
                  {isLoading && (
                    <div className="flex justify-start items-end gap-2">
                      <div className="w-7 h-7 bg-gray-900 rounded-full flex items-center justify-center text-white flex-shrink-0 border">
                        <FaRobot size={11} className="text-blue-400" />
                      </div>
                      <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none shadow-sm border border-gray-150">
                        <div className="flex gap-1.5 py-1">
                          {[0, 0.15, 0.3].map((delay, i) => (
                            <motion.div
                              key={i}
                              className="w-2.5 h-2.5 bg-blue-500 rounded-full"
                              animate={{ y: [0, -6, 0] }}
                              transition={{ duration: 0.5, repeat: Infinity, delay }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Quick Replies */}
                  {showQuickReplies && !isLoading && messages.length <= 1 && (
                    <motion.div className="space-y-2 pt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider flex items-center gap-1">
                        <FaInfoCircle /> Quick Actions
                      </p>
                      
                      <div className="grid grid-cols-1 gap-2">
                        {quickReplies.map((reply, index) => (
                          <motion.button
                            key={index}
                            onClick={() => {
                              trackEvent("chatbot_quick_action_clicked", { label: reply.text });
                              handleSendMessage(reply.query);
                            }}
                            whileHover={{ scale: 1.01, x: 2 }}
                            className="w-full flex items-center gap-3 p-3 bg-white border border-gray-150 hover:border-blue-400 hover:bg-blue-50/50 rounded-xl transition text-left shadow-sm"
                          >
                            <span className="text-sm bg-gray-50 p-1.5 rounded-lg border">{reply.icon}</span>
                            <span className="font-bold text-gray-800 text-[11px]">{reply.text}</span>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Footer Controls */}
                <div className="border-t border-gray-100 p-3 bg-white flex gap-2 flex-shrink-0">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    maxLength={250}
                    placeholder="Ask Weby anything..."
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-full focus:outline-none focus:border-blue-500 text-xs text-gray-900 placeholder-gray-400 bg-gray-50 focus:bg-white transition"
                  />
                  <motion.button
                    onClick={() => handleSendMessage()}
                    disabled={isLoading || !inputValue.trim()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 shadow-md shadow-blue-500/20"
                  >
                    <FaPaperPlane size={12} />
                  </motion.button>
                </div>

                {/* Security Badge Footer */}
                <div className="bg-gray-50 border-t border-gray-100 px-4 py-2 text-center flex-shrink-0">
                  <p className="text-[9px] text-gray-400 uppercase tracking-widest font-black flex items-center justify-center gap-1">
                    <span>🛡️ End-to-End Encrypted Secure Connection</span>
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}