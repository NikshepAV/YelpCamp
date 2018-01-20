var express 	= require('express');
var router 		= express.Router();
var Campground 	= require('../models/campground');
var middleware  = require('../middleware');


//INDEX - show all campgrounds
router.get('/', function(req, res) {
	//Get all campgrounds from db
	Campground.find({}, function(err, allCampgrounds) {
		if(err) {
			req.flash('error', 'Something went wrong. Please try again.');
		} else {
			res.render('campgrounds/index', {campgrounds: allCampgrounds});
		}
	})
});


//CREATE - add new campground to DB
router.post('/', middleware.isLoggedIn, function(req, res) {
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
			req.flash('error', 'Something went wrong. Please try again.');
		} else {
			req.flash('success', 'Successfully created.');
			//redirect back to campgrounds
			res.redirect('/campgrounds');
		}
	});
});


//NEW - show form to create new campground
router.get('/new', middleware.isLoggedIn, function(req, res) {
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


// EDIT CAMPGROUND ROUTE
router.get('/:id/edit', middleware.checkCampgroundOwnership, function(req, res) {
	Campground.findById(req.params.id, function(err, foundCampground) {
		res.render('campgrounds/edit', {campground: foundCampground});	
	});
});


// UPDATE CAMPGROUND ROUTE
router.put('/:id', middleware.checkCampgroundOwnership, function(req, res) {
	//find and update the correct campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
		if(err) {
			req.flash('error', 'Something went wrong. Please try again.');
			res.redirect('/campgrounds');
		} else {
			req.flash('success', 'Successfully updated.');
			//redirect show page
			res.redirect('/campgrounds/' + updatedCampground._id);
		}
	});
});

// DESTROY CAMPGROUND ROUTE
router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res) {
	Campground.findByIdAndRemove(req.params.id, function(err) {
		if(err) {
			req.flash('error', 'Something went wrong. Please try again.');
			res.redirect('/campgrounds');
		} else {
			req.flash('success', 'Successfully deleted.');
			res.redirect('/campgrounds');
		}
	});
});


module.exports = router;