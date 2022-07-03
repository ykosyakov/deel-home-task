const { getUnpaidJobs } = require('../handlers/jobs/get-unpaid-jobs');
const { payJobById } = require('../handlers/jobs/pay-job-by-id');
const { getProfile } = require('../middleware/getProfile');

function setupJobsRoutes(app) {
	app.get('/jobs/unpaid', getProfile, getUnpaidJobs);
	app.post('/jobs/:id/pay', getProfile, payJobById);
}

module.exports = setupJobsRoutes;