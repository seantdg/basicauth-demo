// dependencies
var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());
var url = 'http://' + process.env.DBFACADE_PORT_3000_TCP_ADDR + ':' + process.env.DBFACADE_PORT_3000_TCP_PORT;

//store clients in memory for this demo
var clientInfo = {
};

// define supported routes
app.get('/middleware/status', function(req, res){
	res.set({
		'Content-Type': 'application/json',
	});
	res.status(200);
	var body = {
		"success":true
	};
	res.send(JSON.stringify(body));
});

app.post('/middleware/register', function(req, res) {
	//extract client name from body
	var username = req.body.username;
	var password = req.body.password;
	
	clientInfo[username] = {
		password:password
	};

	//return to client
	res.status(200).json({
		success:true,
		username:username
	});

});

app.get('/middleware/somerequest', function(req, res) {

	//verify Basic Auth header
	var username = "";
	var password = "";
	var authHeader = req.headers.authorization;
	console.log("SD+" + authHeader);

	//define regex to extract Basic Auth header
	var patt = /Basic (.*)/i;
	try {
		//Get value after "Basic " using regex
		var basicVal = patt.exec(authHeader)[1];

		//base 64 decode
		var buf = new Buffer(basicVal, 'base64');
		var decoded = buf.toString();

		//split username and password
		var userPassPatt = /(.*):(.*)/;
		var userPassRes = userPassPatt.exec(decoded);
		username = userPassRes[1];
		password = userPassRes[2];
	}
	catch(e) {	//lots could go wrong above - return a generic 401
		console.log(e);
		return res.status(401).json({
			success: false,
			description: "Unauthorized"
		});
	}

	//lookup client
	var clientDetails = clientInfo[username];

	console.log("SD+2 "+ JSON.stringify(clientInfo));
	
	//verify client credentials
	if(!clientDetails || clientDetails.password !== password) {
		return res.status(401).json({
			success: false,
			description: "Unauthorized"
		});
	}
	else {
		return res.status(200).json({
			success: true,
			username: username
		});
	}

});

// start node app
app.listen(3000);
console.log("Started on port 3000");
