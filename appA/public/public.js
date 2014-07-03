// public API accessible to anyone

module.exports = function(app) {
    
    app.get('/', function(req, res){
        res.send('Hello');
    });
    
    app.get('/public/test', function (req, res) {
        res.json({"color":"rgb(175,31,36)"});
    });
}