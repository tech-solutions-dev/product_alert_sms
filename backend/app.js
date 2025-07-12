require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const routes = require('./routes');
const { errorHandler } = require('./middleware/errorHandler');
const path = require("path")

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/backups', express.static(path.join(__dirname, '../backups')));

app.use('/api', routes);

app.use(errorHandler);

module.exports = app;
