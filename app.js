var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var favicon = require('serve-favicon');
var bodyparser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var localSrategy = require('passport-local');
var multer = require('multer');
var uploads = multer({dest: './uploads'});
var flash = require('connect-flash');
var bcrypt  = require('bcryptjs');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var expressValidator = require("express-Validator");



var db = mongoose.connection;








var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
	secret: 'secret',
	saveauninitialized: true,
	resave: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(expressValidator({
	errorFormatter: function(param, msg, value){
	var namespace = param.split('.')
	, root = namespace.shift()
	, formparam = root;

	while(namespace.length){
		formparam += '['+ namespace.shift()
	}  
	return {
		param : formparam,
		msg : msg,
		value : value
	};
}
}));

app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
  res.status(err.status || 500);
  res.render('error');
});

//app.listen(8080,'192.168.137.1');

module.exports = app;
