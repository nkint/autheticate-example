module.exports = function(app, authentication) {

    app.get('/', function(req, res) {
        res.send('Hello');
    });

    app.post('/login', authentication.login);

    app.get('/logout', authentication.logout);

    //-------------------------------------------- authentication restriction test

    // anybody can access this
    app.get('/api/test', function (req, res) {
        res.json({"dudee":"23"});
    });

    // only logged-in users with ADMIN role can access this 
    app.get('/api/admin',       
        authentication.ensureAuthenticated,
        authentication.ensureAdmin,
        function (req, res) {
            res.json({"love":"93!"});
        }
    );

    // only logged-in users can access this
    app.get('/api/users',
        authentication.ensureAuthenticated, 
        function (req, res) {
            res.json({"dudee":"2+3=5"});
        }
    );

}