// src/hooks/useSearch.js
// ── Simple hook, drop it in your existing hooks folder 
//    or create src/hooks/ ──
import { useState, useCallback } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const useSearch = () => {
  const [suggestions, setSuggestions]   = useState([])
  const [isLoading, setIsLoading]       = useState(false)
  const [searchQuery, setSearchQuery]   = useState('')

  // ── Fetch live suggestions from YOUR backend ──
  const fetchSuggestions = useCallback(async (keyword) => {
    if (!keyword || keyword.trim().length < 2) {
      setSuggestions([])
      return
    }

    try {
      setIsLoading(true)
      // ✅ Hits your real GET /api/products?keyword=...&limit=6
      const { data } = await axios.get(`${API_URL}/products`, {
        params: { keyword: keyword.trim(), limit: 6 }
      })
      setSuggestions(data.products || [])
    } catch (err) {
      console.error('Search suggestions failed:', err)
      setSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearSuggestions = () => setSuggestions([])

  return {
    searchQuery,
    setSearchQuery,
    suggestions,
    isLoading,
    fetchSuggestions,
    clearSuggestions,
  }
}