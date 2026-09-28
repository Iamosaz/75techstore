// src/hooks/useSearch.js
import { useState, useCallback } from 'react'
import axios from 'axios'

// ── 🛡️ PRODUCTION TRAILING SLASH & ENDPOINT SAFEGUARD ──
const getCleanApiUrl = () => {
  const rawUrl =
    import.meta.env?.VITE_API_URL ||
    (typeof process !== 'undefined' && (process.env?.REACT_APP_API_URL || process.env?.NEXT_PUBLIC_API_URL)) ||
    'http://localhost:5000/api'

  // 1. Remove any trailing slashes
  let clean = rawUrl.trim().replace(/\/+$/, '')

  // 2. Safely ensure /api suffix is present without doubling
  if (!clean.endsWith('/api')) {
    clean = `${clean}/api`
  }

  return clean
}

const API_URL = getCleanApiUrl()

export const useSearch = () => {
  const [suggestions, setSuggestions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // ── Fetch live suggestions from YOUR backend ──
  const fetchSuggestions = useCallback(async (keyword) => {
    if (!keyword || keyword.trim().length < 2) {
      setSuggestions([])
      return
    }

    try {
      setIsLoading(true)
      // ✅ Hits GET /api/products?keyword=...&limit=6
      const { data } = await axios.get(`${API_URL}/products`, {
        params: { keyword: keyword.trim(), limit: 6 }
      })
      
      setSuggestions(data?.products || (Array.isArray(data) ? data : []))
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