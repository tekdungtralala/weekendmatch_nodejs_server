var express = require('express');

var app = express();
app.listen(3000);

app.use('/api', require('./api'));

app.get('/', function (req, res) {
	res.send("index.html will serve soon");
});
