const { Op } = require('sequelize');
const { getProfile } = require('../middleware/getProfile');

function setupJobsRoutes(app) {
	const { Contract, Job } = app.get('models');

	app.get('/jobs/unpaid', getProfile, async (req, res) => {
		const profileId = req.get('profile_id');
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
	});
}

module.exports = setupJobsRoutes;