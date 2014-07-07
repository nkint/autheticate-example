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

//------------------------------------------------- call appA public api
app.get('/public/test', function (req, res) {
    // forward the request
    request(
    { 
        method: 'GET',
        uri: 'http://localhost:5000/public/test'
    },
    function (error, response, body) {
        console.log('/public/test called appA with status code '+response.statusCode+' response is: '+body);
        res.send(JSON.parse(body));
    });
});

//------------------------------------------------- call appA basic auth api

app.get('/basicauth/test', function (req, res) {
    // forward the request
    request(
    { 
        method: 'GET',
        uri: 'http://localhost:5000/basicauth/test',
        auth: {
            username: 'admin',
            password: '4ddf3f61c0c2d465dd949cc9fdb4899b02d933d4b2ddb0debb5ec42b9f630999'
        }
    },
    function (error, response, body) {
        console.log('/basicauth/test called appA with status code '+response.statusCode+' response is: '+body);
        res.send(JSON.parse(body));
    });
});

//------------------------------------------------- call appA session API

app.get('/session/login', function (req, res) {

    request.post(
    { 
        uri: 'http://localhost:5000/session/login',
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
        console.log('/session/login called appA with status code '+response.statusCode+' response is: '+body);
        res.send(JSON.parse(body));
    });
});

// TODO: does not work
app.get('/session/users', function (req, res) {
    // forward the request
    request(
    { 
        method: 'GET',
        uri: 'http://localhost:5000/session/users'
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