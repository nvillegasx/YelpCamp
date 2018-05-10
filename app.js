var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

app.use(bodyParser.urlencoded({extended: true}));
app.set('port', 3000);//3000 orginal
app.set("view engine", "ejs");

// Set up default mongoose connection
mongoose.connect("mongodb://127.0.0.1/yelp_camp");
//Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
//Get the default connection
var db = mongoose.connection;
//Get notification of connection errors
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
//     {
//         name: "Granite Hill", 
//         image: "https://farm3.staticflickr.com/2259/2182093741_164dc44a24.jpg"
//     }, function(err, campground){
//         if(err){
//             console.log(err);
//         }
//         else {
//             console.log("NEWLY CREATED CAMPGROUND: ");
//             console.log(campground);
//         }
//     }
// );


app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
    //get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        }
        else{
            res.render("campgrounds", {campgrounds:allCampgrounds});
        }
    });
});

app.post("/campgrounds", function(req, res){
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name: name, image: image};

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

app.get("/campgrounds/new", function(req, res){
    res.render("new.ejs");
});

app.listen(app.get('port'), function(){
    console.log('The YelpCamp Server Has Started! on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
  });
