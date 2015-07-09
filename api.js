var express = require('express');

var api = express();
module.exports = api;

api.use('/ranks', require('./api/rank.api.js'));
api.use('/teams', require('./api/team.api.js'));
api.use('/matchday', require('./api/matchday.api.js'));
api.use('/chart', require('./api/chart.api.js'));
api.use('/page', require('./api/page.api.js'));