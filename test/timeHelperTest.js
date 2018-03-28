var assert = require("assert");
var timeHelper = require("./../js/timeHelper.js");

describe('Time Helper (timeHelper.js)', function(){
  describe('getDatestamp', function(){
    it('getDatestamp(new Date(-1)) should return "1969-12-31" as a datestamp', function(){
      timeHelper.getDatestamp(new Date(-1), function(datestamp){
        assert.equal('1969-12-31', datestamp);
      });
    })
    it('getDatestamp(new Date(null)) should return "1969-12-31" as a datestamp', function(){
      timeHelper.getDatestamp(new Date(null), function(datestamp){
        assert.equal('1969-12-31', datestamp);
      });
    })
    it('getDatestamp(new Date("1/1/2000")) should return "2000-1-1" as a datestamp', function(){
      timeHelper.getDatestamp(new Date("1/1/2000"), function(datestamp){
        assert.equal('2000-1-1', datestamp);
      });
    })
    it('getDatestamp(new Date("February 6, 1997")) should return "1997-2-6" as a datestamp', function(){
      timeHelper.getDatestamp(new Date("February 6, 1997"), function(datestamp){
        assert.equal('1997-2-6', datestamp);
      });
    })
  })

  describe('getTimestamp', function(){
    it('getTimestamp(new Date(0)) should return "00:00:00:00" as a timestamp', function(){
      timeHelper.getTimestamp(new Date(0), function(datestamp){
        assert.equal('18:00:00:00', datestamp);
      });
    })
    it('getTimestamp(new Date(null)) should return "00:00:00:00" as a timestamp', function(){
      timeHelper.getTimestamp(new Date(null), function(datestamp){
        assert.equal('18:00:00:00', datestamp);
      });
    })
    it('getTimestamp(new Date("1/1/2000 07:52")) should return "07:52:00:00" as a datestamp', function(){
      timeHelper.getTimestamp(new Date("1/1/2000 07:52"), function(datestamp){
        assert.equal('07:52:00:00', datestamp);
      });
    })
    it('getTimestamp(new Date("February 6, 1997 19:21")) should return "1997-2-6" as a datestamp for "February 6, 1997"', function(){
      timeHelper.getTimestamp(new Date("February 6, 1997 19:21:04:555"), function(datestamp){
        assert.equal('19:21:04:555', datestamp);
      });
    })
  })

  describe('getLatency', function(){
    it('getLatency(wait(3)) should return at least 3ms as a latency', function(){
      timeHelper.getLatency(function(){
        timeHelper.wait(3);
      }, function(latency){
        assert.ok(3 <= latency);
      });
    })
  })
});
