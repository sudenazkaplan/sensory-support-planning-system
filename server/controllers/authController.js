const jwt = require('jsonwebtoken')

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

exports.firebaseLogin = async (req, res) => {
  try {
    const { uid, email } = req.body

    if (!uid || !email) {
      return res.status(400).json({ message: 'uid and email required' })
    }

    const token = generateToken(uid)
    res.json({ token, userId: uid, email })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}