var express   = require("express"),
    router    = express.Router(),
    chatHistory = require("../models/chatHistory.js");

    var localip = require('local-ip');
    var iface = 'Wi-Fi';
    var ip;
    localip(iface, function(err, res) {
      if (err) {
        throw new Error('I have no idea what my local ip is.');
      }
      //console.log('My local ip address on ' + iface + ' is ' + res);
      ip = res;
    });

// router.get("/chatter",function(req,res){
//   Chat.find({},function(err,chat){
//     res.render("chatter",
//     {
//       ip:ip,
//       chat:chat
//     });
//   });
//   //res.send("we are in chatter");
// });
router.get('/chatter',isLoggedIn,function(req,res){
		chatHistory.find({}).then(function(data){
      var info = {
  			room:"Doctor's Clinic",
        ip:ip,
        data:data
  		};
			console.log(data);
			res.render('chatter', info);
		});
});
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}
module.exports = router;
