var crypto = require('crypto');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;

var Users = require('./model.js');

function hashPassword(password, salt) {
    var hash = crypto.createHash('sha256');
    hash.update(password);
    hash.update(salt);
    return hash.digest('hex');
}

module.exports = {
    localStrategy: new localStrategy(
        function(username, password, done) {
            console.log('localStrategy > function.');

            Users.findUserByUsername(username, function(user) {

                var hash = hashPassword(password, user.salt);

                console.log('hash: '+hash);

                if (!user) {
                    console.log('Incorrect username!');
                    done(null, false, { message: 'Incorrect username.' });
                } else if (user.password != hash) {
                    console.log('Incorrect password!');
                    done(null, false, { message: 'Incorrect password.' });
                } else {
                    console.log('done!');
                    done(null, user);
                }
            });
        }),

  serializeUser: function(user, done) {
    done(null, user.id);
  },

  deserializeUser: function(id, done) {
    console.log('deserializeUser > id:'+id);
    Users.findUserById(id, function(user) {
        if (user) {
          done(null, user);
        } else {
          done(null, false);
        }        
    });
  },

  login: function(req, res, next) {
    console.log('authentication: login');
    console.log(req.body);
    return passport.authenticate('local', function(err, user) {
      console.log('dudee > user: '+user);
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.send(400, {message: 'Bad username or password'});
      }

      req.logIn(user, function(err) {
        if (err) {
          return next(err);
        }

        res.json(200, user);
      });
    })(req, res, next);
  },

  logout: function(req, res) {
    req.logout();
    return res.send(200);
  },

  // NOTE: Need to protect all API calls (other than login/logout) with this check
  ensureAuthenticated: function(req, res, next) {
    console.log('Calling: ensureAuthenticated.....');
    if (req.isAuthenticated()) {
        console.log('ensureAuthenticated logged.');
      return next();
    } else {
        console.log('ensureAuthenticated invalid credentials.');
      return res.send(401);
    }
  },

  ensureAdmin: function(req, res, next) {
      // ensure authenticated user exists with admin role, otherwise send 401 response status
      console.log('Calling: ensureAdmin.....');
      if (req.user && req.user.role == 'ADMIN') {
          return next();
      } else {
          return res.send(401);
      }
  },



};