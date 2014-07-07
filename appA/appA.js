// express application
var express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    expressSession = require('express-session'),
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

require('./basicauth/basicauth.js')(app, passport, authentication);

//----------------------------------------------------------- passport and sessions

// init passport for session

var authentication = require('./session/authentication.js');
    flash    = require('connect-flash');

app.use(cookieParser()); // read cookies (needed for auth)
app.use(expressSession({secret: 'secretterces'}));
app.use(passport.initialize());
app.use(passport.session({ secret: 'secretterces' })); // session secret
app.use(flash()); // use connect-flash for flash messages stored in session
passport.use(authentication.localStrategy);
passport.serializeUser(authentication.serializeUser);
passport.deserializeUser(authentication.deserializeUser);

require('./session/views.js')(app, authentication);
require('./session/session.js')(app, authentication);

//----------------------------------------------------------- list all API
var routes = app._router.stack;
var Table = require('cli-table');
var table = new Table({ head: ["Name"] });
for (var key in routes) {
    if (routes.hasOwnProperty(key)) {
        var val = routes[key];
        if(val.route) {
            var _o = [val.route.path];
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





