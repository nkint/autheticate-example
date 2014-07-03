// express application
var express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    expressSession = require('express-session'),
    http = require('http'),
    request = require('request'),
    app = express(),
    port = process.env.PORT || 3000;

var http = require('http');

// init express things
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms
app.use(expressSession({secret: 'secretterces'}));

app.get('/api/test', function (req, res) {
    // forward the request
    request(
    { 
        method: 'GET',
        uri: 'http://localhost:5000/api/test'
    },
    function (error, response, body) {
        console.log('/api/test called appA with status code '+response.statusCode+' response is: '+body);
        res.send(JSON.parse(body));
    });
});

app.get('/api/login', function (req, res) {

    request.post(
    { 
        uri: 'http://localhost:5000/login',
        form: { 
            username: 'admin', 
            password: 'pass' 
        }
    },
    
    function (error, response, body) {
        if(error) {
            console.log(error);
            return;
        }
        console.log('/api/login called appA with status code '+response.statusCode+' response is: '+body);
        res.send(JSON.parse(body));
    });
});

app.get('/api/users', function (req, res) {
    // forward the request
    request(
    { 
        method: 'GET',
        uri: 'http://localhost:5000/api/users'
    },
    function (error, response, body) {
        if(response.statusCode==401) {
            console.log('/api/users > received Unauthorized');
            res.send('Unauthorized');
            return;
        }
        console.log('/api/users called appA with status code '+response.statusCode+' response is: '+body);
        res.send(JSON.parse(body));
    });

});

// start
var server = app.listen(port, function() {
    console.log('Listening on port %d', server.address().port);
});