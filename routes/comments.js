var express 	= require('express');
var router 		= express.Router({mergeParams: true});
var Campground 	= require('../models/campground');
var Comment 	= require('../models/comment');
var middleware  = require('../middleware');


//show form to add a new comment
router.get('/new', middleware.isLoggedIn, function(req, res) {
	//find the associated campground
	Campground.findById(req.params.id, function(err, foundCampground) {
		if(err) {
			req.flash('error', 'Something went wrong. Please try again.');
		} else {
			res.render('comments/new', {campground: foundCampground});
		}
	});
});

//handle the logic for adding the new comment
router.post('/', middleware.isLoggedIn, function(req, res) {
	//look up campground using id
	Campground.findById(req.params.id, function(err, foundCampground) {
		if(err) {
			req.flash('error', 'Something went wrong. Please try again.');
			res.redirect('/campgrounds');
		} else {
			//create a new comment
			Comment.create(req.body.comment, function(err, comment) {
				if(err) {
					req.flash('error', 'Something went wrong. Please try again.');
				} else {
					//add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//save comment
					comment.save();
					//connect a new comment to campground
					foundCampground.comments.push(comment);
					foundCampground.save();
					req.flash('success', 'Comment added.');
					//redirect to campgorund show page
					res.redirect('/campgrounds/' + foundCampground._id);
				}
			});	
		}
	});
});


// EDIT COMMENT ROUTE
router.get('/:comment_id/edit', middleware.checkCommentOwnership, function(req, res) {
	Comment.findById(req.params.comment_id, function(err, foundComment) {
		if(err) {
			req.flash('error', 'Something went wrong. Please try again.');
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
router.put('/:comment_id', middleware.checkCommentOwnership, function(req, res) {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
		if(err) {
			req.flash('error', 'Something went wrong. Please try again.');
			res.redirect('back');
		} else {
			req.flash('success', 'Comment updated.');
			res.redirect('/campgrounds/' + req.params.id);
		}
	});
});


// DELETE COMMENT ROUTE
router.delete('/:comment_id', middleware.checkCommentOwnership, function(req, res) {
	Comment.findByIdAndRemove(req.params.comment_id, function(err) {
		if(err) {
			req.flash('error', 'Something went wrong. Please try again.');
			res.redirect('back');
		} else {
			req.flash('success', 'Comment deleted.');
			res.redirect('/campgrounds/' + req.params.id);
		}
	});
});


module.exports = router;