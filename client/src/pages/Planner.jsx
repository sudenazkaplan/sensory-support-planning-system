import { useState, useEffect } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import api from '../services/api'
import TaskForm from '../components/planner/TaskForm'
import TaskList from '../components/planner/TaskList'

export default function Planner() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [tasks, setTasks] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    setLoading(true)
    try {
      const res = await api.get('/tasks')
      setTasks(res.data)
    } catch (err) {
      console.error('Failed to fetch tasks:', err)
    } finally {
      setLoading(false)
    }
  }

  const getTasksForDate = (date) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.date)
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      )
    })
  }

  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
        await api.put(`/tasks/${editingTask._id}`, taskData)
      } else {
        await api.post('/tasks', taskData)
      }
      await fetchTasks()
      setShowForm(false)
      setEditingTask(null)
    } catch (err) {
      console.error('Failed to save task:', err)
    }
  }

  const handleDelete = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`)
      setTasks(tasks.filter(t => t._id !== taskId))
    } catch (err) {
      console.error('Failed to delete task:', err)
    }
  }

  const handleToggle = async (taskId) => {
    try {
      const res = await api.patch(`/tasks/${taskId}/toggle`)
      setTasks(tasks.map(t => t._id === taskId ? res.data : t))
    } catch (err) {
      console.error('Failed to toggle task:', err)
    }
  }

  const handleEdit = (task) => {
    setEditingTask(task)
    setShowForm(true)
  }

  const tileContent = ({ date }) => {
    const dayTasks = getTasksForDate(date)
    if (dayTasks.length === 0) return null
    return (
      <div className="flex justify-center mt-1">
        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
      </div>
    )
  }

  const selectedTasks = getTasksForDate(selectedDate)

  return (
    <div className="min-h-screen bg-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-medium text-purple-800">Planner</h1>
          <button
            onClick={() => { setEditingTask(null); setShowForm(true) }}
            className="bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-purple-700 transition"
          >
            + New Task
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              tileContent={tileContent}
              className="border-none w-full"
            />
          </div>

          <div>
            <h2 className="text-sm font-medium text-gray-500 mb-3">
              {selectedDate.toLocaleDateString('en-US', {
                weekday: 'long', month: 'long', day: 'numeric'
              })}
            </h2>
            {loading ? (
              <p className="text-sm text-gray-400">Loading...</p>
            ) : (
              <TaskList
                tasks={selectedTasks}
                onDelete={handleDelete}
                onToggle={handleToggle}
                onEdit={handleEdit}
              />
            )}
          </div>
        </div>
      </div>

      {showForm && (
        <TaskForm
          task={editingTask}
          selectedDate={selectedDate}
          onSave={handleSaveTask}
          onClose={() => { setShowForm(false); setEditingTask(null) }}
        />
      )}
    </div>
  )
}