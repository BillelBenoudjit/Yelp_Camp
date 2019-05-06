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

router.post("/campgrounds/:id/comments", isLoggedIn, (req, res) => {
    //lookup campground using id
    Campground.findById(req.params.id, (err, campground) => {
      if (err) { 
        console.log(err);
        res.redirect("/campgrounds");
      }
      else {
        //create new comment
        var text = req.body.text;
        var newComment = {text:text};
        Comment.create(newComment, (err, comment) => {
          if (err) {
            console.log(err);
          } else {
            //add username and id to comments
            comment.author.id = req.user._id;
            comment.author.username = req.user.username;
            //save comment
            comment.save();
            console.log(comment.text);
            //connect new comment to campground
            campground.comments.push(comment);
            campground.save();
            //redirect to campground show page
            res.redirect("/campgrounds/" + campground._id);
          }
        });
      }
    });
  });
  

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};

module.exports = router;