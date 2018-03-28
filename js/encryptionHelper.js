var bcrypt = require('bcrypt');

module.exports = {
    encrypt: function(password, saltRounds, callback){
      bcrypt.hash(password, saltRounds, function(err, hash) {
        callback(hash);
      });
    },
    compare: function(password, hash, callback){
      bcrypt.compare(password, hash, function(err, res) {
        callback(res);
      });
    }
}
