var express = require('express');

var teamService = require('./../service/team.service.js');

var team = express();
module.exports = team;

team.get('/', function (req, res) {
	teamService.getAllTeam().then(function(teams) {
		var result = {result: teams};

		res.json(result);
	});
});