import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { MoodProvider } from './context/MoodContext'
import { CrisisProvider } from './context/CrisisContext'
import CrisisMode from './components/crisis/CrisisMode'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Planner from './pages/Planner'
import Chat from './pages/Chat'
import Relax from './pages/Relax'

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
    <Route path="/relax" element={<PrivateRoute><Relax /></PrivateRoute>} />
  </Routes>
)

export default function App() {
  return (
    <AuthProvider>
      <MoodProvider>
        <CrisisProvider>
          <CrisisMode />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </CrisisProvider>
      </MoodProvider>
    </AuthProvider>
  )
}