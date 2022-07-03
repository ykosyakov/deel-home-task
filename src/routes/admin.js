
const { oneOf, query } = require('express-validator');
const { getProfile } = require('../middleware/getProfile');
const { validate } = require('../middleware/validate');

function setupAdminRoutes(app) {
	const sequelize = app.get('sequelize');

	app.get('/admin/best-profession', getProfile, query('start').isISO8601().toDate(), oneOf([query('limit').isNumeric(), query('limit').not().exists()]), validate, async (req, res) => {
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
	});

	app.get('/admin/best-clients', getProfile, query('start').isISO8601().toDate(), oneOf([query('limit').isNumeric(), query('limit').not().exists()]), validate, async (req, res) => {
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
	});

}

module.exports = setupAdminRoutes;