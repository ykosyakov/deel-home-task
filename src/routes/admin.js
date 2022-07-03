const { oneOf, query } = require('express-validator');
const { getBestClients } = require('../handlers/admin/get-best-clients');
const { getBestProfession } = require('../handlers/admin/get-best-profession');
const { getProfile } = require('../middleware/getProfile');
const { validate } = require('../middleware/validate');

function setupAdminRoutes(app) {
	app.get('/admin/best-profession', getProfile, query('start').isISO8601().toDate(), oneOf([query('limit').isNumeric(), query('limit').not().exists()]), validate, getBestProfession);
	app.get('/admin/best-clients', getProfile, query('start').isISO8601().toDate(), oneOf([query('limit').isNumeric(), query('limit').not().exists()]), validate, getBestClients);
}

module.exports = setupAdminRoutes;