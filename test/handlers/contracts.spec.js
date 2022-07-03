const request = require('supertest');
const app = require('../../src/app');



describe("Contracts routes", () => {

	describe("/contracts/:id", () => {
		it("should return a contract", async () => {
			const res = await request(app).get('/contracts/1').set('profile_id', 1);
			expect(res.status).toBe(200);
			expect(res.body.id).toBe(1);
		});

		it("should return 404 for unknown contract", async () => {
			const res = await request(app).get('/contracts/1000').set('profile_id', 1);
			expect(res.status).toBe(404);
		});
	}
	);

});