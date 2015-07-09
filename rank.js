var db = require('./db');
var _ = require('lodash');
var moment = require('moment');

var promise = require('bluebird');
var team = require('./team');

module.exports = {
	getRanks: getRanks
};

function getRanks(query) {
	var arr = [team.getAllTeam(), getRanksFN(query)];

	return promise.all(arr).then(processRankData);
}

function processRankData(result) {
	var teams = result[0];
	var ranks = result[1];

	_.every(ranks, function(r) {
		var team = _.find(teams, function(t) {
			return t._id.equals(r.team);
		});
		r.team = team;
		return true;
	});

	return ranks;
}

function getRanksFN(query) {
	var fn = function(res, rej) {
		db.rank.find(query).sort({"points": -1}, function(err, result) {
			res(result);
		});
	}

	return new promise(fn);
}