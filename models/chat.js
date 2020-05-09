var mongoose = require('mongoose');

var ChatSchema = new mongoose.Schema({
	sender_id:  String ,      //user,admin,doctor
	receiver_id:String,
	text:String
});

module.exports= mongoose.model("Chat",ChatSchema);
