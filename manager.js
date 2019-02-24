var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname + '/'));
//app.set('views', __dirname + '/app/server/views');


var pg = require('pg')

var configpg = {
  user:'test',
  database: 'blynk',
  password: 'test',
  host: 'localhost',
  port: 5432,
  max:10,
  idleTimeoutMillis:30000,
};
var pool = new pg.Pool(configpg);

app.get('/', function(req, res){
    pool.connect(function (err, client, done) {
	    if (err) {
	      return console.error('error fetching client from pool', err)
	    }
	    client.query('SELECT * FROM forwarding_tokens', function (err, result) {
	      done();

	      if (err) {
            res.end();
            return console.error('error happened during query', err)
	      }
	        res.render("index",{list:result});
	  });
    })
});
io.on('connection', function (socket) {
    console.log("New connection");
    // pool.connect(function (err, client, done) {
	//     if (err) {
	//       return console.error('error fetching client from pool', err)
	//     }
	//     client.query('SELECT * FROM forwarding_tokens', function (err, result) {
	//       done();

	//       if (err) {
    //         return console.error('error happened during query', err)
	//       }
    //        console.log( " Gia tri muon in: " + JSON.stringify(result));
	//         res.render("index",{list:result});
	//   });
    // })
    socket.on('disconect', function (){
    console.log(" Disconnect");
    });
      
  });
http.listen(5060, function () {
    console.log("Server running");
  });