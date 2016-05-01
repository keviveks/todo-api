var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [{
	id: 1,
	description: "Complete Node JS",
	completed: false
}, {
	id: 2,
	description: "Watch some city",
	completed: false
}, {
	id: 3,
	description: "New todo description",
	completed: true
}];

app.get('/', function(req, res) {
	res.send('ToDo API Root!');
});

app.get('/todos', function(req, res) {
	res.json(todos);
});

app.get('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo;

	todos.forEach(function(todo) {
		if(todo.id === todoId) {
			matchedTodo = todo;
		}
	});

	if(matchedTodo) {
		res.json(matchedTodo);
	} else {
		res.status(404).send();
	}
});

app.listen(PORT, function() {
	console.log("Server Listen to Port: " + PORT);
});