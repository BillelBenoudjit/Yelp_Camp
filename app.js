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

app.use(authRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);

app.listen('3000', function () {
    console.log("YELP CAMP ..."); 
});