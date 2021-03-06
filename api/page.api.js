var express = require('express');
var promise = require('bluebird');

var rankService = require('./../service/rank.service.js');
var weekService = require('./../service/week.service.js');
var matchdayService = require('./../service/matchday.service.js');

var page = express();
module.exports = page;

page.get('/rank', function (req, res) {
	weekService.findActiveWeek()
		.then(findedActiveWeek)
		.then(processData)

	function findedActiveWeek(w) {
		var arr = [
			rankService.getRanks({"week.weekNumber": w.weekNumber}),
			weekService.findPastWeeks()
		];
		return promise.all(arr);
	}

	function processData(data) {
		var result = {
			ranks: data[0],
			weeks: data[1]
		};

		res.json(result);
	}
});


page.get('/matchday', function (req, res) {

	weekService.findActiveWeek()
		.then(findedActiveWeek)
		.then(processData)

	function findedActiveWeek(w) {
		var arr = [
			matchdayService.getMatchdayModelView(w.weekNumber),
			weekService.getallWeek()
		]
		return promise.all(arr);
	}

	function processData(data) {
		var result = {
			matchdayModelView: data[0],
			weeks: data[1]
		};
		res.json(result);
	}
});