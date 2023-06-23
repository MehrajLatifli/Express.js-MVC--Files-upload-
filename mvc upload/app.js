var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { create } = require ('express-handlebars');
const { registerHelper } = require ('hbs');


// registerHelper('json', function(context){

//   return JSON.stringify(context);
// })


const hbs=create({
  layoutsDir:path.join(__dirname,"views"),
  defaultLayout:path.join(__dirname,"views","layout.hbs"),
  helpers:{
    json(context){return JSON.stringify(context);},
    filterIndex(index,data){
      const product=data[index]
      return `    <tr>

      <td>${product.name}</td>
      <td>${product.year}</td>

  </tr>`
    },
    blockHelperMissing(context, options){
      return "Helper '"+options.name+"' not found. " 
      + "Printing block: " + options.fn(context); 
    }
  }
})



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.engine('hbs',hbs.engine);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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
  if (err.status === 404) {
    res.render('notfound'); // Render the "notfound.hbs" page
  } else {
    res.render('error'); // Render the "error.hbs" page for other errors
  }
});

module.exports = app;
