var config = require('../config.json');
var colors = require('colors/safe');
var fs = require('fs');
var timestamp = require('./timestamp');

module.exports = {
	info: function(msg){
		var tsText = timestamp.getTimestamp();
		console.log(colors.grey(tsText) + ' [INFO] ' + msg);
		writeToLog(tsText + ' [INFO] ' + msg);
	},
	warn: function(msg){
		var tsText = timestamp.getTimestamp();
		console.log(colors.grey(tsText) + colors.yellow(' [WARN] ' + msg));
		writeToLog(tsText + ' [WARN] ' + msg);
	},
	err: function(msg){
		var tsText = timestamp.getTimestamp();
		console.log(colors.grey(tsText) + colors.red(' [ERR]  ' + msg));
		writeToLog(tsText + ' [ERR]  ' + msg);
	}
};

function writeToLog(msg){
	if(config.settings.enable_logs){
			fs.appendFile('logs/' + timestamp.getLogStamp() + '.log', msg + '\n', function (err) {});
	}
}