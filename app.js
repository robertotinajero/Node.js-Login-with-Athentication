'use strict'
// == SET UP ===================================================================
var express       = require('express'),          // HTTP server
    session       = require('express-session'),  // Store the session data on the server
    mongoose      = require('mongoose'),
    MongoStore    = require('connect-mongo')(session),
    createError   = require('http-errors'),
    logger        = require('morgan'),           // HTTP request logger
    cookieParser  = require('cookie-parser'),    // Simple cookie-based session middleware
    bodyParser    = require('body-parser'),
    methodOverride = require('method-override'), // Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it.
    path          = require('path'),             // Provides utilities for working with file and directory paths.
    flash         = require('connect-flash'),    // The flash is a special area of the session used for storing messages
    favicon      = require('serve-favicon'),
    dotenv        = require('dotenv').config(),
    app           = express(),                   // Create a web application
    routes        = require('./app/routes/router.js');
var expiryDate    = new Date( Date.now() + 60 * 60 * 1000 ); // 1 hour

var sassMiddleware = require('node-sass-middleware');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


//connect to MongoDB
// mongoose.connect('mongodb://localhost/testForAuth');
// var db = mongoose.connection;

//handle mongo error
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function () {
//   // we're connected!
// });

// view engine setup
app.set('views', path.join(__dirname, 'app/views/pages'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'supersecretkey',
  resave: true,
  saveUninitialized: false,
  // store: new MongoStore({
  //   mongooseConnection: db
  // }),
  cookie: {
    secure: true,
    httpOnly: true,
    expires: expiryDate,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
    //maxAge: 60000
  }
}));
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));

app.use(express.static(path.join(__dirname, 'public')));
// include routes
app.use(routes);

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  // res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
