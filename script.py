import praw
import pprint
import json
import datetime
import configparser

config = configparser.ConfigParser()
config.read('etc/credentials.txt')

reddit = praw.Reddit(client_id =config.get('credentials', 'client_id'),
                     client_secret=config.get('credentials', 'client_secret'),
                     user_agent=config.get('credentials', 'user_agent'),
                     username=config.get('credentials', 'username'),
                     password=config.get('credentials', 'password'))

subreddit = reddit.subreddit('nba')

data = []
for submission in subreddit.hot(limit=1000):
	if 'okc' in submission.title.lower() or \
		'thunder' in submission.title.lower()or \
		'oklahoma' in submission.title.lower():

		data.append({
			"title": submission.title, 
			"score": submission.score,
			"comments": submission.num_comments,
			"url": submission.url,
			"permalink": 'https://www.reddit.com' + submission.permalink,
			"date": datetime.datetime.utcfromtimestamp(submission.created_utc).strftime("%B %d, %Y")
		})

# end="" doesn't append a "\n" at the end of print statement
print(data, end="")