var express = require("express");
var router = express.Router();
var Campground = require("../models/campgrounds");
var middleware = require("../middleware/index");

// INDEX- show all campgrounds
router.get("/", function(req, res){
    //get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        }
        else{
            res.render("campgrounds/index", {campgrounds:allCampgrounds, currentUser: req.user});
        }
    });
});

// create route - add new campground to DB
router.post("/", middleware.isLoggedIn, middleware.isSafe, function(req, res){
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, image: image, description: desc, author: author};

    //create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        }
        else{
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});

// new show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

// show - shows more info about one campground
// must go at the end or it will go here first
router.get("/:id", function(req, res){
    //find the campground with the id
    Campground.findById(req.params.id).populate("comments").exec( function(err, foundCampground){
        if(err || !foundCampground){
            console.log(err);
            req.flash("error", "Sorry, that campground does not exist!");
            return res.redirect("/campgrounds");
        }
        else{
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });

});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.isLoggedIn ,middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById( req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

//UPDATE CAMPGROUND ROUTE
// TODO GEOCODE STUFF
router.put("/:id", middleware.isSafe ,middleware.checkCampgroundOwnership, function(req, res){
    //find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        }
        else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
    //redirect somewhere (show page)
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.isLoggedIn ,middleware.checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndRemove( req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});


module.exports = router;