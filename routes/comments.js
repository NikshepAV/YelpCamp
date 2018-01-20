var express 	= require('express');
var router 		= express.Router({mergeParams: true});
var Campground 	= require('../models/campground');
var Comment 	= require('../models/comment');


//show form to add a new comment
router.get('/new', isLoggedIn, function(req, res) {
	//find the associated campground
	Campground.findById(req.params.id, function(err, foundCampground) {
		if(err) {
			console.log(err);
		} else {
			res.render('comments/new', {campground: foundCampground});
		}
	});
});

//handle the logic for adding the new comment
router.post('/', isLoggedIn, function(req, res) {
	//look up campground using id
	Campground.findById(req.params.id, function(err, foundCampground) {
		if(err) {
			console.log(err);
			res.redirect('/campgrounds');
		} else {
			//create a new comment
			Comment.create(req.body.comment, function(err, comment) {
				if(err) {
					console.log(err);
				} else {
					//connect a new comment to campground
					foundCampground.comments.push(comment);
					foundCampground.save();
					//redirect to campgorund show page
					res.redirect('/campgrounds/' + foundCampground._id);
				}
			});	
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