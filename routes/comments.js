var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var User = require("../models/user");

/////////////////////////
// Comment routes
router.get("/campgrounds/:id/comments/new", isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render("comment/new", {campground: campground});
        }
    })  
});

router.post("/campgrounds/:id/comments", isLoggedIn, function(req, res) {
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
                    comment.author._id = req.user.id;
                    comment.author.username = req.user.username;
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            })
        }
    })
});

function isLoggedIn(req, res, next) {
    /*console.log(req.user);*/
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};

module.exports = router;