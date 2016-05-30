var Sequelize = require('sequelize');

var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/basic-sqlite-database.sqlite'
});

var Todo = sequelize.define('todo', {
	'description': {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			len: [1, 250]
		}
	},
	'completed': {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
});

var User = sequelize.define('user', {
	'email': Sequelize.STRING
});

Todo.belongsTo(User);
User.hasMany(Todo);

sequelize.sync({
	// force:true
}).then(function() {
	console.log("Everything got synced!");

	User.findById(1).then(function(user) {
		user.getTodos({
			where: {
				completed: false
			}
		}).then(function(todos) {
			todos.forEach(function(todo) {
				console.log(todo.toJSON());
			});
		});
	});

	// User.create({
	// 	email: 'vivek@gmail.com'
	// }).then(function() {
	// 	return Todo.create({
	// 		description: 'Clean Laptop'
	// 	});
	// }).then(function(todo) {
	// 	User.findById(1).then(function(user) {
	// 		user.addTodo(todo);
	// 	});
	// });
	// Todo.findById(2).then(function(todo) {
	// 	if(todo) {
	// 		console.log(todo.toJSON());
	// 	} else {
	// 		console.log("todo not found!");
	// 	}
	// }).catch(function(e) {
	// 	console.log(e);
	// });


	// Todo.create({
	// 	description: 'get the phone ready'
	// }).then(function() {
	// 	return Todo.create({
	// 		description: 'plan for iphone'
	// 	});
	// }).then(function() {
	// 	// return Todo.findById(1);
	// 	return Todo.findAll({
	// 		where: {
	// 			description: {
	// 				$like: "%plan%"
	// 			}
	// 		}
	// 	})
	// }).then(function(todos) {
	// 	if(todos) {
	// 		console.log('New todo created!');
	// 		todos.forEach(function(todo) {
	// 			console.log(todo.toJSON());
	// 		});
	// 	} else {
	// 		console.log("no todo found!");
	// 	}
	// }).catch(function(e) {
	// 	console.log(e);
	// });
});
