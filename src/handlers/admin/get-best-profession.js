
const getBestProfession = async (req, res) => {
	const sequelize = req.app.get('sequelize');
	const { start, end } = req.query;
	const bestProfessionQuery = `
		select profession
		from "Profiles"
		where id in (select ContractorId 
					from "Contracts"
					where id in (
						select ContractId
						from (select ContractId, total_amount, row_number() over (order by total_amount desc) rn
							from (select ContractId, sum(price) total_amount
									from "Jobs"
									where paid = true and paymentDate between :startDate and :endDate
									group by ContractId ))
							where rn = 1))
	`;

	try {
		const resultRaw = await sequelize.query(bestProfessionQuery, {
			replacements: { startDate: start, endDate: end },
			type: 'SELECT',
		});

		return res.json(resultRaw[0].profession);
	} catch (e) {
		return res.status(500).end();
	}
};

module.exports = { getBestProfession };