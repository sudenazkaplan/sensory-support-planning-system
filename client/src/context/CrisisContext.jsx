import { createContext, useContext, useState, useEffect } from 'react'
import { useMood } from './MoodContext'

const CrisisContext = createContext()

export const useCrisis = () => useContext(CrisisContext)

export const CrisisProvider = ({ children }) => {
  const [isCrisis, setIsCrisis] = useState(false)
  const { currentMood } = useMood()

  useEffect(() => {
    if (currentMood && currentMood.score <= 2) {
      setIsCrisis(true)
    }
  }, [currentMood])

  const dismissCrisis = () => setIsCrisis(false)

  return (
    <CrisisContext.Provider value={{ isCrisis, dismissCrisis }}>
      {children}
    </CrisisContext.Provider>
  )
}