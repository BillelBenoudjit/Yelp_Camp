var  express = require('express');
var  app = express();
var  bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Campground = require('./models/campground');
var Comment = require('./models/comment');
var seedDB = require('./seeds');
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");
var campgroundRoutes = require("./routes/campgrounds");
var commentRoutes = require("./routes/comments");
var authRoutes = require("./routes/auth");

seedDB();

mongoose.connect("mongodb://localhost/yelp_camp" , { useNewUrlParser: true });
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(require("express-session")({
    secret: "Here I am",
    resave: false,
    saveUnitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

<<<<<<< HEAD
app.use(authRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);
=======
app.get("/campgrounds/:id/comments/new", isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render("comment/new", {campground: campground});
        }
    })  
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            var text = req.body.text;
            var author = req.body.author;
            var newComment = {text:text, author:author};
            Comment.create(newComment, function (err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            })
        }
    })
});

//AUTH ROUTES
//show register form
app.get("/register", function(req, res) {
    res.render("register");
});
//handle sign up logic
app.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function (err, user) {
       if (err) {
           console.log(err);
           return res.render("register");
       }
       passport.authenticate("local")(req, res, function () {
           res.redirect("/campgrounds"); 
       });
    });
});
//show login form
app.get("/login", function (req, res) {
    res.render("login");
});
//handle login logic
app.post("/login", passport.authenticate("local", 
{
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function (req, res) {
});
//logout route
app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/campgrounds");
});
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};
>>>>>>> a1654d44582212ee66f1e49789e225bffaf1bfc1

app.listen('3000', function () {
    console.log("YELP CAMP ..."); 
});