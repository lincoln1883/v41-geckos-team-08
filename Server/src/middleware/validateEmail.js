const validateEmail = (req, res, next) => {
	const { email } = req.body;

	if (!email) {
		next();
		return;
	}

	const mailformat =
		/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

	if (!email.match(mailformat)) {
		return res
			.status(401)
			.json('You have entered an Invalid email address!');
	}

	next();
};

module.exports = validateEmail;
