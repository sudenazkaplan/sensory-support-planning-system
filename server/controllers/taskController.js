const Task = require('../models/Task')

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId }).sort({ date: 1 })
    res.json(tasks)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

exports.createTask = async (req, res) => {
  try {
    const { title, description, date, time, priority, category } = req.body

    if (!title || !date) {
      return res.status(400).json({ message: 'Title and date are required' })
    }

    const task = new Task({
      userId: req.userId,
      title,
      description,
      date,
      time,
      priority,
      category
    })

    await task.save()
    res.status(201).json(task)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.userId })

    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }

    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    )

    res.json(updated)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.userId })

    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }

    await Task.findByIdAndDelete(req.params.id)
    res.json({ message: 'Task deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

exports.toggleComplete = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.userId })

    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }

    task.completed = !task.completed
    await task.save()
    res.json(task)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}