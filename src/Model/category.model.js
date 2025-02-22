const mongoose = require('mongoose')

const categorySchema = mongoose.Schema({
  categoryName :{
    type: String,
    required: true
  },
  status :{
    type: Boolean,
    default: true
  },
  subscribeCount :{
    type: Number,
    default: 0
  },
  timestamp: { type: Date, default: Date.now }
})

module.exports.Category = mongoose.model('category', categorySchema)