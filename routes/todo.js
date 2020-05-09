var express = require("express"),
router = express.Router();

var todo = require("../models/todo");

//to render the stored data from database to the browser
router.get('/order',isLoggedIn,function(req,res){

    // return res.render('home',{
    //     title: "To Do App"
    // });

    todo.find({},function(err,listDB)
    {
        if(err){
            console.log('Error in displaying data');
            return;
        }

        return res.render('todo',{
            title: "To Do List",
            lists : listDB
        });
    });
});

//Populating the database with the enrtries from the browser
router.post('/order/create-list' ,isLoggedIn, function(req,res){
    todo.create({
        item : req.body.item,
        company : req.body.company,
        quantity : req.body.quantity,
        author :
        {
          _id:req.user._id,
          username:req.user.username
        }
    }, function(err, newlist)
    {
        if(err)
        {
            console.log('Error while inserting in sathe database');
            return ;
        }

        //console.log('*******',newlist);

        return res.redirect('back');
    });

});

router.get('/order/delete-list',isLoggedIn,function(req,res){
     //for database we will use id for deletion which is unique for every object
     console.log(req.query);
     let id = req.query.id;

     todo.findByIdAndDelete(id,function(err){
         if(err){
             console.log('Error in deleting from DB');
             return;
         }

         return res.redirect('back');
     });


 });

 function isLoggedIn(req,res,next){
 	if(req.isAuthenticated()){
 		return next();
 	}
 	res.redirect("/login");
 }
module.exports = router;
