const request = require('supertest');
const app = require('../../src/app');

describe("Jobs routes", () => {

	describe("/jobs/unpaid/", () => {
		it('should return an array of unpaid jobs', async () => {
			const res = await request(app).get('/jobs/unpaid').set('profile_id', 1);
			expect(res.status).toBe(200);
			expect(Array.isArray(res.body)).toBeTruthy();
		});
	}
	);

	describe("/jobs/:id/pay", () => {
		it('should return "Job has been already paid" for paid job', async () => {
			const res = await request(app).post('/jobs/7/pay').set('profile_id', 1);
			expect(res.status).toBe(500);
			expect(res.body).toBe('Job has been already paid');
		});

		it('should return "Insufficient deposit" for clients with low balance', async () => {
			const res = await request(app).post('/jobs/5/pay').set('profile_id', 4);
			expect(res.status).toBe(500);
			expect(res.body).toBe('Job has been already paid');
		});
	});

});