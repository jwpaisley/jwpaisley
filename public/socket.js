var socket = io();

$(document).ready(function(){
	$('.fade-in').fadeIn(1000);
	$('#construction-modal').modal('show');

	$('.skillbar').each(function(){
		$(this).find('.skillbar-bar').animate({
			width:$(this).attr('data-percent')
		},6000);
	});
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

	$('#submit-contact-form').click(function() {
		$('#error-message').addClass('hidden');
		$('#sent-message').addClass('hidden');
		var name = $('#name-input').val();
		var company = $('#company-input').val();
		var email = $('#email-input').val();
		var phone = $('#phone-input').val();
		var message = $('#message-input').val();

		if(name == '' || company == '' || email == '' || message == ''){
			$('#error-message').removeClass('hidden');
		} else {
			var content = {
				"name": name,
				"company": company,
				"email": email,
				"phone": phone,
				"message": message
			};
			socket.emit('email', 'contact@jwpaisley.com', "Message from " + name + " at " + company, 'contact', content);
			$('#sent-message').removeClass('hidden');
			$(':input','#contact-form').not(':button, :submit, :reset, :hidden').val('').removeAttr('checked').removeAttr('selected');
		}
	});

	$('#clear-contact-form').click(function() {
		$(':input','#contact-form').not(':button, :submit, :reset, :hidden').val('').removeAttr('checked').removeAttr('selected');
	});

});

// socket.on('createCookie', function(name, value){
// 	createCookie(name, value, 60);
// });
//
// socket.on('eraseCookie', function(name, value){
// 	eraseCookie(name);
// });
