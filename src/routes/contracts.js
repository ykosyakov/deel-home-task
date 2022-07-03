const { getContractById } = require('../handlers/contracts/get-contract-by-id');
const { getContractsByProfile } = require('../handlers/contracts/get-contracts-by-profile');
const { getProfile } = require('../middleware/getProfile');

function setupContractRoutes(app) {
	app.get('/contracts/:id', getProfile, getContractById);
	app.get('/contracts', getProfile, getContractsByProfile);
};

module.exports = setupContractRoutes;