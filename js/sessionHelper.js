var config = require('./../config.json');

module.exports = {
    generateGUID: function(callback){
      var guid = "";
      while(guid.length < config.settings.guid.length){
        var guid = guid + generateChar();
      }
      callback(guid);
    }
}

function generateChar(){
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}
