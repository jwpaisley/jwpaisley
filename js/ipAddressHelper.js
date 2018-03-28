var lacewood = require('lacewood');
var iplocation = require('iplocation');

module.exports = {
    getIPAddress: function(req, callback){
      var ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      callback(ipAddress);
    },
    getIPAddressLocation: function(ipAddress, callback){
      var ipLocation = "";
      if(ipAddress == "127.0.0.1" || ipAddress == "::1"){
        ipLocation = "localhost";
        callback(ipAddress, ipLocation);
      } else {
        iplocation(ipAddress, function (error, res) {
          var city = res.city || "Unknown City";
          var region = res.region_code || "Unknown Region";
          var country = res.country_name || "Unknown Country";
          ipLocation = city + ", " + region + ", " + country;
          callback(ipAddress, ipLocation);
        });
      }
    }
}
