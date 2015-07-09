var db = require('./db');
var _ = require('lodash');
var moment = require('moment');

var promise = require('bluebird');
var team = require('./team');

module.exports = {
	getMatchdays: getMatchdays, // Get all matchday

	generateMatchModel: generateMatchModel, // Generate matchday model from matchday list

	getMatchdayModelView: getMatchdayModelView 
};

function getMatchdayModelView(weekNumber) {
	var fn = function (res, rej) {
		getMatchdays({"week.weekNumber": weekNumber}).then(function(matchdays) {
			var result = {};
			result.week = {weekNumber: weekNumber};
			result.model = generateMatchModel(matchdays);
			res(result);
		});
	}

	return new promise(fn);
}

function getMatchdays(query) {
	// Need to get all_team, then we will change the reference id 
	//  with the real team data
	var arr = [
		team.getAllTeam(), 
		getMatchdaysFN(query)
	];

	// Fetch all data, then process
	return promise.all(arr)
		.then(processMatchdayData);
}

function processMatchdayData(result) {
	var matchdays = result[1];
	var teams = result[0];

	// Need to iterate all matchday, then replace the team reff
	//  with the real one
	_.every(matchdays, function(m) {
		var homeTeam = _.find(teams, function(t) {
			return t._id.equals(m.homeTeam);
		})
		m.homeTeam = homeTeam;

		var awayTeam = _.find(teams, function(t) {
			return t._id.equals(m.awayTeam);
		})
		m.awayTeam = awayTeam;

		m.date = m.date.getTime();
		return true;
	});

	// Each matchday has the team data
	return matchdays;
}

function getMatchdaysFN(query) {

	var fn = function(res, rej) {
		db.matchday.find(query).sort({date:1, time:1}, function (err, result) {
			// TODO how about err ?
			res(result);
		});
	}

	return new promise(fn);
}

function generateMatchModel(matchdays) {
	var sameDate = [];
	var model = {};
	_.every(matchdays, function(m) {
		var isExist = _.find(sameDate, function(d) {
			return m.date === d;
		});

		var key = moment(m.date / 1000, "X").format("ddd MMM DD,YYYY");
		if (!isExist) {
			sameDate.push(m.date);
			model[key] = [];
		} 
		model[key].push(m);

		return true;
	});
	return model;
}