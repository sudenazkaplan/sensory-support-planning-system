const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleComplete
} = require('../controllers/taskController')

router.get('/', auth, getTasks)
router.post('/', auth, createTask)
router.put('/:id', auth, updateTask)
router.delete('/:id', auth, deleteTask)
router.patch('/:id/toggle', auth, toggleComplete)

module.exports = router