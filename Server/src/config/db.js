const { Client } = require('pg');
const {
	database_username,
	database_password,
	database_host,
	database_name,
	database_port,
} = require('../../environment');

const client = new Client({
	user: database_username,
	host: database_host,
	database: database_name,
	password: database_password,
	port: database_port,
});

client.connect((err) => {
	if (err) {
		let message = 'Database connection error';
		throw new Error((message = err));
	}
	console.log(`Database successfully connected with db ${database_name}`);
});

module.exports = client;
