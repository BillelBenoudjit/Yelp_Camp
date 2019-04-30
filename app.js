var  express = require('express');
var  app = express();
var  bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Campground = require('./models/campground');
var Comment = require('./models/comment');
var seedDB = require('./seeds');

seedDB();

mongoose.connect("mongodb://localhost/yelp_camp" , { useNewUrlParser: true });
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

/*Campground.create({
        name:"Chrea",
        image:"https://cdn130.picsart.com/272387947050201.jpg?r1024x1024",
        description: "A nice place full of nice people, but there isn't a bathroom !"
    },
    function (err, campground) {
        if (err) {
            console.log(err);
        } else {
            console.log("NEWLY CREATED CAMPGROUND :");
            console.log(campground);
        }
    }
)*/

/*var  campgrounds = [
    {name:"Chrea", image:"https://cdn130.picsart.com/272387947050201.jpg?r1024x1024"},
    {name:"Aures", image:"https://cdn141.picsart.com/269456048005201.jpg?r1024x1024"},
    {name:"Kalla", image:"https://cdn141.picsart.com/271673218033201.jpg?r1024x1024"},
];*/

app.get("/", function (req, res) {
    res.render("landing");
})

app.get("/campgrounds", function (req, res) {
    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log("err");
        } else {
            res.render("campground/index", {campgrounds : allCampgrounds});
        }
    })
})

app.post("/campgrounds", function (req, res) {
    //res.send("YOU HIT THE POST ROUTE !");
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name: name, image: image, description: desc};
    Campground.create(newCampground, function (err, newAdded) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    })
    //campgrounds.push(newCampground);
})

app.get("/campgrounds/new", function (req, res) {
    res.render("campground/new");
})

app.get("/campgrounds/:id", function (req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            /*console.log(foundCampground);*/
            res.render("campground/show", {campground: foundCampground});
        }
    })
})

app.get("/campgrounds/:id/comments/new", function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render("comment/new", {campground: campground});
        }
    })  
})

app.post("/campgrounds/:id/comments", function(req, res) {
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
})

app.listen('3000', function () {
    console.log("HERE WE GO !!!");
})