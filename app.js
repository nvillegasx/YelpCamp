var express = require("express");
var app = express();
var passport = require("passport");
var LocalStrategy = require("passport-local");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campgrounds");
var Comment = require("./models/comment");
// var seedDB = require("./seeds"); // seed the database
var User = require("./models/user");

// requiring routes
var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");

app.use(bodyParser.urlencoded({extended: true}));
app.set('port', 3000);//3000 orginal
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "the kings will win today",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});


// Set up default mongoose connection
mongoose.connect("mongodb://127.0.0.1/yelp_camp");
//Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
//Get the default connection
var db = mongoose.connection;
//Get notification of connection errors
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
seedDB();

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


app.listen(app.get('port'), function(){
    console.log('The YelpCamp Server Has Started! on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
  });
