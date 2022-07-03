const { param, body } = require('express-validator');
const { getProfile } = require('../middleware/getProfile');
const { validate } = require('../middleware/validate');

function setupBalancesRoutes(app) {
	const { Profile } = app.get('models');
	const sequelize = app.get('sequelize');

	app.post('/balances/deposit/:userId', getProfile, param('userId').isNumeric(), body('amount').isFloat({ min: 0 }), validate, async (req, res) => {

		const { userId } = req.params;
		const { amount } = req.body;

		try {
			await sequelize.transaction(async (transaction) => {
				const totalJobsAmountRaw = await sequelize.query('select sum(price) totalJobsAmount from "Jobs" where ContractId in (select id from Contracts where ClientId = :userId)',
					{
						replacements: { userId },
						type: 'SELECT'
					});

				const totalJobsAmount = totalJobsAmountRaw[0]?.totalJobsAmount ?? 0;

				if (amount > totalJobsAmount * 0.25) {
					throw new Error(`Deposit amount couldn't be more than ${totalJobsAmount * 0.25}`);
				}

				const client = await Profile.findOne({ where: { id: userId } });

				client.balance += amount;

				await client.save({ transaction });;
			});

		}
		catch (e) {
			return res.status(500).json(e.message);
		}

		return res.status(200).end();
	});



}


module.exports = setupBalancesRoutes;