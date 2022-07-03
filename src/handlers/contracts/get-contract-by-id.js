const { Op } = require('sequelize');

const getContractById = async (req, res) => {
	const { Contract } = req.app.get('models');
	const { id } = req.params;
	const profileId = req.get('profile_id');
	try {
		const contract = await Contract.findOne({ where: { id, [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }] } });
		if (!contract) {
			return res.status(404).end();
		}

		return res.status(200).json(contract);
	} catch (e) {
		return res.status(500).end();
	}
};

module.exports = { getContractById };