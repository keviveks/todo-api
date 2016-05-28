var bcrypt = require('bcrypt');
var _ = require('underscore');

module.exports = function(sequelize, DataType) {
	var user = sequelize.define('user', {
		'email': {
			type: DataType.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true
			}
		},
		'salt': {
			type: DataType.STRING
		},
		'password_hash': {
			type: DataType.STRING
		},
		'password': {
			type: DataType.VIRTUAL,
			allowNull: false,
			validate: {
				len: [7, 16]
			},
			set: function(value) {
				var salt = bcrypt.genSaltSync(10);
				var hashedPwd = bcrypt.hashSync(value, salt);

				this.setDataValue('password', value);
				this.setDataValue('salt', salt);
				this.setDataValue('password_hash', hashedPwd);
			}
		}
	},{
		hooks: {
			beforeValidate: function(user, options) {
				if(typeof user.email === 'string') {
					user.email = user.email.toLowerCase();
				}
			}
		},
		instanceMethods: {
			toPublicJSON: function() {
				var json = this.toJSON();

				return _.pick(json, "id", "email", "createdAt", "updatedAt");
			}
		},
		classMethods: {
			authenticate: function(body) {
				return new Promise(function(resolve, reject) {
					if(! _.isString(body.email) || !_.isString(body.password)) {
						return reject();
					}

					user.findOne({
						where: {
							email: body.email
						}
					}).then(function(user) {
						if(!user || !bcrypt.compareSync(body.password, user.get('password_hash'))) {
							return reject();
						}

						resolve(user); // pass the user object back
					}, function(e) {
						reject();
					});
				});
			}
		}
	});

	return user;
}