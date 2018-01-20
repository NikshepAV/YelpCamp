var express 	= require('express');
var router 		= express.Router();
var Campground 	= require('../models/campground');


//INDEX - show all campgrounds
router.get('/', function(req, res) {
	//Get all campgrounds from db
	Campground.find({}, function(err, allCampgrounds) {
		if(err) {
			console.log(err);
		} else {
			res.render('campgrounds/index', {campgrounds: allCampgrounds});
		}
	})
});


//CREATE - add new campground to DB
router.post('/', isLoggedIn, function(req, res) {
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.desc;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCampground = {name: name, image: image, description: desc, author: author};
	
	//create a new campground and save to the db
	Campground.create(newCampground, function(err, newlyCreated) {
		if(err) {
			console.log(err);
		} else {
			//redirect back to campgrounds
			res.redirect('/campgrounds');
		}
	});
});


//NEW - show form to create new campground
router.get('/new', isLoggedIn, function(req, res) {
	res.render('campgrounds/new');
});



//SHOW - shows more info about one campground
router.get('/:id', function(req, res) {
	//find the campground with the provided ID
	Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground) {
		if(err) {
			console.log(err);
		} else {
			//render show template with associated compound
			res.render('campgrounds/show', {campground: foundCampground});
		}
	});
});


//middleware
function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
}


module.exports = router;