const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const {
  sendMessage,
  getHistory,
  getMoodLogs
} = require('../controllers/chatController')

router.post('/message', auth, sendMessage)
router.get('/history', auth, getHistory)
router.get('/mood-logs', auth, getMoodLogs)

module.exports = router