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
					//add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//save comment
					comment.save();
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


// EDIT COMMENT ROUTE
router.get('/:comment_id/edit', checkCommentOwnership, function(req, res) {
	Comment.findById(req.params.comment_id, function(err, foundComment) {
		if(err) {
			res.redirect('back');
		} else {
			res.render('comments/edit', {
				campground_id: req.params.id,
				comment: foundComment,
			});
		}
	});	
});

// UPDATE COMMENT ROUTE
router.put('/:comment_id', checkCommentOwnership, function(req, res) {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
		if(err) {
			res.redirect('back');
		} else {
			res.redirect('/campgrounds/' + req.params.id);
		}
	});
});


// DELETE COMMENT ROUTE
router.delete('/:comment_id', checkCommentOwnership, function(req, res) {
	Comment.findByIdAndRemove(req.params.comment_id, function(err) {
		if(err) {
			res.redirect('back');
		} else {
			res.redirect('/campgrounds/' + req.params.id);
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

function checkCommentOwnership(req, res, next) {
	//is user logged in
	if(req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, function(err, foundComment) {
			if(err) {
				res.redirect('back');
			} else {
				//does the user own the campground
				if(foundComment.author.id.equals(req.user._id)) {
					next();
				} else {
					res.redirect('back');
				}
			}
		});
	} else {
		res.redirect('back');
	}
}


module.exports = router;