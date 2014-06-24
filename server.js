// express application
var express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    expressSession = require('express-session'),
    app = express(),
    port = process.env.PORT || 5000;

var routes = require('./routes.js');

// passport things
var passport = require('passport'),
    authentication = require('./authentication.js');
    flash    = require('connect-flash');

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs'); // set up ejs for templating

app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms
app.use(expressSession({secret: 'secretterces'}));

app.use(passport.initialize());
app.use(passport.session({ secret: 'secretterces' })); // session secret
app.use(flash()); // use connect-flash for flash messages stored in session

passport.use(authentication.localStrategy);
passport.serializeUser(authentication.serializeUser);
passport.deserializeUser(authentication.deserializeUser);


require('./routes.js')(app, authentication);


var server = app.listen(port, function() {
    console.log('Listening on port %d', server.address().port);
});
