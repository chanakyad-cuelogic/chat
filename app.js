// Server side javascript for socket io

var express = require('express'),
 app = express(),
 server = require('http').createServer(app),
 io = require('socket.io').listen(server),
 nicknames = []; //creating array to grap all the users and display them

server.listen(4001); 

app.get("/", function(req, res) {
	res.sendFile(__dirname+'/index.html');
})

// getting messages server side 
io.sockets.on('connection', function(socket){
	
	//username check on establishing connection
	socket.on('new_user', function(data, callback){
		if (nicknames.indexOf(data) != -1){ // is matched
			callback(false); // that is matched or can send customdata eg (isValid: false)
		}else{
			callback(true);
			socket.nickname = data; //
			nicknames.push(socket.nickname);
			updateNicknames();

		}
	});

	//send messages on establishing connection
	socket.on('send_message', function(data){ 
		io.sockets.emit('new_message', {msg: data, nick: socket.nickname}); //except us
		// socket.broadcast.emit # send to every once but us
	});


	socket.on('disconnect', function(data){
		if (!socket.nickname) return;
		//splice(index,params(how many shall be remove from index))
		nickname.slice(nicknames.indexOf(socket.nickname), 1);
		updateNicknames();
	});

	function updateNicknames () {
		io.sockets.emit('usernames', nicknames); // so that user can update some one new joined
	};
});