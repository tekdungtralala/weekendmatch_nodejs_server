var express = require('express');

var rankService = require('./../service/rank.service.js');

var rank = express();
module.exports = rank;

rank.get('/:weekNumber(\\d+)/', function (req, res) {
	var weekNumber = parseInt(req.params.weekNumber);
	rankService.getRanks({"week.weekNumber": weekNumber}).then(function(result) {
		res.json({ranks: result})
	})
});