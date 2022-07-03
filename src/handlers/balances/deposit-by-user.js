

const depositByUser = async (req, res) => {

	const { Profile } = req.app.get('models');
	const sequelize = req.app.get('sequelize');

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
};

module.exports = { depositByUser };