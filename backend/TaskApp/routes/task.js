const express = require("express");
const router = express.Router();

const Task = require("../models/task");

//Get all Tasks

router.get("/", async (req, res) => {
  try {
    const task = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.messsage });
  }
});

//create a task
router.post("/", async (req, res) => {
  const task = new Task({
    title: req.body.title,
    description: req.body.description,
  });

  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//Creating middleware for our:id routes
async function getTask(req, res, next) {
  let task;
  try {
    task = await Task.findById(req.params.id);
    if (task == null) {
      return res.status(404).json({ message: "Task not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.task = task;
  next();
}

//get a specific task by ID
router.get("/id", getTask, (req, res) => {
  res.json(res.task);
});

//upate
router.patch("/:id", getTask, async (req, res) => {
  if (req.body.title != null) {
    res.task.title = req.body.title;
  }
  if (req.body.description != null) {
    res.task.description = req.body.description;
  }
  try {
    const updateTask = await res.task.save();
    res.json(updateTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//Delete a task
router.delete("/:id", getTask, async (req, res) => {
  try {
    await res.task.remove();
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
