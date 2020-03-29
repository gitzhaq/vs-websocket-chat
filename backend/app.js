var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const env = require('node-env-file');
const mongoose = require('mongoose');

var userRouter = require('./routes/user');

var app = express();

// start websocket server
require('./websocket-server');

// set environment variables
env(__dirname + '/.env');

const mongoDbDatabase = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@${process.env.MONGODB_HOST}/${process.env.MONGODB_DB}?retryWrites=true&w=majority`;

// connect to database
mongoose.connect(mongoDbDatabase, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).catch((err) => console.error('Error when connecting to database.'));

mongoose.Promise = Promise;

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/user', userRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).json({error: err});
});

module.exports = app;
