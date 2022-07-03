const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./model');
const setupContractRoutes = require('./routes/contracts');
const setupJobsRoutes = require('./routes/jobs');

const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize);
app.set('models', sequelize.models);

setupContractRoutes(app);
setupJobsRoutes(app);

module.exports = app;
