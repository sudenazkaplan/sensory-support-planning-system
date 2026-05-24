import { createContext, useContext, useEffect, useState } from 'react'
import { auth } from '../services/firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import api from '../services/api'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const res = await api.post('/auth/firebase-login', {
            uid: currentUser.uid,
            email: currentUser.email
          })
          localStorage.setItem('token', res.data.token)
        } catch (err) {
          console.error('Backend auth error:', err)
        }
        setUser(currentUser)
      } else {
        localStorage.removeItem('token')
        setUser(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const register = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password)

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password)

  const logout = async () => {
    localStorage.removeItem('token')
    await signOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}