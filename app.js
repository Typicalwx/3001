var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const client = require("ykt-http-client");
client.url("127.0.0.1:8080");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var servetimeRouter = require("./routes/servetime")
var shopsRouter = require('./routes/shops');
var storegoodsRouter = require('./routes/storegoods');
var storesRouter = require('./routes/stores');
var supplier = require('./routes/supplier');//供应商
var suppliergoods = require('./routes/suppliergoods');//供应商商品

var petownersRouter = require('./routes/petowners');//宠主
var storeAdministratorRouter = require('./routes/storeAdministrator');//门店管理员

var adminsRouter = require('./routes/admins');
var supplierRouter = require('./routes/supplier');
var orderbuyRouter = require("./routes/orderbuy")
var orderbuiedRouter = require("./routes/orderbuied")

const session = require("express-session")

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
  secret: "tang",
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60 }
}))


app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/storegoods', storegoodsRouter);
app.use('/stores', storesRouter);
app.use('/shops', shopsRouter);

app.use('/supplier', supplier); //供应商
app.use('/suppliergoods', suppliergoods);//供应商商品

app.use('/admins', adminsRouter);
app.use('/servetime', servetimeRouter);//服务管理路由
app.use('/orderbuy', orderbuyRouter);//订单

app.use('/petowners', petownersRouter);
app.use('/storeAdministrator', storeAdministratorRouter);


app.use('/orderbuied', orderbuiedRouter);//订单


app.use('/supplier', supplierRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
