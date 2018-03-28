var assert = require("assert");
var config = require('./../config.json');
var sessionHelper = require("./../js/sessionHelper.js");

describe('Session Helper (sessionHelper.js)', function(){
  describe('generateGUID', function(){
    it('generateGUID() should generate an ID that is ' + config.settings.guid.length + ' characters long', function(){
      sessionHelper.generateGUID(function(guid){
        assert.equal(config.settings.guid.length, guid.length);
      });
    })
  })
});
