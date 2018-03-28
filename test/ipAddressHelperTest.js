var assert = require("assert");
var ipAddressHelper = require("./../js/ipAddressHelper.js");

describe('IP Address Helper (ipAddressHelper.js)', function(){
  describe('getIPAddress', function(){
    it('getIPAddress() should return "184.97.40.156" as the IP address for req.headers[\'x-forwarded-for\'] = "184.97.40.156"', function(){
      var req = {headers:[], connection: {remoteAddress: ""}};
      req.headers['x-forwarded-for'] = "184.97.40.156";
      ipAddressHelper.getIPAddress(req, function(ipAddress){
        assert.equal("184.97.40.156", ipAddress);
      });
    })
    it('getIPAddress() should return "60.106.71.134" as the IP address for req.connection.remoteAddress = "60.106.71.134"', function(){
      var req = {headers:[], connection: {remoteAddress: "60.106.71.134"}};
      req.headers['x-forwarded-for'] = null;
      ipAddressHelper.getIPAddress(req, function(ipAddress){
        assert.equal("60.106.71.134", ipAddress);
      });
    })
  })

  describe('getIPAddressLocation', function(done){
    it('getIPAddressLocation("127.0.0.1") should return "localhost" as the location', function(done){
      ipAddressHelper.getIPAddressLocation("127.0.0.1", function(ipAddress, ipLocation){
        assert.equal("localhost", ipLocation);
        done();
      });
    })
    it('getIPAddressLocation("::1") should return "localhost" as the location', function(done){
      ipAddressHelper.getIPAddressLocation("::1", function(ipAddress, ipLocation){
        assert.equal("localhost", ipLocation);
        done();
      });
    })
    it('getIPAddressLocation("8.8.8.8") should not return "localhost" as the location', function(done){
      ipAddressHelper.getIPAddressLocation("8.8.8.8", function(ipAddress, ipLocation){
        assert.notEqual("localhost", ipLocation);
        done();
      });
    })
  })
});
