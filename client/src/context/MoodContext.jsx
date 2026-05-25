import { createContext, useContext, useState, useCallback } from 'react'

const MoodContext = createContext()

export const useMood = () => useContext(MoodContext)

export const MoodProvider = ({ children }) => {
  const [currentMood, setCurrentMood] = useState(null)
  const [moodHistory, setMoodHistory] = useState([])

  const updateMood = useCallback((mood) => {
    setCurrentMood(mood)
    setMoodHistory(prev => [...prev.slice(-29), {
      ...mood,
      timestamp: new Date()
    }])
  }, [])

  const isDistressed = currentMood && currentMood.score <= 2

  return (
    <MoodContext.Provider value={{
      currentMood,
      moodHistory,
      updateMood,
      isDistressed
    }}>
      {children}
    </MoodContext.Provider>
  )
}