const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./model');
const setupContractRoutes = require('./contracts/contracts');

const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize);
app.set('models', sequelize.models);

setupContractRoutes(app);

module.exports = app;
