var config = require('./config.json');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var ejs = require('ejs');
var fs = require('fs');
var bodyParser = require("body-parser");
var colors = require('colors');
var lacewood = require('lacewood');
var routesHelper = require('./js/routesHelper.js');
var dbHelper = require('./js/dbHelper.js');
var sessionHelper = require('./js/sessionHelper.js');
var encryptionHelper = require('./js/encryptionHelper.js');

server.listen((process.env.PORT || config.port), function(){
  lacewood.info("The " + config.name + " application started on port " + config.port + ".");
  dbHelper.backupDatabase();
  setInterval(dbHelper.backupDatabase, config.settings.database.backupInterval);
});

routesHelper.initializeExpress(app, express, bodyParser, __dirname);
routesHelper.setupRoutes(app);

io.on('connection', function(client){
	client.on('log', function(msg){
		lacewood.info(msg);
	});

	client.on('disconnect', function(){
		//lacewood.info('A user has disconnected from the site.');
	});

  client.on('requestArticles', function(page){
    dbHelper.queryDatabase("SELECT * FROM posts", 'returnArticles', client);
  });
});
