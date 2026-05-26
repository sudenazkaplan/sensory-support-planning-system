const Task = require('../models/Task')
const MoodLog = require('../models/MoodLog')

// Kullanicinin hangi saatlerde daha verimli oldugunu analiz et
exports.analyzeUserPatterns = async (userId) => {
  const tasks = await Task.find({ userId, completed: true })
  const moodLogs = await MoodLog.find({ userId }).sort({ date: -1 }).limit(30)

  const hourCounts = {}
  tasks.forEach(task => {
    if (!task.time) return
    const hour = parseInt(task.time.split(':')[0])
    hourCounts[hour] = (hourCounts[hour] || 0) + 1
  })

  const bestHour = Object.entries(hourCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0]

  const avgMoodScore = moodLogs.length
    ? moodLogs.reduce((sum, log) => sum + log.score, 0) / moodLogs.length
    : 3

  const dayOfWeekCounts = {}
  tasks.forEach(task => {
    const day = new Date(task.date).getDay()
    dayOfWeekCounts[day] = (dayOfWeekCounts[day] || 0) + 1
  })

  const bestDay = Object.entries(dayOfWeekCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0]

  const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  const suggestions = []

  if (bestHour) {
    suggestions.push(`You tend to complete tasks best around ${bestHour}:00. Try scheduling important tasks then.`)
  }

  if (avgMoodScore < 2.5) {
    suggestions.push('Your recent mood has been low. Consider lighter tasks and more breaks.')
  } else if (avgMoodScore >= 4) {
    suggestions.push('You have been in a great mood lately. This is a good time to tackle challenging tasks.')
  }

  if (bestDay) {
    suggestions.push(`${DAY_NAMES[bestDay]} tends to be your most productive day.`)
  }

  return {
    bestHour: bestHour ? parseInt(bestHour) : null,
    bestDay: bestDay ? parseInt(bestDay) : null,
    avgMoodScore: parseFloat(avgMoodScore.toFixed(1)),
    totalCompleted: tasks.length,
    suggestions
  }
}

// Ertelenen gorevleri tespit et
exports.getPostponedTasks = async (userId) => {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)

  const postponed = await Task.find({
    userId,
    completed: false,
    date: { $lt: yesterday }
  }).sort({ date: 1 }).limit(5)

  return postponed
}