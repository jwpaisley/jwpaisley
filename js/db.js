var config = require('../config.json');
var fs = require('fs');
var log = require('./log.js');
var encryption = require('cryptr');
var cryptr = new encryption(config.settings.encryption.key);

module.exports = {
	saveData: function(folder, key, data){
		var encryptedKey = cryptr.encrypt(key);
		var encryptedFolder = cryptr.encrypt(folder);
		var filePath = 'db/' + encryptedFolder + '/' + encryptedKey +  config.settings.database.file_ext;
		if(config.settings.database.enable_db){
			fs.existsSync('db/' + encryptedFolder) || fs.mkdirSync('db/' + encryptedFolder);
			fs.writeFile(filePath, JSON.stringify(data, null, 4), function(err) {
			    if(err) { log.err(err.code); }
			});
		}else{
			log.warn("A user has attempted to save data to " + filePath + ", but the application's configuration has not enabled the database.");
		}
	},
	readData: function(folder, key){
		var encryptedKey = cryptr.encrypt(key);
		var encryptedFolder = cryptr.encrypt(folder);
		var filePath = 'db/' + encryptedFolder + '/' + encryptedKey +  config.settings.database.file_ext;		
		var userData = fs.readFileSync(filePath, 'utf-8', function(err, data) {
		  if(err){ log.err(err); } 
		});
		if(config.settings.database.enable_db){
			return userData;	
		}else{
			log.warn("A user has attempted to read data from " + filePath + ", but the application's configuration has not enabled the database.");
		}
	}
};