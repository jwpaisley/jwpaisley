var config = require('./../config.json');
var fs = require('fs');
var lacewood = require('lacewood');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(config.settings.database.db + '.db');
var timeHelper = require('./timeHelper.js');

module.exports = {
    backupDatabase: function(app){
      timeHelper.getDatestamp(new Date(), function(datestamp){
        fs.createReadStream(config.settings.database.db + '.db').pipe(fs.createWriteStream('backups/' + config.settings.database.db + '_' + datestamp + '.db'));
        lacewood.info("Backed up '" + config.settings.database.db + ".db' to 'backups/" + config.settings.database.db + "_" + datestamp + ".db'.");
      });
    },
    queryDatabase: function(query, emitFunction, client){
      lacewood.info('A user has requested the results of the following query: "' + query + '".');
      timeHelper.getLatency(
      function(){
        db.all(query, function(err, matches) {
          client.emit(emitFunction, matches);
        });
      },
      function(latency){
        lacewood.info('The results of the query "' + query + '" was returned to user. Request fulfilled in ' + latency + ' ms.');
      });
    }
}
