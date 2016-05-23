var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var nextTodoId = 1;

app.use(bodyParser.json());

app.get('/', function(req, res) {
	res.send('ToDo API Root!');
});

app.get('/todos', function(req, res) {
	var query = req.query;
	var where = {};

	if (query.hasOwnProperty('completed')) {
		if (query.completed === 'true') {
			where.completed = true;
		} else if (query.completed === 'false') {
			where.completed = false;
		}
	}

	if (query.hasOwnProperty('q') && query.q.length > 0) {
		where.description = {
			$like: '%' + query.q + '%'
		};
	}

	db.todo.findAll({where: where}).then(function(todos) {
		res.json(todos);
	}, function(e) {
		res.status(500).send("no todo found");
	});
});

app.get('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);

	db.todo.findById(todoId).then(function(todo) {
		if(todo) {
			res.json(todo.toJSON());
		} else {
			res.status(404).send("no todo found");
		}
	}, function(e) {
		return res.status(500).send();
	});
});

app.post('/todos', function(req, res) {
	var body = _.pick(req.body, "description", "completed");

	db.todo.create(body).then(function(todo) {
		res.json(todo.toJSON());
	}).catch(function(e) {
		return res.status(400).toJSON(e);
	})
});

app.delete('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {
		id: todoId
	});

	if (matchedTodo) {
		todos = _.without(todos, matchedTodo);
		res.json(matchedTodo);
	} else {
		res.status(404).json({
			"error": "No todo found with that id!"
		});
	}

});

app.put('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {
		id: todoId
	});
	var body = _.pick(req.body, "description", "completed");
	var validTodo = {};

	if (!matchedTodo) {
		return res.status(404).json({
			"error": "No todo found with that id!"
		});
	}

	if (body.hasOwnProperty("completed") && _.isBoolean(body.completed)) {
		validTodo.completed = body.completed;
	} else if (body.hasOwnProperty("completed")) {
		return res.status(400).send();
	}

	if (body.hasOwnProperty("description") && _.isString(body.description) && body.description.trim().length > 0) {
		validTodo.description = body.description;
	} else if (body.hasOwnProperty("description")) {
		return res.status(400).send();
	}

	_.extend(matchedTodo, validTodo);

	res.json(matchedTodo);

});

db.sequelize.sync().then(function() {
	app.listen(PORT, function() {
		console.log("Server Listen to Port: " + PORT);
	});
});
