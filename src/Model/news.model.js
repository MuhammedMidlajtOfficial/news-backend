const mongoose = require('mongoose')

const newsSchema = mongoose.Schema({
  title :{
    type: String,
    required: true
  },
  content :{
    type: String,
    required: true
  },
  image :{
    type: String,
    default: ""
  },
  category :{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'category'
  },
  status :{
    type: Boolean,
    default: true
  },
  views :{
    type: Number,
    default: 0
  },
  like :{
    type: Number,
    default: 0
  },
  timestamp: { type: Date, default: Date.now }
})

module.exports.News = mongoose.model('news', newsSchema)