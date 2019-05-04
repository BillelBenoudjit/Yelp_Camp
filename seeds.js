var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require('./models/comment')
var data = [
    { name: "Chrea", image: "https://cdn130.picsart.com/272387947050201.jpg?r1024x1024", description: "On sait depuis longtemps que travailler avec du texte lisible et contenant du sens est source de distractions, et empêche de se concentrer sur la mise en page elle-même. L'avantage du Lorem Ipsum sur un texte générique comme 'Du texte. Du texte. Du texte.' est qu'il possède une distribution de lettres plus ou moins normale, et en tout cas comparable avec celle du français standard. De nombreuses suites logicielles de mise en page ou éditeurs de sites Web ont fait du Lorem Ipsum leur faux texte par défaut, et une recherche pour 'Lorem Ipsum' vous conduira vers de nombreux sites qui n'en sont encore qu'à leur phase de construction. Plusieurs versions sont apparues avec le temps, parfois par accident, souvent intentionnellement (histoire d'y rajouter de petits clins d'oeil, voire des phrases embarassantes)." },
    { name: "Aures", image: "https://cdn141.picsart.com/269456048005201.jpg?r1024x1024", description: "On sait depuis longtemps que travailler avec du texte lisible et contenant du sens est source de distractions, et empêche de se concentrer sur la mise en page elle-même. L'avantage du Lorem Ipsum sur un texte générique comme 'Du texte. Du texte. Du texte.' est qu'il possède une distribution de lettres plus ou moins normale, et en tout cas comparable avec celle du français standard. De nombreuses suites logicielles de mise en page ou éditeurs de sites Web ont fait du Lorem Ipsum leur faux texte par défaut, et une recherche pour 'Lorem Ipsum' vous conduira vers de nombreux sites qui n'en sont encore qu'à leur phase de construction. Plusieurs versions sont apparues avec le temps, parfois par accident, souvent intentionnellement (histoire d'y rajouter de petits clins d'oeil, voire des phrases embarassantes)." },
    { name: "Kalla", image: "https://cdn141.picsart.com/271673218033201.jpg?r1024x1024", description: "On sait depuis longtemps que travailler avec du texte lisible et contenant du sens est source de distractions, et empêche de se concentrer sur la mise en page elle-même. L'avantage du Lorem Ipsum sur un texte générique comme 'Du texte. Du texte. Du texte.' est qu'il possède une distribution de lettres plus ou moins normale, et en tout cas comparable avec celle du français standard. De nombreuses suites logicielles de mise en page ou éditeurs de sites Web ont fait du Lorem Ipsum leur faux texte par défaut, et une recherche pour 'Lorem Ipsum' vous conduira vers de nombreux sites qui n'en sont encore qu'à leur phase de construction. Plusieurs versions sont apparues avec le temps, parfois par accident, souvent intentionnellement (histoire d'y rajouter de petits clins d'oeil, voire des phrases embarassantes)." },
]

function seedDB() {
    //Remove all campgrounds
    Campground.remove({}, function (err) {
        if (err) {
            console.log(err);
        }
        console.log("removed campgrounds");
        //Add few campgrounds
        data.forEach(function (seed) {
            Campground.create(seed, function (err, data) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('campground add !');
                    //create comment
                    Comment.create ({
                        text: "Here is a great weather for dancing",
                        author: 'Bill'
                    }, function (err, comment) {
                        if (err) {
                            console.log(err);
                        } else {
                            data.comments.push(comment);
                            data.save();
                            console.log(comment.text);
                            console.log("Created new comment !");
                        }
                    });
                }
            })
        });
    });
}

module.exports = seedDB;
