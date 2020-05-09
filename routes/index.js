var express   = require("express"),
    router    = express.Router();
var User = require("../models/user"),
passport = require("passport");

router.get("/",function(req,res){
  res.render("home");
});

//show sign up form
router.get("/register",function(req,res){
	res.render("register");
});

//handling user sign up
router.post("/register",function(req,res){
	User.register(new User({username: req.body.username , job : req.body.job}),req.body.password,function(err,user){
		if(err){
			console.log(err);
			return res.render('register');
		}
		passport.authenticate("local")(req,res,function(){
			res.redirect("/");
		});
	});
});

//show login form
router.get("/login",function(req,res){
	res.render("login");
});

//handling login
router.post("/login",passport.authenticate("local",{
	successRedirect : "/",
	failureRedirect : "/login"
}),function(req,res){});

router.get("/logout",function(req,res){
	req.logout();
	res.redirect("/");
});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}
module.exports = router;
