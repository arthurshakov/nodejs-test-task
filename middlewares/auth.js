const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../constants');

function auth(req, res, next) {
	const token = req.cookies.token;

	try {
		const verifiedResult = jwt.verify(token, JWT_SECRET);

		req.user = {
			email: verifiedResult.email,
		}

		next();
	} catch(error) {	
		console.log(error);
		res.redirect('/login');
	}
}

module.exports = auth;