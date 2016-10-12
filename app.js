var config = require('./config.json');
var lang = require('./lang/' + config.lang + '.json');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser = require("body-parser");
var db = require('./js/db.js');
var colors = require('colors');
var lacewood = require('lacewood');
var ejs = require('ejs');
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

server.listen(process.env.PORT || config.port, function(){
	lacewood.info('The application for ' + config.name + ' has restarted.');
});

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(req, res){
	res.render('pages/index');
});
app.get('/blog', function(req, res){
	res.render('pages/blog');
});
app.get('/projects', function(req, res){
  res.render('pages/projects');
});
app.get('/resume', function(req, res){
  res.render('pages/resume');
});
app.get('/skills', function(req, res){
  res.render('pages/skills');
});
app.get('/contact', function(req, res){
  res.render('pages/contact');
});


app.get('/readData', function(req, res){
	var data = db.readData(req.query.folder, req.query.key);
	res.send(data);
});
app.post('/saveData', function(req, res){
	lacewood.info(req.body.folder + " | " + req.body.key + " | " + req.body.data);
	var data = JSON.parse(req.body.data);
	db.saveData(req.body.folder, req.body.key, data);
});

io.on('connection', function(client){
	lacewood.info('A user has connected to the site.');

	client.on('email', function(recipient, subject, template, content){
    sendMail(recipient, subject, template, content);
	});

	client.on('log', function(msg){
		lacewood.info(msg);
	});

	client.on('disconnect', function(){
		lacewood.info('A user has disconnected from the site.');
	});
});

function sendMail(recipient, subject, type, content){
  app.mailer.send("email/" + type, {
      to: recipient,
      subject: subject,
      content: content
    }, function(err){
      if(err){ lacewood.err(err); return; }
      lacewood.info('Email with subject "' + subject + '" was sent to ' + recipient + '.');
    });
}
