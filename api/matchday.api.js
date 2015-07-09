var express = require('express');

var matchdayService = require('./../service/matchday.service.js');
var weekService = require('./../service/week.service.js');

var matchday = express();
module.exports = matchday;

matchday.get('/:weekNumber(\\d+)/', function (req, res) {
	var weekNumber = parseInt(req.params.weekNumber);
	matchdayService.getMatchdayModelView(weekNumber).then(function(result) {
		res.json(result);
	})
});

matchday.get('/page/matchday', function (req, res) {

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