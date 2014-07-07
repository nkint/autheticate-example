function init(app, passport) {

    var Users = require('../model.js');
    var BasicStrategy   = require('passport-http').BasicStrategy;

    passport.use(new BasicStrategy(
        function(username, password, done) {
            Users.findUserByUsername(username, function (user) {
                if (!user) { return done(null, false); }
                if (!(user.password == password)) { 
                    console.log('basicauth.js > BasicStrategy: wrong password');
                    return done(null, false); 
                }
                console.log('basicauth.js > BasicStrategy: password authentication OK');
                return done(null, user);
            });
        }
    ));
    app.use(passport.initialize());
}

module.exports = function(app, passport) {
    init(app, passport);

    app.get('/basicauth/test', 
        passport.authenticate('basic', { session: false }),
        function(req, res) {
            res.json(req.user);
        }
    );
}