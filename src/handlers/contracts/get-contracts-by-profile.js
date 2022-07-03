const { Op } = require('sequelize');

const getContractsByProfile = async (req, res) => {
	const { Contract } = req.app.get('models');
	try {
		const profileId = req.get('profile_id');
		const contracts = await Contract.findAll({ where: { [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }] } });

		return res.status(200).json(contracts);
	} catch (e) {
		return res.status(500).end();
	}
};

module.exports = { getContractsByProfile };