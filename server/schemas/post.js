const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  poster: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: String,
  pictureUrl: String,
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: Date
});

module.exports = mongoose.model('Post', postSchema);
