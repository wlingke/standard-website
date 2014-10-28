var express = require('express');

module.exports = function(app){
    if(app.get('env') === 'production'){
        app.use('/static', express.static('production/static') )
    }else {
        app.use('/static', express.static('static'));
    }


    app.use('/static/*', function (req, res) {
        res.status(404).send('Static file not found');
        res.end();
    });
};