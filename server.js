// express application
var express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    expressSession = require('express-session'),
    http = require('http'),
    app = express(),
    port = process.env.PORT || 5000;

var routes = require('./routes.js');

// passport things
var passport = require('passport'),
    authentication = require('./authentication.js');
    flash    = require('connect-flash');

// init ejs render engine
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.engine('html', require('ejs').renderFile);

// init express things
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms
app.use(expressSession({secret: 'secretterces'}));

// init passport
app.use(passport.initialize());
app.use(passport.session({ secret: 'secretterces' })); // session secret
app.use(flash()); // use connect-flash for flash messages stored in session
passport.use(authentication.localStrategy);
passport.serializeUser(authentication.serializeUser);
passport.deserializeUser(authentication.deserializeUser);

// add routes
require('./routes.js')(app, authentication);

// start
var server = app.listen(port, function() {
    console.log('Listening on port %d', server.address().port);
});