const mongoose = require('mongoose');
const plm = require('passport-local-mongoose')

//  
// mongodb+srv://vaibhav_2110:7bquaFmy1YmXfglh@cluster0.ua7fuon.mongodb.net/
// 

// mongoose.connect("mongodb://127.0.0.1:27017/todo_list")
// Define the user schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  fullname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
  },
  tasks: [{
    type: mongoose.Schema.Types.ObjectId, // Assuming posts are stored as an array of strings
    ref : 'Post'
  }]
});

// Create the user model


userSchema.plugin(plm)
module.exports = mongoose.model('User', userSchema);

