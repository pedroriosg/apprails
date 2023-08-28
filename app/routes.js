const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const index = require('./routes/index');
const auth = require('./routes/auth');
const courses = require('./routes/courses');
const assessments = require('./routes/assessments');
const users = require('./routes/users');
// Swagger Documentation

const router = express.Router();
const swaggerDocument = YAML.load('./docs.yml');
router.use('/swagger', swaggerUi.serve);
router.get('/swagger', swaggerUi.setup(swaggerDocument));

// No autrhorization routes
router.use('/', index);
router.use('/auth', auth);
router.use('/courses', courses);
router.use('/assessments', assessments);
router.use('/announcements', require('./routes/announcements'));
router.use('/classdays', require('./routes/classdays'));
router.use('/users', users);

// Define Authorization route

// Authorization routes

module.exports = router;
