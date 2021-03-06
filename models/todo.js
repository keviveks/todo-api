module.exports = function(sequelize, DataType) {
	return sequelize.define('todo', {
		'description': {
			type: DataType.STRING,
			allowNull: false,
			validate: {
				len: [1, 250]
			}
		},
		'completed': {
			type: DataType.BOOLEAN,
			allowNull: false,
			defaultValue: false
		}
	});
};