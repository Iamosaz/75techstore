// src/components/chatbot/CustomChatbot.jsx
import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaRobot,
  FaTimes,
  FaPaperPlane,
  FaPhone,
  FaShoppingCart,
  FaTools,
  FaQuestionCircle,
} from 'react-icons/fa'

const CustomChatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! 👋 I'm the 75TechStore AI Assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const [showQuickReplies, setShowQuickReplies] = useState(true)

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Quick replies
  const quickReplies = [
    {
      icon: <FaShoppingCart size={16} />,
      text: 'Browse Products',
      query: 'Show me your products',
    },
    {
      icon: <FaPhone size={16} />,
      text: 'Contact Info',
      query: 'How can I contact you?',
    },
    {
      icon: <FaTools size={16} />,
      text: 'Repair Services',
      query: 'Tell me about repair services',
    },
    {
      icon: <FaQuestionCircle size={16} />,
      text: 'FAQs',
      query: 'What are your FAQs?',
    },
  ]

  // Knowledge base
  const knowledgeBase = {
    products: {
      keywords: ['product', 'gadget', 'phone', 'laptop', 'shop', 'buy'],
      response: `🛍️ **Our Products:**\n\n• 📱 Smartphones\n• 💻 Laptops\n• 📲 Tablets\n• 🎧 Accessories\n• 🎮 Gaming Consoles\n• 🔊 Speakers\n• 🥽 VR Devices\n\nVisit our shop to browse!`,
    },
    repair: {
      keywords: ['repair', 'fix', 'broken', 'damage', 'service'],
      response: `🔧 **Repair Services:**\n\n✅ Smartphone repairs\n✅ Laptop repairs\n✅ Tablet repairs\n✅ Fast turnaround\n✅ Professional technicians\n\nCall us: +234 703 562 0709`,
    },
    contact: {
      keywords: ['contact', 'call', 'email', 'phone', 'whatsapp'],
      response: `📞 **Contact Us:**\n\n📱 Phone: +234 703 562 0709\n💬 WhatsApp: https://wa.me/2347035620709\n📧 Email: support@75techstore.com\n\n📍 Location:\nM Plaza, Computer Village, Ikeja, Lagos\n\n🕐 Hours: Mon-Sat 8AM-8PM`,
    },
  }

  // Find response
  const findResponse = (userInput) => {
    const lowerInput = userInput.toLowerCase()

    for (const [key, value] of Object.entries(knowledgeBase)) {
      if (value.keywords.some(keyword => lowerInput.includes(keyword))) {
        return value.response
      }
    }

    return `Thanks for your message! 😊 For more help, contact us at +234 703 562 0709 or use the quick replies above.`
  }

  // Send message
  const handleSendMessage = (messageText = inputValue) => {
    if (!messageText.trim()) return

    const userMessage = {
      id: messages.length + 1,
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setShowQuickReplies(false)
    setIsLoading(true)

    // Simulate bot response delay
    setTimeout(() => {
      const response = findResponse(messageText)
      const botMessage = {
        id: messages.length + 2,
        text: response,
        sender: 'bot',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, botMessage])
      setIsLoading(false)
    }, 1000)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className='fixed bottom-8 right-8 z-40 group'
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className='relative'
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {/* Badge */}
              <motion.div
                className='absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full 
                  flex items-center justify-center text-white text-xs font-bold
                  animate-pulse shadow-lg'
              >
                1
              </motion.div>

              {/* Button */}
              <div className='w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 
                rounded-full flex items-center justify-center text-white shadow-2xl
                cursor-pointer'>
                <FaRobot size={28} />
              </div>

              {/* Pulse */}
              <motion.div
                className='absolute inset-0 rounded-full border-2 border-blue-400'
                animate={{ scale: [1, 1.3], opacity: [1, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 100 }}
            className='fixed bottom-8 right-8 z-50 w-96 max-w-[calc(100vw-32px)]
              bg-white rounded-3xl shadow-2xl flex flex-col h-[600px]
              overflow-hidden'
          >
            {/* Header */}
            <div className='bg-gradient-to-r from-blue-500 to-blue-600 text-white 
              p-6 flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 bg-white/20 rounded-full flex items-center justify-center'>
                  <FaRobot size={20} />
                </div>
                <div>
                  <h3 className='font-bold text-lg'>75TechStore AI</h3>
                  <p className='text-blue-100 text-xs'>Always here to help 🚀</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className='p-2 hover:bg-white/20 rounded-full transition-all'
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className='flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50'>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-3 rounded-2xl ${
                      msg.sender === 'user'
                        ? 'bg-blue-500 text-white rounded-br-none'
                        : 'bg-white text-gray-900 rounded-bl-none shadow-md'
                    }`}
                  >
                    <p className='text-sm whitespace-pre-wrap'>{msg.text}</p>
                    <span className='text-xs mt-2 block opacity-70'>
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </motion.div>
              ))}

              {/* Loading */}
              {isLoading && (
                <motion.div className='flex justify-start'>
                  <div className='bg-white px-4 py-3 rounded-2xl rounded-bl-none shadow-md'>
                    <div className='flex gap-2'>
                      <motion.div
                        className='w-2 h-2 bg-blue-500 rounded-full'
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity }}
                      />
                      <motion.div
                        className='w-2 h-2 bg-blue-500 rounded-full'
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                      />
                      <motion.div
                        className='w-2 h-2 bg-blue-500 rounded-full'
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Quick Replies */}
              {showQuickReplies && !isLoading && messages.length <= 1 && (
                <motion.div
                  className='mt-6 space-y-3'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <p className='text-xs text-gray-600 font-semibold uppercase'>Quick Actions:</p>
                  {quickReplies.map((reply, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleSendMessage(reply.query)}
                      whileHover={{ scale: 1.02, x: 5 }}
                      className='w-full flex items-center gap-2 p-3 bg-white border-2 border-blue-200
                        hover:border-blue-500 hover:bg-blue-50 rounded-xl transition-all text-left'
                    >
                      <span className='text-blue-500'>{reply.icon}</span>
                      <span className='font-medium text-gray-900 text-sm'>{reply.text}</span>
                    </motion.button>
                  ))}
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className='border-t border-gray-200 p-4 bg-white flex gap-2'>
              <input
                type='text'
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder='Type your message...'
                className='flex-1 px-4 py-3 border-2 border-gray-200 rounded-full
                  focus:outline-none focus:border-blue-500 text-gray-900'
              />
              <motion.button
                onClick={() => handleSendMessage()}
                disabled={isLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full
                  transition-all disabled:opacity-50'
              >
                <FaPaperPlane size={18} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default CustomChatbot