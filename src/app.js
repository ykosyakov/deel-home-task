const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./model');
const setupContractRoutes = require('./routes/contracts');
const setupJobsRoutes = require('./routes/jobs');
const setupAdminRoutes = require('./routes/admin');
const setupBalancesRoutes = require('./routes/balances');
const logging = require('./middleware/logging');

const app = express();
app.use(bodyParser.json());
app.use(logging);
app.set('sequelize', sequelize);
app.set('models', sequelize.models);

setupContractRoutes(app);
setupJobsRoutes(app);
setupAdminRoutes(app);
setupBalancesRoutes(app);

module.exports = app;
