require('dotenv').config();
const mongoose = require('mongoose');

module.exports = () => {
	let db_url = '';
	if (process.env.NODE_ENV !== 'production') {
		db_url = process.env.DB_URL_LOCAL;
	} else {
		db_url = process.env.DB_URL_PRODUCTION;
	}
	mongoose
		.connect(db_url)
		.then(() => console.log('Connected to database'))
		.catch((err) => {
			throw err;
		});
};
