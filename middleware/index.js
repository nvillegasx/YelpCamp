var Campground = require("../models/campgrounds");
var Comment = require("../models/comment");
// all the middleware goes here
var middlewareObj = {};

middlewareObj.isAdmin = function(req, res, next){
    if(req.user.isAdmin){
        next();
    } else {
        req.flash("error", "This site is now read only thanks to spam and trolls");
        res.redirect("back");
    }
};

middlewareObj.isSafe = function(req, res, next){
    if(req.body.image.match(/^https:\/\/images\.unsplash\.com\/.*/)) {
        next();
    }else {
        req.flash('error', 'Only images from images.unsplash.com allowed.\nSee https://youtu.be/Bn3weNRQRDE for how to copy image urls from unsplash.');
        res.redirect('back');
    }
};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    Campground.findById( req.params.id, function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "Campground not found");
            res.redirect("back");
        } else if(foundCampground.author.id.equals(req.user._id)){
            req.campground = foundCampground;
        } else {

            // if(!foundCampground){
            //     req.flash("error", "Item not found");
            //     return res.redirect("back");
            // }
            // // does user own the campground
            // if(foundCampground.author.id.equals(req.user._id)){
            //     next();
            // } else {
            req.flash("error", "You don't have permission to do that");
            res.redirect("/campgrounds/" + req.params.id);
            // }
        }
    });
};

middlewareObj.checkCommentOwnership = function(req, res, next){
    Comment.findById( req.params.comment_id, function(err, foundComment){
        if(err || !foundComment){
            console.log(err);
            req.flash("error", "Sorry, that comment does not exist!");
            res.redirect("/campgrounds");
        } else if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
            req.comment = foundComment;
            next();
        } else {
            req.flash("error", "You don't have permission to do that");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    // before redirect, then must handle in route
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
};

module.exports = middlewareObj;