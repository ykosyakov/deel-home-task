const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

const validate = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		logger.warn(`Validation error: ${JSON.stringify(errors.array())}`);
		return res.status(400).json({ errors: errors.array() });
	}
	return next();
};

module.exports = { validate };
