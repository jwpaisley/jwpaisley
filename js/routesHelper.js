var lacewood = require('lacewood');
var ipAddressHelper = require('./ipAddressHelper.js');

module.exports = {
    setupRoutes: function(app){
      app.get('/', function(req, res){
        logUserAccessToRoute("", req, function(){
          res.render('pages/index');
        });
      });
      app.get('/aboutme', function(req, res){
        logUserAccessToRoute("aboutme", req, function(){
          res.render('pages/aboutme');
        });
      });
      app.get('/tech', function(req, res){
        logUserAccessToRoute("tech", req, function(){
          res.render('pages/tech');
        });
      });
      app.get('/beer', function(req, res){
        logUserAccessToRoute("beer", req, function(){
          res.render('pages/beer');
        });
      });
      app.get('/contact', function(req, res){
        logUserAccessToRoute("contact", req, function(){
          res.render('pages/contact');
        });
      });
    },
    initializeExpress: function(app, express, bodyParser, dirname){
      app.use(express.static(dirname + '/public'));
      app.use(bodyParser.urlencoded({ extended: false }));
      app.use(bodyParser.json());
      app.set('views', dirname + '/views');
      app.set('view engine', 'ejs');
    }
}

function logUserAccessToRoute(routeName, req, callback){
  ipAddressHelper.getIPAddress(req, function(ipAddress){
    ipAddressHelper.getIPAddressLocation(ipAddress, function(ipAddress, ipLocation){
      lacewood.info("A user connected to '/" + routeName + "' from " + ipLocation + " (" + ipAddress + ").");
      callback();
    });
  });
}
