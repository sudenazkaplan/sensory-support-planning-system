import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { MoodProvider } from './context/MoodContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Planner from './pages/Planner'
import Chat from './pages/Chat'

const PrivateRoute = ({ children }) => {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" />
}

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
    <Route path="/planner" element={<PrivateRoute><Planner /></PrivateRoute>} />
    <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
  </Routes>
)

export default function App() {
  return (
    <AuthProvider>
      <MoodProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </MoodProvider>
    </AuthProvider>
  )
}