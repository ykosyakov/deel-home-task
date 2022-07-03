const { Op } = require('sequelize');


const getUnpaidJobs = async (req, res) => {
	const { Contract, Job } = req.app.get('models');
	const profileId = req.get('profile_id');
	try {
		const activeContracts = await Contract.findAll({
			where: { status: 'in_progress', [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }] },
		});
		const unpaidJobs = await Job.findAll({
			where: {
				ContractId: activeContracts.map((contract) => contract.id),
				[Op.or]: [{ paid: false }, { paid: null }]
			},
		});

		return res.status(200).json(unpaidJobs);
	} catch (e) {
		return res.status(500).end();
	}
};

module.exports = { getUnpaidJobs };