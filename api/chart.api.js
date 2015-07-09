var express = require('express');
var _ = require('lodash');

var rankService = require('./../service/rank.service.js');

var chart = express();
module.exports = chart;

chart.get('/week/:weekNumber(\\d+)/team/:teamId(\\d+)', function (req, res) {
	var weekNumber = parseInt(req.params.weekNumber);
	var teamId = parseInt(req.params.teamId);
	rankService.getRanks({"week.weekNumber": weekNumber}).then(function(ranks) {
		var teamData = [];
		var otherData = [0, 0, 0, 0, 0, 0];
		var teamName = null;
		_.every(ranks, function(r) {
			if (r.team.id === teamId) {
				teamData[0] = r.points;
				teamData[1] = r.gamesWon;
				teamData[2] = r.gamesLost;
				teamData[3] = r.gamesDrawn;
				teamData[4] = r.goalsScored;
				teamData[5] = r.goalsAgainst;
				teamName = r.team.name;
			} else {
				otherData[0] = r.points + otherData[0];
				otherData[1] = r.gamesWon + otherData[1];
				otherData[2] = r.gamesLost + otherData[2];
				otherData[3] = r.gamesDrawn + otherData[3];
				otherData[4] = r.goalsScored + otherData[4];
				otherData[5] = r.goalsAgainst + otherData[5];
			}
			return true;
		})

		for (var i = 0; i <= 5; i++) {
			otherData[i] = parseInt(otherData[i] / (ranks.length - 1));
		}

		var series = [];
		series.push({
			name: teamName, 
			data: teamData
		});
		series.push({
			name: 'Other Team',
			data: otherData
		});

		var categories = ['Points', 'Win Rate', 'Lose Rate', 'Draw Rate', 'Goal Scored', 'Goal Against'];
		var result = {
			series: series, 
			categories: categories
		}
		
		res.json(result);
	})
});