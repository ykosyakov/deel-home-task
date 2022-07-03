const { param, body } = require('express-validator');
const { depositByUser } = require('../handlers/balances/deposit-by-user');
const { getProfile } = require('../middleware/getProfile');
const { validate } = require('../middleware/validate');

function setupBalancesRoutes(app) {
	app.post('/balances/deposit/:userId', getProfile, param('userId').isNumeric(), body('amount').isFloat({ min: 0 }), validate, depositByUser);
}

module.exports = setupBalancesRoutes;