// express application
var express = require('express'),
    bodyParser = require('body-parser'),
    http = require('http'),
    app = express(),
    port = process.env.PORT || 5000;

// init express things and
// init ejs render engine
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(bodyParser()); // get information from html forms

var passport = require('passport');

//----------------------------------------------------------- public API

require('./public/public.js')(app);

//----------------------------------------------------------- passport and basic auth

require('./basicauth/basicauth.js')(app, passport);

//----------------------------------------------------------- passport and sessions

var authentication = require('./session/authentication.js')(app, passport);

//----------------------------------------------------------- list all API
var routes = app._router.stack;
var Table = require('cli-table');
var table = new Table({ head: ["Type", "Name"] });
for (var key in routes) {
    if (routes.hasOwnProperty(key)) {
        var val = routes[key];
        if(val.route) {
            var _o = [val.route.stack[0].method, val.route.path];
            table.push(_o);
        }
    }
}
console.log(table.toString());
console.log('');

//----------------------------------------------------------- start
var server = app.listen(port, function() {
    console.log('Listening on port %d', server.address().port);
});





