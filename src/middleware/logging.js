const logger = require('../utils/logger');

const logging = (req, res, next) => {

	logger.info(`${req.method} ${req.originalUrl}`);

	return next();
};

module.exports = logging;