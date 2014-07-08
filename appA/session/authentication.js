//----------------------------------------------------------- declarations and import

var crypto = require('crypto'),
    passport = require('passport'),
    cookieParser = require('cookie-parser'),
    expressSession = require('express-session'),
    localStrategy = require('passport-local').Strategy,
    flash = require('connect-flash');
    

var Users = require('../model.js');

//----------------------------------------------------------- utils

function hashPassword(password, salt) {
    var hash = crypto.createHash('sha256');
    hash.update(password);
    hash.update(salt);
    return hash.digest('hex');
}

//----------------------------------------------------------- the local strategy

var localStrategy = new localStrategy( function(username, password, done) {
    console.log('authentication.js > init local strategy.');
    Users.findUserByUsername(username, function(user) {
        var hash = hashPassword(password, user.salt);
        if (!user) {
            console.log('authentication.js > Incorrect username!');
            done(null, false, { message: 'Incorrect username.' });
        } else if (user.password != hash) {
            console.log('authentication.js > Incorrect password!');
            done(null, false, { message: 'Incorrect password.' });
        } else {
            console.log('authentication.js > done!');
            done(null, user);
        }
    });
});

//----------------------------------------------------------- user serialization

function serializeUser(user, done) {
    done(null, user.id);
};

function deserializeUser(id, done) {
    console.log('authentication.js > deserializeUser > id:'+id);
    Users.findUserById(id, function(user) {
        if (user) {
          done(null, user);
      } else {
          done(null, false);
      }        
  });
};

//----------------------------------------------------------- login logout

function login(req, res, next) {
    return passport.authenticate('local', function(err, user) {
      if (err) {
        return next(err);
        }
        if (!user) {
            return res.send(401, {message: 'Bad username or password'});
        }

        req.logIn(user, function(err) {
            if (err) {
                return next(err);
            }
            res.json(200, user);
        });

    })(req, res, next);
};

function logout(req, res) {
    req.logout();
    return res.send(200);
};

//----------------------------------------------------------- API protection

function ensureAuthenticated(req, res, next) {
    console.log('authentication.js > Calling: ensureAuthenticated.....');
    if (req.isAuthenticated()) {
        console.log('authentication.js > ensureAuthenticated logged.');
        return next();
    } else {
        console.log('authentication.js > ensureAuthenticated invalid credentials.');
        return res.send(401);
    }
};

function ensureAdmin(req, res, next) {
    console.log('authentication.js > Calling: ensureAdmin.....');
    if (req.user && req.user.role == 'ADMIN') {
      return next();
    } else {
      return res.send(401);
    }
};

//----------------------------------------------------------- init passport thing

function init(app, passport) {
    app.use(cookieParser()); // read cookies (needed for auth)
    app.use(expressSession({secret: 'secretterces'}));
    app.use(passport.initialize());
    app.use(passport.session({ secret: 'secretterces' })); // session secret
    app.use(flash()); // use connect-flash for flash messages stored in session
    passport.use(localStrategy);
    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);
}

module.exports = function(app, passport) {
    init(app, passport);

    var authentication = {
        ensureAuthenticated: ensureAuthenticated,
        ensureAdmin: ensureAdmin,
        login: login,
        logout: logout
    }

    require('./session.js')(app, authentication);
    require('./views.js')(app);
};