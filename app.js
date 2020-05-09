var express               = require('express'),
    app                   = express(),
    mongoose              = require('mongoose'),
    passport              = require('passport'),
    LocalStrategy         = require("passport-local"),
    bodyParser            = require('body-parser'),
//  methodOverride        = require("method-override"),
    User                  = require("./models/user"),
    chatHistory = require("./models/chatHistory.js"),
    socket = require('socket.io'),

    passportLocalMongoose = require("passport-local-mongoose");


var indexRoutes = require("./routes/index"), //all routes
    todoRoutes  = require("./routes/todo"),
    chatterRoutes  = require("./routes/chatter");

mongoose.connect('mongodb://localhost/amity_project');
app.set('view engine','ejs');
app.use("/public",express.static('./public'));
app.use(bodyParser.urlencoded({extended:true}));

app.use(require("express-session")({
 	secret :"Rusty is the best and cutest dog in the world",
 	resave : false,
	saveUninitialized : false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){    //used to provide logged in user details to every ejs file.
  res.locals.currentUser = req.user;
  next();
});

app.use(indexRoutes);
app.use(todoRoutes);
app.use(chatterRoutes);

// app.listen(3000,function(){
// 	console.log('we are live at 3000 port');
// });

//--------------------------------------------------

var arr = ['shreshth',''];
var ips = [1,2];
var rooms =["Doctor's clinic",0];

var server = app.listen(3000,function(){
	console.log('we are live at 3000');
});



// connecting to '/'

var io = socket(server);
io.on('connection',function(socket){

	console.log('we have a new guest',socket.id);

	socket.on('checkme',function(data){
		console.log('someone asked for check up')

		if(arr.indexOf(data.name) === -1){
				console.log('we send its unique')
				socket.emit('ans',{result:true});
		}
		else{
			console.log('we send its taken')
			socket.emit('ans',{result:false});
		}
	});
	var rm;
	socket.on('add',function(data){
		console.log('we added this user: '+data.name)
		arr.push(data.name);
		var address = socket.handshake.address;
		console.log(address);
		ips.push(address);
		rooms.push(data.room);
		rm=data.room;
		console.log(arr.length);
	});
});

//lets deal the connection from '/chatter'
var count = 0;
var chat = io.of('/chatter');
chat.on('connection',function(socket){
	var address = socket.handshake.address;
	var i = ips.indexOf(address);
	var name , room;
	if(i !== -1){
		name = arr[i];
		room = rooms[i];
	}
	else{
		name = address.address;
	}
  room:"Doctor's clinic";
	socket.on('message',function(data){
		chat.emit('add',{name:data.username,info:data.info});
		var newChat = {room:room,handler:data.username,text:data.info,index:count++}
		chatHistory.create(newChat, function(err, newlyCreated){
			if(err){
					console.log(err);
			}
  	});
	})
	socket.on('typing',function(data){
		console.log(data.username+' is typing...');
		socket.broadcast.emit('typer',{name:data.username});
	});
	socket.on('delete',function(data){
		socket.broadcast.emit('deleter',{name:data.username});
		console.log(data.username+" is done writing");
	})

	//removing the user when we disconnect
	socket.on('disconnect', function(){
		ips.slice(i,1);
		arr.slice(i,1);
		console.log('user disconnected',socket.id);
	});
})
