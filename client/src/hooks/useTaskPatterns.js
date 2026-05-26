import { useState, useEffect } from 'react'
import api from '../services/api'

export const useTaskPatterns = () => {
  const [patterns, setPatterns] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/dashboard')
      .then(res => setPatterns(res.data.patterns))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return { patterns, loading }
}