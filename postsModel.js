const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    user:Object,
    post:String,
    timeStamp:String
})

const postModel = mongoose.model('posts',postSchema)
module.exports=postModel;