const mongoose = require('mongoose');
// Define the post schema
const postSchema = new mongoose.Schema({
  completed :{
    type: Boolean,
    default:0

  },
  postText: {
    type: String,
    required: true
  },
  user : {
    type: mongoose.Schema.Types.ObjectId,
    ref:'User'
    
  },
  currentDate: {
    type: String,
    default:function(){
      const currentDate = new Date();

  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const day = currentDate.getDate().toString().padStart(2, '0');

  const hours = currentDate.getHours().toString().padStart(2, '0');
  const minutes = currentDate.getMinutes().toString().padStart(2, '0');
  const seconds = currentDate.getSeconds().toString().padStart(2, '0');

  const dateTimeString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  return dateTimeString;
    }
  },
  time: {
    type: String,
    default: () => {
        const date = new Date();
        // Format the date as "YYYY-MM-DD HH:mm:ss"
        const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
        return formattedDate;
    }
}
});

// Create the post model
const PostModel = mongoose.model('Post', postSchema);

module.exports = PostModel;

