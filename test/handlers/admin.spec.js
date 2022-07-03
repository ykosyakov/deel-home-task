const request = require('supertest');
const app = require('../../src/app');



describe("Admin routes", () => {

	describe("/admin/best-profession", () => {
		it("should return the best profession as string", async () => {
			const res = await request(app).get('/admin/best-profession').query({ start: '2020-07-15T19:11:26.737Z', end: '2020-09-15T19:11:26.737Z' }).set('profile_id', 1);
			expect(res.status).toBe(200);
			expect(typeof res.body).toBe('string');
		});

		it("should return 400 after validation for dates", async () => {
			const res = await request(app).get('/admin/best-profession').set('profile_id', 1);
			expect(res.status).toBe(400);
			expect(res.body.errors).toBeDefined();
		});
	}
	);

	describe("/admin/best-clients", () => {
		it("should return array of best clients with default limit 2", async () => {
			const res = await request(app).get('/admin/best-clients').query({ start: '2020-07-15T19:11:26.737Z', end: '2020-09-15T19:11:26.737Z' }).set('profile_id', 1);
			expect(res.status).toBe(200);
			expect(Array.isArray(res.body)).toBeTruthy();
			expect(res.body.length).toBe(2);
		});

		it("should return array of best clients with given limit", async () => {
			const res = await request(app).get('/admin/best-clients').query({ start: '2020-07-15T19:11:26.737Z', end: '2020-09-15T19:11:26.737Z', limit: 4 }).set('profile_id', 1);
			expect(res.status).toBe(200);
			expect(Array.isArray(res.body)).toBeTruthy();
			expect(res.body.length).toBe(4);
		});

		it("should return 400 after validation for dates", async () => {
			const res = await request(app).get('/admin/best-clients').set('profile_id', 1);
			expect(res.status).toBe(400);
			expect(res.body.errors).toBeDefined();
		});
	}
	);

});