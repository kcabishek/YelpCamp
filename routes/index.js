var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Admin = require("../models/admin");
var LocalStrategy = require('passport-local').Strategy;

var accountSid = "ACf8694b181f7264ec2c80f3b0ed7eca59";
var authToken = "e30980ffc33e8a2fb09a1b4f6d20f938";
var client = require('twilio')(accountSid, authToken);

//root route
router.get("/", function(req, res){
    res.render("landing");
});

// show register form
router.get("/register", function(req, res){
   res.render("register"); 
});

//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({name: req.body.name, email: req.body.email, username: req.body.username});
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
    
    var errors = req.validationErrors();
    if(errors){
        res.render('register', {
            errors:errors
        });
    }else{
        User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Welcome " + user.username);
           res.redirect("/campgrounds"); 
           client.messages.create({ 
                to: "+19733429558", 
                from: "+18622146056", 
                body: "New user " + user.username + " has registered!!!"
            }, function(err, message) { 
                console.log(message); 
});
        });
    });
    }
});

//show login form
router.get("/login", function(req, res){
   res.render("login"); 
});

//handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
});

//handling admin logic
router.get("/admin", function(req, res) {
   res.render("admin"); 
});

// logout route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "Logged you out!");
   res.redirect("/campgrounds");
});



module.exports = router;