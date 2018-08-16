let express = require('express');
let router = express.Router();
const snoowrap = require('snoowrap');
const credentials = require('../etc/credentials.json');

// Create a new snoowrap requester with OAuth credentials.
const r = new snoowrap({
  userAgent: credentials.user_agent,
  clientId: credentials.client_id,
  clientSecret: credentials.client_secret,
  username: credentials.username,
  password: credentials.password
});

let keywords = ['thunder', 'okc', 'oklahoma']

function checkKeywords(postTitle){
	for (let i=0; i<keywords.length; i++){
		if (postTitle.indexOf(keywords[i]) >= 0){
			return true;
		}
	}
	return false;
}

function getData() { 
	return r.getSubreddit('nba').getHot({limit:1000})
	.filter(post => checkKeywords(post.title.toLowerCase()))
	.map(post => {
		return {
			title: post.title,
		 	score: post.score, 
			comments: post.num_comments, 
			url: post.url,
			permalink: `https://www.reddit.com${post.permalink}`,
			time: getRecency(post.created_utc)}
	});
}

function getRecency(timestamp){
	const timeNow = Math.round((new Date()).getTime()/1000);
	const minutesThreshold = 3600; 
	const hoursThreshold = 24 * minutesThreshold;

	let timeDiff = timeNow - timestamp;

	if (timeDiff < minutesThreshold){
		let relativeMinutes = Math.floor(timeDiff/60);
		return `${relativeMinutes} minute${relativeMinutes == 1 ? '' : 's'} ago`;
	}
	else if (timeDiff < hoursThreshold){
		let relativeHours = Math.floor(timeDiff/minutesThreshold);
		return `${relativeHours} hour${relativeHours == 1 ? '' : 's'} ago`;
	}
	else {
		let relativeDays = Math.floor(timeDiff/hoursThreshold);
		return `${relativeDays} day${relativeDays == 1 ? '' : 's'} ago`;
	}
}

router.get('/', (req, res)=>{
	getData()
		.then((data) => res.render('index', {title: "r/nba - OKC Thunder", data: data}));
	});

module.exports = router;