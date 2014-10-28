'use strict';
var _ = require('lodash');
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var app = express();


//Standard configurations and middleware
app.engine('html', require('ejs').renderFile);
app.set('port', 8000);
//
if (app.get('env') !== 'production') {
    app.set('views', 'views');
} else {
    app.set('views', 'production/views');
}
app.set('view engine', 'html');
app.use(bodyParser.urlencoded());

//Delivers static content depending on environment
require('routers/static_router')(app);

// Logging
if (app.get('env') !== 'production') {
    app.use(morgan('dev'));
}

app.use('/api/*', function (req, res, next) {
    res.send(404);
});


//Renders SPA entry point
app.get('/*', function (req, res, next) {
    res.render('index');
});

//Error handler
app.use(function (err, req, res, next) {
    console.log(err);
    console.log(err.stack);
    res.send(500, err);
});

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port') + ' in ' + app.get('env') + ' mode.');
});