var mongojs = require('mongojs');

module.exports = mongojs('wm', ['team', 'matchday', 'week', 'rank', 'test']);