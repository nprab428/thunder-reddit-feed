// This api is reachable through /api/keywords/kw=foo&kw=bar&...

const express = require('express');

const router = express.Router();
const Snoowrap = require('snoowrap');
const credentials = require('../etc/credentials.json');

// Create a new snoowrap requester with OAuth credentials.
const r = new Snoowrap({
  userAgent: credentials.user_agent,
  clientId: credentials.client_id,
  clientSecret: credentials.client_secret,
  username: credentials.username,
  password: credentials.password,
});

function getRecency(timestamp) {
  const timeNow = Math.round(new Date().getTime() / 1000);
  const minutesThreshold = 3600;
  const hoursThreshold = 24 * minutesThreshold;

  const timeDiff = timeNow - timestamp;

  if (timeDiff < minutesThreshold) {
    const relativeMinutes = Math.floor(timeDiff / 60);
    return `${relativeMinutes} minute${relativeMinutes === 1 ? '' : 's'} ago`;
  }
  if (timeDiff < hoursThreshold) {
    const relativeHours = Math.floor(timeDiff / minutesThreshold);
    return `${relativeHours} hour${relativeHours === 1 ? '' : 's'} ago`;
  }

  const relativeDays = Math.floor(timeDiff / hoursThreshold);
  return `${relativeDays} day${relativeDays === 1 ? '' : 's'} ago`;
}

function getData(keywords) {
  const regex = new RegExp(`(${keywords.join('|')})`, 'i');
  return r
    .getSubreddit('nba')
    .getHot({ limit: 1000 })
    .filter(post => post.title.match(regex))
    .map(post => ({
      id: post.created_utc,
      title: post.title,
      score: post.score,
      comments: post.num_comments,
      url: post.url,
      permalink: `https://www.reddit.com${post.permalink}`,
      time: getRecency(post.created_utc),
    }));
}

router.get('/keywords', (req, res) => {
  const keywords = Array.isArray(req.query.kw)
    ? [...req.query.kw]
    : [req.query.kw];
  getData(keywords).then(data => res.json(data));
});

module.exports = router;
