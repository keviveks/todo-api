var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [{
	description: "Complete Node JS",
	completed: false
}];

app.get('/', function(req, res) {
	res.send('ToDo API Root!');
});

app.listen(PORT, function() {
	console.log("Server Listen to Port: " + PORT);
});