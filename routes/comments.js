var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var User = require("../models/user");
var midelleware = require("../middleware");

/////////////////////////
// Comment routes
router.get("/campgrounds/:id/comments/new", midelleware.isLoggedIn, function (req, res) {
  Campground.findById(req.params.id, function (err, campground) {
    if (err) {
      console.log(err);
    } else {
      res.render("comment/new", { campground: campground });
    }
  })
});

router.post("/campgrounds/:id/comments", midelleware.isLoggedIn, (req, res) => {
  //lookup campground using id
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    }
    else {
      //create new comment
      var text = req.body.text;
      var newComment = { text: text };
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

router.get("/campgrounds/:id/comments/:comment_id/edit", midelleware.checkCommentOwnership, function (req, res) {
  Comment.findById(req.params.comment_id, function (err, foundComment) {
    if (err) {
      res.redirect("back");
    } else {
      var id = req.params.id;
      res.render("comment/edit", { id, comment: foundComment });
    }
  })
});

router.put("/campgrounds/:id/comments/:comment_id", midelleware.checkCommentOwnership, function (req, res) {
  var comment = req.body;
  Comment.findByIdAndUpdate(req.params.comment_id, comment, (err, updatedComment) => {
    if (err) { res.redirect("back"); }
    else { res.redirect("/campgrounds/" + req.params.id); }
  });
});

router.delete("/campgrounds/:id/comments/:comment_id", midelleware.checkCommentOwnership, function (req, res) {
  Comment.findByIdAndRemove(req.params.comment_id, function (err) {
    if (err) {
      res.redirect(back);
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  })
});

module.exports = router;