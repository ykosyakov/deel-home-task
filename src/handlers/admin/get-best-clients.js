

const getBestClients = async (req, res) => {
	const sequelize = req.app.get('sequelize');
	const { start, end, limit = 2 } = req.query;

	const bestClientsQuery = `
		select
			p.id,
			firstName || ' ' || lastName fullName,
			sum(paidInfo.total_amount) paid
		from "Profiles" p join "Contracts" c on c.ClientId = p.id
		join (select ContractId, sum(price) total_amount
				from "Jobs"
				where paid = true and paymentDate between :startDate and :endDate
				group by  ContractId 
				) paidInfo on
			paidInfo.ContractId = c.id
		group by
			p.id
		order by
			sum(paidInfo.total_amount) desc
		limit ${limit}`;

	const resultRaw = await sequelize.query(bestClientsQuery, {
		replacements: { startDate: start, endDate: end },
		type: 'SELECT',
	});

	return res.json(resultRaw);
};

module.exports = { getBestClients };