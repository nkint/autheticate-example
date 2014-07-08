// express application
var http = require('http'),
    request = require('request'),
    express = require('express'),
    app = express(),
    port = process.env.PORT || 3000;

var appA = 'http://localhost:5000';

//------------------------------------------------- call appA public api
//------------------------------------------------- call appA public api
//------------------------------------------------- call appA public api

app.get('/public/test', function (req, res) {
    // forward the request
    request(
    { 
        method: 'GET',
        uri: appA+'/public/test'
    },
    function (error, response, body) {
        console.log('/public/test called appA with status code '+response.statusCode+' response is: '+body);
        res.send(JSON.parse(body));
    });
});

//------------------------------------------------- call appA basic auth api
//------------------------------------------------- call appA basic auth api
//------------------------------------------------- call appA basic auth api

app.get('/basicauth/test', function (req, res) {
    // forward the request
    request(
    { 
        method: 'GET',
        uri: appA+'/basicauth/test',
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
//------------------------------------------------- call appA session API
//------------------------------------------------- call appA session API

var j = request.jar() ;
var savedCookie = 

app.get('/session/login', function (req, res) {

    var uri = appA+'/session/login';

    request.post(
    { 
        uri: uri,
        form: { 
            username: 'admin', 
            password: 'pass'
        },
        jar:j
    },
    
    function (error, response, body) {
        if(error) {
            console.log(error);
            return;
        }
        savedCookie = j.getCookies(uri);
        console.log('/session/login called appA with status code '+response.statusCode+' response is: '+body);
        console.log('saved session cookie: ', savedCookie);
        res.send(JSON.parse(body));
    });
});

app.get('/session/users', function (req, res) {

    request(
    { 
        method: 'GET',
        uri: 'http://localhost:5000/session/users',
        jar: j
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

//------------------------------------------------- start
//------------------------------------------------- start
//------------------------------------------------- start

// start
var server = app.listen(port, function() {
    console.log('Listening on port %d', server.address().port);
});