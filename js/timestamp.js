module.exports = {
	getTimestamp: function(){
		  var now = new Date(),
		  	  date = [now.getFullYear(), now.getMonth() + 1, now.getDate()],
		      time = [now.getHours(), now.getMinutes(), now.getSeconds()];

		  for (var i = 1; i < 3; i++) {
		    if (time[i] < 10) {
		      time[i] = "0" + time[i];
		    }
		  }

		  return date.join("-") + " " + time.join(":");
	},
	getLogStamp: function(){
		var now = new Date(),
		date = [now.getFullYear(), now.getMonth() + 1, now.getDate()];
		
		return date.join(".")
	}
};