const MoodLog = require('../models/MoodLog')
const Task = require('../models/Task')
const { analyzeUserPatterns, getPostponedTasks } = require('../services/patternService')

exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.userId

    // Son 7 gunun mood logları
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const moodLogs = await MoodLog.find({
      userId,
      date: { $gte: sevenDaysAgo }
    }).sort({ date: 1 })

    // Son 7 gunun gorev istatistikleri
    const tasks = await Task.find({
      userId,
      date: { $gte: sevenDaysAgo }
    })

    const completedTasks = tasks.filter(t => t.completed).length
    const totalTasks = tasks.length
    const completionRate = totalTasks > 0
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0

    // Pattern analizi
    const patterns = await analyzeUserPatterns(userId)
    const postponed = await getPostponedTasks(userId)

    // Gunluk mood ozeti
    const dailyMood = {}
    moodLogs.forEach(log => {
      const date = new Date(log.date).toLocaleDateString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric'
      })
      if (!dailyMood[date]) {
        dailyMood[date] = { total: 0, count: 0 }
      }
      dailyMood[date].total += log.score
      dailyMood[date].count += 1
    })

    const moodChartData = Object.entries(dailyMood).map(([date, data]) => ({
      date,
      mood: parseFloat((data.total / data.count).toFixed(1))
    }))

    res.json({
      moodChartData,
      completedTasks,
      totalTasks,
      completionRate,
      patterns,
      postponed
    })
  } catch (err) {
    console.error('Dashboard error:', err)
    res.status(500).json({ message: 'Server error' })
  }
}