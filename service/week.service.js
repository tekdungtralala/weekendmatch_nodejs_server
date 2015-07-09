var promise = require('bluebird');
var _ = require('lodash');

var db = require('./../db');

module.exports = {
	getallWeek: getallWeek, // Get all weeks from db
	findActiveWeek: findActiveWeek, // Find week with active attr = true
	findPastWeeks: findPastWeeks
};
function getallWeek() {
	return findWeeks();
}

function findWeeks(query) {
	var fn = function (res, rej) {
		db.week.find(query).sort({"weekNumber": -1}, function (err, result) {
			// TODO how about err ?
			res(result);
		});
	}
	return new promise(fn);
}

function findActiveWeek() {

	var fn = function(result) {
		return _.find(result, function(w) {
			return w.active;
		})
	}

	return getallWeek().then(fn);
}

function findPastWeeks() {
	return findActiveWeek().then(findedCurrWeek);

	function findedCurrWeek(week) {
		return findWeeks({"weekNumber" : {$lte : week.weekNumber}});
	}
}