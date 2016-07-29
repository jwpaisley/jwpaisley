var config = require('./config.json');
var lang = require('./lang/' + config.lang + '.json');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser = require("body-parser");
var db = require('./js/db.js');
var colors = require('colors');
var log = require('./js/log.js');
var mailer = require('express-mailer');

mailer.extend(app, {
  from: config.settings.email.mail_addr,
  host: config.settings.email.mail_host,
  secureConnection: config.settings.email.secure_connection,
  port: config.settings.email.mail_port,
  transportMethod: 'SMTP',
  auth: {
    user: config.settings.email.mail_addr,
    pass: config.settings.email.mail_pass
  }
});

server.listen(config.port, function(){
	log.info('The application for ' + config.name + ' has started.');
});

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.get('/', function(req, res){
	res.render('pages/index');
});
app.get('/readData', function(req, res){
	var data = db.readData(req.query.folder, req.query.key);
	res.send(data);
});
app.post('/saveData', function(req, res){
	log.info(req.body.folder + " | " + req.body.key + " | " + req.body.data);
	var data = JSON.parse(req.body.data);
	db.saveData(req.body.folder, req.body.key, data);
});

io.on('connection', function(client){
	log.info('A user has connected to the site.');

	client.on('email',function(){
    // sendMail("jacobpaisley97@gmail.com", "My Internship with Principal Financial Group  ||  New Blog Post by Jacob Paisley ");
	});

	client.on('log', function(msg){
		log.info(msg);
	});

	client.on('disconnect', function(){
		log.info('A user has disconnected from the site.');
	});
});

function sendMail(recipient, subject){
  app.mailer.send('email/email', {
      to: recipient,
      subject: subject
    }, function(err){
      if(err){ log.err(err); return; }
      log.info('Email with subject "' + subject + '" was sent to ' + recipient + '.');
    });
}
