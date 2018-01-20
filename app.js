//requiring packages
var express 		= require('express'),
	app 			= express(),
	bodyPraser 		= require('body-parser'),
	mongoose 		= require('mongoose'),
	seedDB			= require('./seeds'),
	passport		= require('passport'),
	LocalStrategy 	= require('passport-local'),
	methodOverride	= require('method-override'),
	flash 			= require('connect-flash');

//requiring models
var User 		= require('./models/user'),
	Campground 	= require('./models/campground'),
	Comment 	= require('./models/comment');


//requiring routes	
var	indexRoutes			= require('./routes/index'),
	campgroundRoutes 	= require('./routes/campgrounds'),
	commentRoutes		= require('./routes/comments');


// mongoose.connect('mongodb://localhost/yelp_camp', {useMongoClient: true});
mongoose.connect('mongodb://nikshepav:password@ds211088.mlab.com:11088/yelp_camp');

app.use(bodyPraser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'));
app.use(flash());

//seeding the database
// seedDB();


// PASSPORT CONFIGURATION
app.use(require('express-session')({
	secret: 'This is a secret message',
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
});

app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);


// app.listen(3000, function(req, res) {
// 	console.log('YelpCamp server is online.....');
// });

app.listen(process.env.port, process.env.IP);