const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  assignee: { type: String, required: true },
  column: { type: String, required: true },
});

module.exports = mongoose.model('Task', taskSchema);