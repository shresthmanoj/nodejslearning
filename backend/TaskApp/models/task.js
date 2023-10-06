const mongoose = require("mongoose");
const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
  },
});

const Task = mongoose.model("Task", TaskSchema);

module.exports = TaskSchema;
