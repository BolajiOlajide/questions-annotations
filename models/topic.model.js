const mongoose = require('mongoose');


const TopicSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});

module.exports = mongoose.model('Topic', TopicSchema);
