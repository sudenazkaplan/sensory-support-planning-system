import { useState, useEffect } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts'
import api from '../services/api'

const MOOD_LABELS = {
  1: 'Very Bad',
  2: 'Bad',
  3: 'Neutral',
  4: 'Good',
  5: 'Very Good'
}

const MOOD_COLORS = {
  1: '#ef4444',
  2: '#f97316',
  3: '#eab308',
  4: '#22c55e',
  5: '#8b5cf6'
}

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/dashboard')
      setData(res.data)
    } catch (err) {
      console.error('Dashboard fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-purple-50 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-medium text-purple-800 mb-6">Dashboard</h1>

        {/* Ozet kartlar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            label="Tasks Completed"
            value={data?.completedTasks ?? 0}
            sub="this week"
          />
          <StatCard
            label="Completion Rate"
            value={`${data?.completionRate ?? 0}%`}
            sub="this week"
          />
          <StatCard
            label="Avg Mood"
            value={data?.patterns?.avgMoodScore ?? '-'}
            sub={MOOD_LABELS[Math.round(data?.patterns?.avgMoodScore)] ?? ''}
          />
          <StatCard
            label="Total Completed"
            value={data?.patterns?.totalCompleted ?? 0}
            sub="all time"
          />
        </div>

        {/* Mood grafigi */}
        <div className="bg-white rounded-2xl shadow-sm p-5 mb-6">
          <h2 className="text-sm font-medium text-gray-600 mb-4">
            Mood This Week
          </h2>
          {data?.moodChartData?.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data.moodChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val) => [MOOD_LABELS[Math.round(val)], 'Mood']}
                />
                <Line
                  type="monotone"
                  dataKey="mood"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={{ fill: '#8b5cf6', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-sm text-center py-8">
              No mood data yet. Start chatting to track your mood.
            </p>
          )}
        </div>

        {/* Oneriler */}
        {data?.patterns?.suggestions?.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-5 mb-6">
            <h2 className="text-sm font-medium text-gray-600 mb-3">
              Personalized Suggestions
            </h2>
            <div className="flex flex-col gap-2">
              {data.patterns.suggestions.map((s, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-purple-400 mt-0.5">•</span>
                  <p className="text-sm text-gray-600">{s}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ertelenen gorevler */}
        {data?.postponed?.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5">
            <h2 className="text-sm font-medium text-orange-700 mb-3">
              Overdue Tasks
            </h2>
            <div className="flex flex-col gap-2">
              {data.postponed.map(task => (
                <div key={task._id} className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-400 rounded-full shrink-0" />
                  <p className="text-sm text-orange-700">{task.title}</p>
                  <span className="text-xs text-orange-400 ml-auto">
                    {new Date(task.date).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const StatCard = ({ label, value, sub }) => (
  <div className="bg-white rounded-2xl shadow-sm p-4">
    <p className="text-xs text-gray-400 mb-1">{label}</p>
    <p className="text-2xl font-medium text-purple-700">{value}</p>
    <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
  </div>
)