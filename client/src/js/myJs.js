var u = "";
var p = "";

var register = function() {
	var username = $('#username').val();
	var password = $('#password').val();

	//ajax
	$.ajax({
		url:"/middleware/register",
		contentType:"application/json",
		type:"POST",
		data:JSON.stringify({
			username: username,
			password: password
		}),
		dataType: 'json',
		success:function(data){
			$("#registerResult").html("API Response: " + JSON.stringify(data));
		},
		error:function(e){
			$("#registerResult").html("API Response: " + JSON.stringify(e));
		}
	});
};

var makeRequest = function() {
	var username = $('#username').val();
	var password = $('#password').val();

	var basicAuth = window.btoa(username + ":" + password);
	
	//ajax
	$.ajax({
		url:"/middleware/somerequest",
		type:"GET",
		headers: {
			Authorization: "Basic " + basicAuth
		},
		success:function(data){
			$("#apiRequestResult").html("API Response: " + JSON.stringify(data));
		},
		error:function(e){
			$("#apiRequestResult").html("API Response: " + JSON.stringify(e));
		}
	});
};

