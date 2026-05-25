const ChatHistory = require('../models/ChatHistory')
const MoodLog = require('../models/MoodLog')
const { getChatResponse } = require('../services/openaiService')
const { analyzeSentiment } = require('../services/sentimentService')

exports.sendMessage = async (req, res) => {
  try {
    const { message, sessionId } = req.body

    if (!message) {
      return res.status(400).json({ message: 'Message is required' })
    }

    let session = sessionId
      ? await ChatHistory.findById(sessionId)
      : null

    if (!session) {
      session = new ChatHistory({ userId: req.userId, messages: [] })
    }

    session.messages.push({ role: 'user', content: message })

    const recentMessages = session.messages
      .slice(-10)
      .map(m => ({ role: m.role, content: m.content }))

    // İkisini paralel çalıştır
    const [reply, sentiment] = await Promise.all([
      getChatResponse(recentMessages),
      analyzeSentiment(message)
    ])

    session.messages.push({ role: 'assistant', content: reply })
    await session.save()

    // MoodLog kaydet
    await MoodLog.create({
      userId: req.userId,
      mood: sentiment.mood,
      score: sentiment.score,
      note: message.slice(0, 100),
      date: new Date()
    }).catch(() => {})

    res.json({
      reply,
      sessionId: session._id,
      messageCount: session.messages.length,
      sentiment // frontend'e gönder
    })
  } catch (err) {
    console.error('Chat error:', err)
    res.status(500).json({ message: 'Failed to get response' })
  }
}

exports.getHistory = async (req, res) => {
  try {
    const sessions = await ChatHistory
      .find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(5)
    res.json(sessions)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

exports.getMoodLogs = async (req, res) => {
  try {
    const logs = await MoodLog
      .find({ userId: req.userId })
      .sort({ date: -1 })
      .limit(30)
    res.json(logs)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}