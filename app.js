var express = require('express');
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
var session = require('express-session');


var postsRouter = require('./routes/postsRoutes');
var imageRouter = require('./routes/imageRoutes');
var loginRouter = require('./routes/loginRoutes');

var app = express();

// Used to determine what the root of the directory is
global.appRoot = path.resolve(__dirname);

// Add a list of allowed origins.
// If you have more origins you would like to add, you can add them to the array below.
const corsOption = {
  origin: 'http://localhost:8000',
  optionsSuccessStatus: 200,
  credentials: true
};

// Server setup
app.use(cors(corsOption));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret: "fb!ywefjh3v908#"}));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api', postsRouter);
app.use('/api', imageRouter);
app.use('/api', loginRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(500).send( "There was an error: " + err)
});

module.exports = app;
