module.exports = function(app, authentication) {

    //-------------------------------------------------------------- login

    app.post('/session/login', authentication.login);

    app.get('/session/logout', authentication.logout);

    //-------------------------------------------------------------- restricted API    

    // only logged-in users with ADMIN role can access this 
    app.get('/session/admin',       
        authentication.ensureAuthenticated,
        authentication.ensureAdmin,
        function (req, res) {
            res.json({"color":"rgb(0, 106, 173)"});
        }
    );

    // only logged-in users can access this
    app.get('/session/users',
        authentication.ensureAuthenticated, 
        function (req, res) {
            res.json({"color":"rgb(242,192,112)"});
        }
    );

}