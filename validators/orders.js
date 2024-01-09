const { body, param } = require('express-validator');
const validateAndProceed = require('./validateAndProceed');
const getSqlQueryResult = require('../utils/getSqlQueryResult');
