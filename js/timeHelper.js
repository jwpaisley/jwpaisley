module.exports = {
    wait: function(ms, callback){
      var startTime = new Date();
      var endTime = new Date();
      while(endTime - startTime != ms){
        endTime = new Date();
      }
      if (callback) callback();
    },
    getDatestamp: function(date, callback){
      var datestamp = [date.getFullYear(), date.getMonth() + 1, date.getDate()].join("-");
      if (callback) callback(datestamp);
    },
    getTimestamp: function(date, callback){
      var timestamp = [(date.getHours()<10?'0':'') + date.getHours(), (date.getMinutes()<10?'0':'') + date.getMinutes(), (date.getSeconds()<10?'0':'') + date.getSeconds(), (date.getMilliseconds()<10?'0':'') + date.getMilliseconds()].join(":");
      if (callback) callback(timestamp);
    },
    getLatency: function(functionCall, callback){
      var startTime = new Date();
      functionCall();
      var latency = new Date() - startTime;
      if (callback) callback(latency);
    }
}
