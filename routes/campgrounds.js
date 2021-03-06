var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var midelleware = require("../middleware");

/////////////////////////
//CAMPground routes
router.get("/campgrounds", function (req, res) {
    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log("err");
        } else {
            res.render("campground/index", { campgrounds: allCampgrounds });
        }
    })
});

router.post("/campgrounds", midelleware.isLoggedIn, function (req, res) {
    //res.send("YOU HIT THE POST ROUTE !");
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = { name: name, image: image, description: desc, author: author };
    Campground.create(newCampground, function (err, newAdded) {
        if (err) {
            console.log(err);
        } else {
            console.log(newAdded);
            res.redirect("/campgrounds");
        }
    })
});

router.get("/campgrounds/new", midelleware.isLoggedIn, function (req, res) {
    res.render("campground/new");
});

router.get("/campgrounds/:id", function (req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            /*console.log(foundCampground);*/
            res.render("campground/show", { campground: foundCampground });
        }
    })
});

router.get("/campgrounds/:id/edit", midelleware.checkCampgroundOwnership, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        res.render("campground/edit", { campground: foundCampground });
    });

});

router.put("/campgrounds/:id", midelleware.checkCampgroundOwnership, function (req, res) {
    var data = { name: req.body.name, image: req.body.image, description: req.body.description };
    Campground.findByIdAndUpdate(req.params.id, data, function (err, updatedCampground) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

router.delete("/campgrounds/:id", midelleware.checkCampgroundOwnership, function (req, res) {
    Campground.findByIdAndDelete(req.params.id, function (err, deletedCampground) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;