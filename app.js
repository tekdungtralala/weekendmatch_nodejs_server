var express = require('express')
var app = express();

var _ = require('lodash');
var promise = require('bluebird');

var matchday = require("./matchday");
var team = require('./team');
var week = require('./week');
var rank = require('./rank');

app.listen(3000)

app.get('/api/chart/week/:weekNumber(\\d+)/team/:teamId(\\d+)', function (req, res) {
	var weekNumber = parseInt(req.params.weekNumber);
	var teamId = parseInt(req.params.teamId);
	rank.getRanks({"week.weekNumber": weekNumber}).then(function(ranks) {
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

app.get('/api/ranks/:weekNumber(\\d+)/', function (req, res) {
	var weekNumber = parseInt(req.params.weekNumber);
	rank.getRanks({"week.weekNumber": weekNumber}).then(function(result) {
		res.json({ranks: result})
	})
});

app.get('/api/matchday/:weekNumber(\\d+)/', function (req, res) {
	var weekNumber = parseInt(req.params.weekNumber);
	matchday.getMatchdayModelView(weekNumber).then(function(result) {
		res.json(result);
	})
});

app.get('/api/teams', function (req, res) {
	team.getAllTeam().then(function(teams) {
		var result = {result: teams};

		res.json(result);
	});
});

app.get('/api/page/matchday', function (req, res) {

	week.findActiveWeek()
		.then(findedActiveWeek)
		.then(processData)

	function findedActiveWeek(w) {
		var arr = [
			matchday.getMatchdayModelView(w.weekNumber),
			week.getallWeek()
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

app.get('/api/page/rank', function (req, res) {
	week.findActiveWeek()
		.then(findedActiveWeek)
		.then(processData)

	function findedActiveWeek(w) {
		var arr = [
			rank.getRanks({"week.weekNumber": w.weekNumber}),
			week.findPastWeeks()
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

app.get('/', function (req, res) {
	var abc = {};
	abc.a = "ini a";
	abc.b = true;
	abc.c = 333;
	abc.d = 44.44;
	abc.e = {};
	abc.e.a = "ok";
  res.json(abc);
});