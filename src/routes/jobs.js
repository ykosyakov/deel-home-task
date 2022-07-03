const { Op } = require('sequelize');
const { getProfile } = require('../middleware/getProfile');

function setupJobsRoutes(app) {
	const { Contract, Job, Profile } = app.get('models');

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
	app.post('/jobs/:id/pay', getProfile, async (req, res) => {
		const sequelize = req.app.get('sequelize');
		const profileId = req.get('profile_id');
		const { id: jobId } = req.params;

		try {
			await sequelize.transaction(async (transaction) => {
				const job = await Job.findOne({ where: { id: jobId } }, { lock: true, transaction });

				if (job.paid) {
					throw new Error("Job has been already paid");
				}

				const client = await Profile.findOne({ where: { id: profileId } }, { transaction, lock: true });

				const contract = await Contract.findOne({
					where: { id: job.ContractId },
				}, { transaction });

				const contractor = await Profile.findOne({ where: { id: contract.ContractorId } }, { transaction, lock: true });

				if (client.balance <= job.price) {
					throw new Error("Insufficient deposit");
				}

				job.paid = true;
				job.paymentDate = new Date();
				contractor.balance += job.price;
				client.balance -= job.price;

				await client.save({ transaction });
				await contractor.save({ transaction });
				await job.save({ transaction });

				return true;

			});

		}
		catch (e) {
			return res.status(500).json(e.message);
		}
		return res.status(200).end();
	});
}

module.exports = setupJobsRoutes;