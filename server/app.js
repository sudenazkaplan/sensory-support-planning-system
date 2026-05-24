const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const app = express()

app.use(cors({ origin: process.env.CLIENT_URL }))
app.use(express.json())

app.use('/api/auth', require('./routes/auth'))
app.use('/api/tasks', require('./routes/tasks'))

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' })
})

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB error:', err.message)
    process.exit(1)
  })

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))