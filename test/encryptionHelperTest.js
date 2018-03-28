var assert = require("assert");
var config = require('./../config.json');
var encryptionHelper = require("./../js/encryptionHelper.js");

describe('Encryption Helper (encryptionHelper.js)', function(){
  describe('encrypt', function(){
    it('encrypt() should not return the raw password given to encrypt', function(){
      var unhashedPassword = "password";
      encryptionHelper.encrypt(unhashedPassword, config.settings.encryption.saltRounds, function(hash){
        assert.notEqual(unhashedPassword, hash);
      });
    })

    it('encrypt() should return the a hash that is ' + config.settings.encryption.hashLength + ' characters long', function(){
      var unhashedPassword = "password";
      encryptionHelper.encrypt(unhashedPassword, config.settings.encryption.saltRounds, function(hash){
        assert.equal(config.settings.encryption.hashLength, hash.length);
      });
    })

    it('encrypt() should return the a hash that is ' + config.settings.encryption.hashLength + ' characters long', function(){
      var unhashedPassword = "password";
      encryptionHelper.encrypt(unhashedPassword, config.settings.encryption.saltRounds, function(hash){
        assert.equal(config.settings.encryption.hashLength, hash.length);
      });
    })
  })
  //
  // describe('decrypt', function(){
  //   it('decrypt() should not return the raw password given to encrypt', function(){
  //     var unhashedPassword = "password";
  //     encryptionHelper.encrypt(unhashedPassword, config.settings.encryption.saltRounds, function(hash){
  //       assert.notEqual(unhashedPassword, hash);
  //     });
  //   })
  //
  //   it('encrypt() should return the a hash that is ' + config.settings.encryption.hashLength + ' characters long', function(){
  //     var unhashedPassword = "password";
  //     encryptionHelper.encrypt(unhashedPassword, config.settings.encryption.saltRounds, function(hash){
  //       assert.equal(config.settings.encryption.hashLength, hash.length);
  //     });
  //   })
  //
  //   it('encrypt() should return the a hash that is ' + config.settings.encryption.hashLength + ' characters long', function(){
  //     var unhashedPassword = "password";
  //     encryptionHelper.encrypt(unhashedPassword, config.settings.encryption.saltRounds, function(hash){
  //       assert.equal(config.settings.encryption.hashLength, hash.length);
  //     });
  //   })
  // })
});
//
// var x = "testpassword";
// var y = "garbage";
// encryptionHelper.encrypt(x, 5, function(hash){
//   console.log(hash);
//   encryptionHelper.compare(x, hash, function(res){
//     console.log("testpassword: " + res);
//   });
//   encryptionHelper.compare(y, hash, function(res){
//     console.log("garbage: " + res);
//   });
// });
