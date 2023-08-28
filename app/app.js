const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const AdminJS = require('adminjs');
const AdminJSExpress = require('@adminjs/express');
const AdminJSSequelize = require('@adminjs/sequelize');
const {
  User,
  Course,
  Role,
  School,
  UserCourse,
  Subject,
  Grade,
  AssessmentType,
  Assessment,
  AssessmentCourse,
  Announcement,
  Answer,
  Attendance,
  Classday
} = require('./models');

AdminJS.registerAdapter({
  Resource: AdminJSSequelize.Resource,
  Database: AdminJSSequelize.Database,
});

const app = express();

const adminOptions = {
  resources: [
    User,
    Course,
    School,
    UserCourse,
    Subject,
    Grade,
    AssessmentType,
    Assessment,
    AssessmentCourse,
    Announcement,
    Answer,
    Attendance,
    Classday
  ],
  rootPath: '/admin',
};

const admin = new AdminJS(adminOptions);

const adminRouter = AdminJSExpress.buildRouter(admin);
console.log(admin.options.rootPath);
app.use(admin.options.rootPath, adminRouter);

require('dotenv').config();


const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

// Initialize database
const db = require('./models');

// set CORS
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Set routes
app.use(routes);

// Error handler
app.use(errorHandler);

// catch 404 and forward to error handler
app.use((req, res, next) => next(createError(404)));

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
