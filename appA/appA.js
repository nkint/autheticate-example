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

require('./public/public.js')(app);

//----------------------------------------------------------- passport and sessions

// init passport for session
var passport = require('passport'),
    authentication = require('./session/authentication.js');
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

//----------------------------------------------------------- passport and basic auth

var Users = require('./model.js');
var BasicStrategy   = require('passport-http').BasicStrategy;
passport.use(new BasicStrategy(
  function(username, password, done) {
    Users.findUserByUsername(username, function (user) {
      if (!user) { return done(null, false); }
      if (!user.password == password) { return done(null, false); }
      console.log('ok..');
      return done(null, user);
    });
  }
));

app.get('/basicauth/me', 
    passport.authenticate('basic', { session: false }),
    function(req, res) {
        res.json(req.user);
    }
);

// start
var server = app.listen(port, function() {
    console.log('Listening on port %d', server.address().port);
});