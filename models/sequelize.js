const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const config = require('../config')

const basename = path.basename(__filename);
const db = {};


const sequelize = new Sequelize(config.database, config.user, config.password, {
	host: config.host,
	pool: {
		max: 2,
		min: 1,
		acquire: 30000,
		idle: 10000,
	},
	dialect: 'mysql',
	define: {
		timestamps: false,
	},
});

sequelize.authenticate().then(() => {
	console.log('MySQL connected!');
}).catch((err) => {
	throw err;
});

fs
	.readdirSync(__dirname)
	.filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
	.forEach(file => {
		const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
		db[model.name] = model;
	});

Object.keys(db).forEach(modelName => {
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
global.db = db;