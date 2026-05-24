import { useState, useEffect } from 'react'

const PRIORITIES = ['low', 'medium', 'high']
const CATEGORIES = ['personal', 'school', 'health', 'social', 'other']

export default function TaskForm({ task, selectedDate, onSave, onClose }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [priority, setPriority] = useState('medium')
  const [category, setCategory] = useState('personal')

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description || '')
      setDate(new Date(task.date).toISOString().split('T')[0])
      setTime(task.time || '')
      setPriority(task.priority)
      setCategory(task.category)
    } else {
      setDate(selectedDate.toISOString().split('T')[0])
    }
  }, [task, selectedDate])

  const handleSave = () => {
    if (!title.trim()) return
    onSave({ title, description, date, time, priority, category })
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-lg font-medium text-purple-800 mb-4">
          {task ? 'Edit Task' : 'New Task'}
        </h2>

        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400"
          />
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400 resize-none"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400"
            />
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400"
            />
          </div>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400"
          >
            {PRIORITIES.map(p => (
              <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)} priority</option>
            ))}
          </select>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400"
          >
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 mt-5">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl text-sm hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-purple-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-purple-700 transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}