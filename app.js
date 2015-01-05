// Server side javascript for socket io

var express = require('express'),
 app = express(),
 server = require('http').createServer(app),
 io = require('socket.io').listen(server),
 users = {} //creating array to grap all the users and display them

server.listen(4001); 

app.get("/", function(req, res) {
	res.sendFile(__dirname+'/index.html');
})

// getting messages server side 
io.sockets.on('connection', function(socket){
	
	//username check on establishing connection
	socket.on('new_user', function(data, callback){
		if (data in users){ // is matched
			callback(false); // that is matched or can send customdata eg (isValid: false)
		}else{
			callback(true);
			socket.nickname = data; //
			users[socket.nickname] = socket;
			updateNicknames();

		}
	});

	//send messages on establishing connection
	socket.on('send_message', function(data){
		var msg = data.trim(); // remove if any white spaces
		if (msg.substr(0,3) === '/w') //checking for wisper condition '/w'
		{ 
			console.,log("wisper");
		} else {
			io.sockets.emit('new_message', {msg: data, nick: socket.nickname}); //except us
			// socket.broadcast.emit # send to every once but us
		}
	});


	socket.on('disconnect', function(data){
		if (!socket.nickname) return;
		delete users[socket.nickname];
		updateNicknames();
	});

	function updateNicknames () {
		io.sockets.emit('usernames', Object.keys(users)); // so that user can update some one new joined
	};
});