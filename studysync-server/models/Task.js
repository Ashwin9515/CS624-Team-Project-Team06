const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: String,
  subject: String,
  dueDate: String,
  priority: String,
});

module.exports = mongoose.model('Task', TaskSchema);