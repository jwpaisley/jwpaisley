var socket = io();

$(document).ready(function(){
	$('.fade-in').fadeIn(1000);
	$('#construction-modal').modal('show');
	// var folder = 'jacobpaisley97@gmail.com';
	// var key = 'userData';
	// $.get('/readData?folder=' + folder + '&key=' + key, function(data){
	// 	var parsedData = JSON.parse(data);
	// 	console.log(parsedData.email);
	// });

	// $.post('/saveData', {
	// 	folder: "users",
	// 	key: "jacobpaisley97@gmail.com",
	// 	data: '{ "name": "Jacob" }'
	// });

	// socket.emit('email');
});

// socket.on('createCookie', function(name, value){
// 	createCookie(name, value, 60);
// });
//
// socket.on('eraseCookie', function(name, value){
// 	eraseCookie(name);
// });
