const PRIORITY_COLORS = {
  low: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-red-100 text-red-700'
}

export default function TaskList({ tasks, onDelete, onToggle, onEdit }) {
  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
        <p className="text-gray-400 text-sm">No tasks for this day</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {tasks.map(task => (
        <div
          key={task._id}
          className={`bg-white rounded-2xl shadow-sm p-4 transition ${
            task.completed ? 'opacity-60' : ''
          }`}
        >
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggle(task._id)}
              className="mt-1 accent-purple-600 w-4 h-4 cursor-pointer"
            />
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium text-gray-800 ${
                task.completed ? 'line-through text-gray-400' : ''
              }`}>
                {task.title}
              </p>
              {task.description && (
                <p className="text-xs text-gray-400 mt-0.5">{task.description}</p>
              )}
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className={`text-xs px-2 py-0.5 rounded-full ${PRIORITY_COLORS[task.priority]}`}>
                  {task.priority}
                </span>
                <span className="text-xs text-gray-400 capitalize">{task.category}</span>
                {task.time && (
                  <span className="text-xs text-gray-400">{task.time}</span>
                )}
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => onEdit(task)}
                className="text-xs text-purple-500 hover:text-purple-700"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(task._id)}
                className="text-xs text-red-400 hover:text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}