var mongoose = require('mongoose');
var passportLocalMongoose = require("passport-local-mongoose");
var UserSchema = new mongoose.Schema({
	username: String,
	password: String,
  job:String          //user,admin,doctor
});

UserSchema.plugin(passportLocalMongoose); // gives import functionalities
module.exports= mongoose.model("User",UserSchema);
