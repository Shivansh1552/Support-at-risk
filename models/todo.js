const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({

       item : {
           type : String,
           required : true
       },

        company: {
           type : String,
        required : true
       },

       quantity: {
           type : String,
           required : true
       },
       author:{
         _id:{
           type:mongoose.Schema.Types.ObjectId,
           ref:'User'
         },
         username:String
       }
});

const todo = mongoose.model('todo' , todoSchema);

module.exports = todo;
