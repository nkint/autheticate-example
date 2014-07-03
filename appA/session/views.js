module.exports = function(app, authentication) {

    app.get('/view', function(req, res){
        res.render('index.ejs',{"title":"Authorization example"})
    });

    app.get('/view/test', function (req, res) {
        res.render('contents.ejs',{"title":"Public page", "api":"/public/test"});
    });

    app.get('/view/login', function (req, res) {
        res.render('login.ejs',{"title":"Login"});
    });

    app.get('/view/users', function (req, res) {
        res.render('contents.ejs',{"title":"User restricted page", "api":"/session/users"});
    });

    app.get('/view/admin', function (req, res) {
        res.render('contents.ejs',{"title":"Admin restricted page", "api":"/session/admin"});
    });

}