import { useEffect, useRef } from 'react'

const checkAndNotify = (tasks, notifiedRef) => {
  if (!('Notification' in window)) return
  if (Notification.permission !== 'granted') return

  const now = new Date()

  tasks.forEach(task => {
    if (task.completed || !task.time) return
    if (notifiedRef.current.has(task._id)) return

    const taskDate = new Date(task.date)
    const [hours, minutes] = task.time.split(':')
    taskDate.setHours(parseInt(hours), parseInt(minutes), 0, 0)

    const diff = taskDate - now

    // 5 dakika içindeyse bildir
    if (diff >= 0 && diff <= 5 * 60 * 1000) {
      new Notification('Task Reminder', {
        body: task.title,
        icon: '/favicon.ico'
      })
      notifiedRef.current.add(task._id)
    }
  })
}

export const useTaskNotifications = (tasks) => {
  const notifiedRef = useRef(new Set())

  useEffect(() => {
    if (!('Notification' in window)) return

    Notification.requestPermission()

    // Sayfa açılınca hemen bir kez kontrol et
    checkAndNotify(tasks, notifiedRef)

    const interval = setInterval(() => {
      checkAndNotify(tasks, notifiedRef)
    }, 10000) // her 10 saniyede bir kontrol et

    return () => clearInterval(interval)
  }, [tasks])
}