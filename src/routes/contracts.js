
const { Op } = require('sequelize');
const { getProfile } = require('../middleware/getProfile');

function setupContractRoutes(app) {
	const { Contract } = app.get('models');

	app.get('/contracts/:id', getProfile, async (req, res) => {
		const { id } = req.params;
		const profileId = req.get('profile_id');
		const contract = await Contract.findOne({ where: { id, [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }] } });
		if (!contract) {
			return res.status(404).end();
		}

		return res.status(200).json(contract);
	});

	app.get('/contracts', getProfile, async (req, res) => {
		try {
			const profileId = req.get('profile_id');
			const contracts = await Contract.findAll({ where: { [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }] } });

			return res.status(200).json(contracts);
		} catch (e) {
			return res.status(500).end();
		}
	});
};


module.exports = setupContractRoutes;