var express = require("express");
var mongoose = require("mongoose");
var passport = require("passport");
var User = require("./models/user");
var bodyParser = require("body-parser");
var LocalStrategy = require("passport-local");
passportLocalMongoose = require("passport-local-mongoose");

mongoose.connect("mongodb://localhost/web_chat_app");

var app = express();

app.set('view engine', 'ejs');

//we are getting data by POST of register page || posting data to a request
app.use(bodyParser.urlencoded({extended: true}));

//show seret message
app.use(require('express-session')({
    secret: 'Seret page is ready',
    resave: false,
    saveUninitialized: false
}));

//use passport
app.use(passport.initialize());
app.use(passport.session());

//use local strategy for passport| data coming from login | use that version of user.authenticate
passport.use( new LocalStrategy(User.authenticate()));

//important for passport| read session | decode user read and encode again
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//home page
app.get("/", function(req, res){
    res.render("home");
});

//secret page , visible after login
// user is login / logout check first with isLoggedIn
app.get("/secret", isLoggedIn, function(req, res){
    res.render("secret");
});

//authentication routhes
//register 
app.get('/register',function(req, res){
    res.render('register');
});

//handling user sign up
app.post('/register', function(req, res){
    req.body.username //requesting username | send from register page
    req.body.password // requesting password | from register page
    //we pass user name to function and save to data base
    //we will not store password to the data base
    //password will store in data base as in hash i.e, encoded 
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        //if get error | print err and visit register
        if(err){
            console.log(err);
            return res.render('register');
        }
        //if register sucessfull visit secret page
        //local | twitter| facebook .. can be used for other
        passport.authenticate("local")(req, res, function(){
                res.redirect('/secret');
        });
    });
});

//login
//render log in form
app.get("/login", function(req, res){
    res.render("login");
});

//login logic | add login method
// first input is for authenticate | middle ware | check data for login
app.post('/login', passport.authenticate('local',{
    successRedirect: '/secret',
    failureRedirect: '/login'
}), function(req, res){
});

//logout logic
app.get("/logout", function(req, res){
    req.logOut();
    //after logout redirect to home page
    res.render("home");
});

//after log out , still can visit secret page| we use this logic to destroy authentication after logout
//it is middle ware to check login status
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
        res.redirect("/login");
};

//hosting on 3001 port | local host
app.listen(3001, process.env.IP, function(){
    console.log("server started ...");
})