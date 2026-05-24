export default function UpcomingTasks({ tasks }) {
  const now = new Date()

  const upcoming = tasks
    .filter(task => {
      if (task.completed || !task.time) return false
      const taskDate = new Date(task.date)
      const [hours, minutes] = task.time.split(':')
      taskDate.setHours(parseInt(hours), parseInt(minutes), 0, 0)
      const diff = taskDate - now
      return diff > 0 && diff <= 60 * 60 * 1000 // 1 saat içinde
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date))

  if (upcoming.length === 0) return null

  return (
    <div className="bg-purple-100 border border-purple-200 rounded-2xl p-4 mb-6">
      <p className="text-sm font-medium text-purple-800 mb-2">
        Upcoming in the next hour
      </p>
      <div className="flex flex-col gap-2">
        {upcoming.map(task => (
          <div key={task._id} className="flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-500 rounded-full shrink-0" />
            <span className="text-sm text-purple-700">{task.title}</span>
            <span className="text-xs text-purple-400 ml-auto">{task.time}</span>
          </div>
        ))}
      </div>
    </div>
  )
}