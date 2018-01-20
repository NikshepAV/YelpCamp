var mongoose 	= require('mongoose'),
	Campground	= require('./models/campground'),
	Comment 	= require('./models/comment');

var data = [
	{
		name: 'Star-Gazer Desert',
		image: 'https://farm6.staticflickr.com/5204/5315979822_3591b6509f.jpg',
		description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent feugiat ornare erat sed fermentum. Aliquam mollis finibus est. Vivamus pretium, tortor laoreet tincidunt auctor, risus lorem dictum nunc, eget blandit neque mauris eget lorem. Maecenas tortor sapien, aliquam laoreet metus sed, malesuada viverra risus. Nulla enim metus, sodales faucibus imperdiet a, rhoncus at dui. Suspendisse odio dui, fermentum non sem in, maximus fringilla ex. Maecenas feugiat quam non dui dapibus sagittis. Nullam sit amet iaculis nunc, in ornare est. Praesent fringilla eget lorem sed fermentum. Vestibulum lacinia elit vel euismod sagittis. Sed tincidunt dui auctor diam tristique, et tempor metus rutrum. Quisque non dui id metus sagittis fermentum. Suspendisse euismod fringilla elit ac congue. Praesent a tellus id tortor mollis tristique sit amet eu nulla. Donec ut arcu posuere, facilisis mauris et, hendrerit elit. Aliquam non dui facilisis, tincidunt sapien ac, ultrices nisl.'
	},
	{
		name: 'Misty Woods Site',
		image: 'https://farm3.staticflickr.com/2288/5808881553_8c3214a9ce.jpg',
		description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent feugiat ornare erat sed fermentum. Aliquam mollis finibus est. Vivamus pretium, tortor laoreet tincidunt auctor, risus lorem dictum nunc, eget blandit neque mauris eget lorem. Maecenas tortor sapien, aliquam laoreet metus sed, malesuada viverra risus. Nulla enim metus, sodales faucibus imperdiet a, rhoncus at dui. Suspendisse odio dui, fermentum non sem in, maximus fringilla ex. Maecenas feugiat quam non dui dapibus sagittis. Nullam sit amet iaculis nunc, in ornare est. Praesent fringilla eget lorem sed fermentum. Vestibulum lacinia elit vel euismod sagittis. Sed tincidunt dui auctor diam tristique, et tempor metus rutrum. Quisque non dui id metus sagittis fermentum. Suspendisse euismod fringilla elit ac congue. Praesent a tellus id tortor mollis tristique sit amet eu nulla. Donec ut arcu posuere, facilisis mauris et, hendrerit elit. Aliquam non dui facilisis, tincidunt sapien ac, ultrices nisl.'
	},
	{
		name: 'River-side Campsite',
		image: 'https://farm4.staticflickr.com/3504/3733252317_6e499abda4.jpg',
		description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent feugiat ornare erat sed fermentum. Aliquam mollis finibus est. Vivamus pretium, tortor laoreet tincidunt auctor, risus lorem dictum nunc, eget blandit neque mauris eget lorem. Maecenas tortor sapien, aliquam laoreet metus sed, malesuada viverra risus. Nulla enim metus, sodales faucibus imperdiet a, rhoncus at dui. Suspendisse odio dui, fermentum non sem in, maximus fringilla ex. Maecenas feugiat quam non dui dapibus sagittis. Nullam sit amet iaculis nunc, in ornare est. Praesent fringilla eget lorem sed fermentum. Vestibulum lacinia elit vel euismod sagittis. Sed tincidunt dui auctor diam tristique, et tempor metus rutrum. Quisque non dui id metus sagittis fermentum. Suspendisse euismod fringilla elit ac congue. Praesent a tellus id tortor mollis tristique sit amet eu nulla. Donec ut arcu posuere, facilisis mauris et, hendrerit elit. Aliquam non dui facilisis, tincidunt sapien ac, ultrices nisl.'
	}
];



function seedDB() {
	//remove all campgrounds
	Campground.remove({}, function(err) {
		if(err) {
			console.log(err);
		} else {
			console.log('removed all campgrounds');
			//add a few campgrounds
			data.forEach(function(seed) {
				Campground.create(seed, function(err, campground) {
					if(err) {
						console.log(err);
					} else {
						console.log('added a campground');
						//add a comment
						Comment.create({
							text: 'This place is great but no cellphone coverage',
							author: 'Jim Brenes'
							}, function(err, comment) {
								if(err) {
									console.log(err);
								} else {
									campground.comments.push(comment);
									campground.save();
									console.log('created a new comment');
								}	
						});
					}
				});
			});
		}
	}); 
	//add a few comments
}

module.exports = seedDB;