var express 		= require('express'),
	app 			= express(),
	bodyPraser 		= require('body-parser'),
	mongoose 		= require('mongoose'),
	seedDB			= require('./seeds'),
	passport		= require('passport'),
	LocalStrategy 	= require('passport-local');


var User 		= require('./models/user'),
	Campground 	= require('./models/campground'),
	Comment 	= require('./models/comment');


mongoose.connect('mongodb://localhost/yelp_camp');
app.use(bodyPraser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

seedDB();


app.get('/', function(req, res) {
	res.render('landing');
});


//INDEX - show all campgrounds
app.get('/campgrounds', function(req, res) {
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
app.post('/campgrounds', function(req, res) {
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.desc;
	var newCampground = {name: name, image: image, description: desc};
	
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
app.get('/campgrounds/new', function(req, res) {
	res.render('campgrounds/new');
});



//SHOW - shows more info about one campground
app.get('/campgrounds/:id', function(req, res) {
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


app.get('/campgrounds/:id/comments/new', function(req, res) {
	//find the associated campground
	Campground.findById(req.params.id, function(err, foundCampground) {
		if(err) {
			console.log(err);
		} else {
			res.render('comments/new', {campground: foundCampground});
		}
	});
});


app.post('/campgrounds/:id/comments', function(req, res) {
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


app.listen(3000, function(req, res) {
	console.log('YelpCamp server is online.....');
});