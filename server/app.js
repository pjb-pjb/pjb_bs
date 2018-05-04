var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');	
var bodyParser = require('body-parser');

var index = require('./routes/index');
var visitors = require('./routes/visitors/visitors.js');
var goods = require('./routes/goods/goods.js');
var ogoods = require('./routes/goods/ogoods.js');
var worker = require('./routes/worker/worker.js');
var bed = require('./routes/bed/bed.js');
var service = require('./routes/service/service.js');
var food = require('./routes/food/food.js');
var enter = require('./routes/enter/enter.js');
var pg = require('./routes/healthcare/pg.js');
var app = express();
var server=app.listen(8888,function(){
	console.log("http://loaclhost:%s",server.address().port);
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index);
app.use('/api/visitors', visitors);
app.use('/api/goods', goods);
app.use('/api/ogoods', ogoods);
app.use('/api/worker', worker);
app.use('/api/bed', bed);
app.use('/api/service', service);
app.use('/api/food', food);
app.use('/api/enter', enter);
app.use('/api/pg', pg);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

module.exports = app;
