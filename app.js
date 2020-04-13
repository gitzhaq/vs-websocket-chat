var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const fs = require('fs');

const env = require('node-env-file');
const mongoose = require('mongoose');

var userRouter = require('./routes/user');

var app = express();

// set environment variables from .env if it exists
const envFile = __dirname + '/.env';
if (fs.existsSync(envFile)) {
  env(envFile);
}

// connect to database
const mongoDbDatabase = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@${process.env.MONGODB_HOST}/${process.env.MONGODB_DB}?retryWrites=true&w=majority`;
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

// serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

app.use('/user', userRouter);

// the "catchall" handler: for any request that doesn't match one of the defined routes, send back React's
// index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

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
