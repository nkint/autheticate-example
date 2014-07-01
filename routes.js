module.exports = function(app, authentication) {

    app.get('/', function(req, res){
        res.render('index.ejs',{"title":"Authorization example"})
    });

    //-------------------------------------------------------------- login

    app.post('/login', authentication.login);

    app.get('/logout', authentication.logout);

    //-------------------------------------------------------------- restricted API
    // anybody can access this
    app.get('/api/test', function (req, res) {
        res.json({"color":"rgb(175,31,36)"});
    });

    // only logged-in users with ADMIN role can access this 
    app.get('/api/admin',       
        authentication.ensureAuthenticated,
        authentication.ensureAdmin,
        function (req, res) {
            res.json({"color":"rgb(0, 106, 173)"});
        }
    );

    // only logged-in users can access this
    app.get('/api/users',
        authentication.ensureAuthenticated, 
        function (req, res) {
            res.json({"color":"rgb(242,192,112)"});
        }
    );

    //-------------------------------------------------------------- views

    app.get('/view/test', function (req, res) {
        res.render('contents.ejs',{"title":"Public page", "api":"/api/test"});
    });

    app.get('/view/login', function (req, res) {
        res.render('login.ejs',{"title":"Login"});
    });

    app.get('/view/users', function (req, res) {
        res.render('contents.ejs',{"title":"User restricted page", "api":"/api/users"});
    });

    app.get('/view/admin', function (req, res) {
        res.render('contents.ejs',{"title":"Admin restricted page", "api":"/api/admin"});
    });

}