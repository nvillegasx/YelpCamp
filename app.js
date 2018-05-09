var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set('port', 3000);//3000 orginal
app.set("view engine", "ejs");

var campgrounds = [
    {name: "Salmon Creek", image: "https://farm8.staticflickr.com/7252/7626464792_3e68c2a6a5.jpg"},
    {name: "Granite Hill", image: "https://farm3.staticflickr.com/2259/2182093741_164dc44a24.jpg"},
    {name: "Mountain Goat's Rest", image: "https://farm2.staticflickr.com/1086/882244782_d067df2717.jpg"}
];

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){

    res.render("campgrounds", {campgrounds:campgrounds});
});

app.post("/campgrounds", function(req, res){
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name: name, image: image};
    campgrounds.push(newCampground);
    //redirect back to campgrounds page
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res){
    res.render("new.ejs");
});

app.listen(app.get('port'), function(){
    console.log('The YelpCamp Server Has Started! on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
  });
