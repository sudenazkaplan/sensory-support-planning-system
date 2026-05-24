import { useAuth } from '../context/AuthContext'

export default function Home() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-purple-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-medium text-purple-800 mb-2">
          Merhaba 👋
        </h1>
        <p className="text-gray-500 text-sm mb-6">{user?.email}</p>
        <button
          onClick={logout}
          className="bg-purple-100 text-purple-700 px-6 py-2 rounded-xl text-sm hover:bg-purple-200 transition"
        >
          Çıkış yap
        </button>
      </div>
    </div>
  )
}