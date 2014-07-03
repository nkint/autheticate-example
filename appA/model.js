var dblite = require('dblite'),
    db = dblite('./db/users.db');

var rowType = {
    id: Number,
    username: String,
    password: String,
    salt: String,
    role: String
};

module.exports = {
    findUserByUsername: function (username, callback) {
        var query = 'SELECT * FROM Users WHERE username = "'+username+'";';
        db.query(query, rowType, function(err, rows) {
            if(err) {
                console.log('... db error ...');
                callback(false);
            } else {
                console.log('model > findUserByUsername: '+rows[0]);
                callback(rows[0]);
            }
        });
    },
    findUserById: function (id, callback) {
        var query = 'SELECT * FROM Users WHERE id = "'+id+'";';
        db.query(query, rowType, function(err, rows) {
            console.log(rows);
            if(err) {
                console.log('... db error ...');
                callback(false);
            } else {
                console.log('model > findUserById: '+rows[0]);
                callback(rows[0]);
            }
        });
    }
    
}
