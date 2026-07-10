import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import {
  FaRobot, FaTimes, FaPaperPlane,
  FaExclamationTriangle, FaMinus
} from 'react-icons/fa'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const generateSessionId = () => {
  return 'session_' + Date.now() + '_' +
    Math.random().toString(36).substr(2, 9)
}

const CustomChatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showQuickReplies, setShowQuickReplies] = useState(true)
  const [config, setConfig] = useState(null)
  const [sessionId] = useState(generateSessionId())
  const [securityAlert, setSecurityAlert] = useState(false)
  const messagesEndRef = useRef(null)

  // ✅ Fetch bot config
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/chatbot/config`)
        setConfig(data)
        setMessages([{
          id: 1,
          text: data.welcomeMessage ||
            "Hi! 👋 I'm Weby, your 75TechStore Assistant. How can I help?",
          sender: 'bot',
          timestamp: new Date()
        }])
      } catch (err) {
        setMessages([{
          id: 1,
          text: "Hi! 👋 I'm Weby, your 75TechStore Assistant. How can I help?",
          sender: 'bot',
          timestamp: new Date()
        }])
      }
    }
    fetchConfig()
  }, [])

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // ✅ Send message
  const handleSendMessage = async (messageText = inputValue) => {
    if (!messageText.trim()) return

    const userMessage = {
      id: messages.length + 1,
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setShowQuickReplies(false)
    setIsLoading(true)
    setSecurityAlert(false)

    try {
      const { data } = await axios.post(`${API_URL}/chatbot/chat`, {
        message: messageText,
        sessionId
      })

      if (data.isScam || data.flagged) {
        setSecurityAlert(true)
      }

      setMessages(prev => [...prev, {
        id: prev.length + 2,
        text: data.response,
        sender: 'bot',
        timestamp: new Date(),
        isAlert: data.isScam || data.flagged
      }])

    } catch (err) {
      setMessages(prev => [...prev, {
        id: prev.length + 2,
        text: "Sorry, I'm having trouble. Please call +234 703 562 0709",
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
      {/* ✅ Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              zIndex: 9999
            }}
          >
            <button
              onClick={() => {
                setIsOpen(true)
                setIsMinimized(false)
              }}
            >
              <motion.div
                className="relative"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {/* Badge */}
                <div className="absolute -top-1 -right-1 w-5 h-5
                  bg-red-500 rounded-full flex items-center justify-center
                  text-white text-xs font-bold animate-pulse shadow-lg z-10">
                  1
                </div>

                {/* Button */}
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500
                  to-blue-700 rounded-full flex items-center justify-center
                  text-white shadow-2xl cursor-pointer hover:scale-110
                  transition-transform duration-300">
                  <FaRobot size={24} />
                </div>

                {/* Pulse Ring */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2
                    border-blue-400 pointer-events-none"
                  animate={{ scale: [1, 1.5], opacity: [0.8, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              zIndex: 9999,
              // ✅ Single style - height based on minimized state
              height: isMinimized ? 'auto' : '480px',
              width: '350px',
              maxWidth: 'calc(100vw - 48px)'
            }}
            className="bg-white rounded-2xl shadow-2xl flex flex-col
              overflow-hidden border border-gray-200"
          >
            {/* ✅ Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700
              text-white px-4 py-3 flex items-center justify-between
              flex-shrink-0">

              {/* Bot Info */}
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-white/20 rounded-full
                  flex items-center justify-center flex-shrink-0">
                  <FaRobot size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-tight">
                    {config?.botName || 'Weby'}
                  </h3>
                  <div className="flex items-center gap-1 mt-0.5">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full
                      animate-pulse" />
                    <p className="text-blue-100 text-xs">Online</p>
                  </div>
                </div>
              </div>

              {/* ✅ Minimize + Close Buttons */}
              <div className="flex items-center gap-1">

                {/* Minimize */}
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 hover:bg-white/20 rounded-lg
                    transition text-white/80 hover:text-white"
                  title={isMinimized ? 'Expand' : 'Minimize'}
                >
                  <FaMinus size={12} />
                </button>

                {/* ✅ Close */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-red-500 rounded-lg
                    transition text-white/80 hover:text-white"
                  title="Close chat"
                >
                  <FaTimes size={14} />
                </button>
              </div>
            </div>

            {/* ✅ Body - hides when minimized */}
            {!isMinimized && (
              <>
                {/* Security Alert */}
                {securityAlert && (
                  <div className="bg-red-50 border-b border-red-200
                    px-4 py-2 flex items-center gap-2 flex-shrink-0">
                    <FaExclamationTriangle
                      className="text-red-500 flex-shrink-0"
                      size={12}
                    />
                    <p className="text-red-600 text-xs font-medium">
                      ⚠️ Suspicious activity detected! Be careful.
                    </p>
                  </div>
                )}

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3
                  bg-gray-50">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex items-end gap-2 ${
                        msg.sender === 'user'
                          ? 'justify-end'
                          : 'justify-start'
                      }`}
                    >
                      {/* Bot Avatar */}
                      {msg.sender === 'bot' && (
                        <div className="w-7 h-7 bg-blue-600 rounded-full
                          flex items-center justify-center text-white
                          flex-shrink-0">
                          <FaRobot size={12} />
                        </div>
                      )}

                      {/* Message Bubble */}
                      <div className={`max-w-[75%] px-3.5 py-2.5
                        rounded-2xl text-sm ${
                          msg.sender === 'user'
                            ? 'bg-blue-600 text-white rounded-br-sm'
                            : msg.isAlert
                              ? 'bg-red-50 border border-red-200 text-red-800 rounded-bl-sm'
                              : 'bg-white text-gray-900 rounded-bl-sm shadow-sm border border-gray-100'
                        }`}
                      >
                        <p className="whitespace-pre-wrap leading-relaxed">
                          {msg.text}
                        </p>
                        <span className={`text-[10px] mt-1 block ${
                          msg.sender === 'user'
                            ? 'text-blue-200'
                            : 'text-gray-400'
                        }`}>
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </motion.div>
                  ))}

                  {/* Loading Dots */}
                  {isLoading && (
                    <div className="flex justify-start items-end gap-2">
                      <div className="w-7 h-7 bg-blue-600 rounded-full
                        flex items-center justify-center text-white
                        flex-shrink-0">
                        <FaRobot size={12} />
                      </div>
                      <div className="bg-white px-4 py-3 rounded-2xl
                        rounded-bl-sm shadow-sm border border-gray-100">
                        <div className="flex gap-1.5">
                          {[0, 0.15, 0.3].map((delay, i) => (
                            <motion.div
                              key={i}
                              className="w-2 h-2 bg-blue-500 rounded-full"
                              animate={{ y: [0, -6, 0] }}
                              transition={{
                                duration: 0.5,
                                repeat: Infinity,
                                delay
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Quick Replies */}
                  {showQuickReplies && !isLoading &&
                    messages.length <= 1 && (
                    <motion.div
                      className="space-y-2 pt-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <p className="text-xs text-gray-400 font-medium
                        uppercase tracking-wide">
                        Quick Actions
                      </p>
                      {quickReplies.map((reply, index) => (
                        <motion.button
                          key={index}
                          onClick={() => handleSendMessage(reply.query)}
                          whileHover={{ scale: 1.01, x: 3 }}
                          className="w-full flex items-center gap-2.5
                            p-2.5 bg-white border border-gray-200
                            hover:border-blue-400 hover:bg-blue-50
                            rounded-xl transition text-left"
                        >
                          <span className="text-base">{reply.icon}</span>
                          <span className="font-medium text-gray-800
                            text-xs">
                            {reply.text}
                          </span>
                        </motion.button>
                      ))}
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="border-t border-gray-100 p-3 bg-white
                  flex gap-2 flex-shrink-0">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="flex-1 px-3.5 py-2 border border-gray-200
                      rounded-full focus:outline-none focus:border-blue-500
                      text-sm text-gray-900 placeholder-gray-400 bg-gray-50"
                  />
                  <motion.button
                    onClick={() => handleSendMessage()}
                    disabled={isLoading || !inputValue.trim()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2.5 bg-blue-600 hover:bg-blue-700
                      text-white rounded-full transition disabled:opacity-50
                      disabled:cursor-not-allowed flex-shrink-0"
                  >
                    <FaPaperPlane size={14} />
                  </motion.button>
                </div>

                {/* Footer */}
                <div className="bg-white border-t border-gray-100
                  px-4 py-1.5 text-center flex-shrink-0">
                  <p className="text-[10px] text-gray-400">
                    Powered by Weby AI •
                    <span className="text-blue-500 ml-1">
                      Secure 🔒
                    </span>
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

export default CustomChatbot