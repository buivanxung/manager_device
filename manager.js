var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.set('views', __dirname + '/');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/'));


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
	    client.query('SELECT * FROM forwarding_tokens ORDER BY ts ASC', function (err, result) {
	      done();

	      if (err) {
            res.end();
            return console.error('error happened during query', err)
	      }
	        res.render("index.ejs",{list:result});
	  });
    })
});
io.on('connection', function (socket) {
    console.log("New connection");
    socket.on("request_data", function(data){
        pool.connect(function (err, client, done) {
            if (err) {
              return console.error('error fetching client from pool', err)
            }
            client.query('SELECT token,email FROM forwarding_tokens', function (err, result) {
              done();
    
              if (err) {
                return console.error('error happened during query', err)
              }
               console.log( " Gia tri muon in: " + JSON.stringify(result));
                
          });
        })
    })

    socket.on("new_data", function(data){
      console.log(JSON.stringify(data));
      var d_string = data.split('&'),
      seri_number = d_string[0],
      last_token = d_string[1],
      email = d_string[2],
      name_product = d_string[3],
      editor = d_string[4],
      date = d_string[5];
      pool.connect(function (err, client, done) {
          if (err) {
            return console.error('error fetching client from pool', err)
          }
          client.query("INSERT INTO blynk_data (seri_number,last_token,email,name_product,editor,date,created_at) VALUES('"+seri_number+"','"+last_token+"','"+email+"','"+name_product+"','"+editor+"','"+date+"','NOW()')", function (err, result) {
            done();
  
            if (err) {
              return console.error('error happened during query', err)
            }
             console.log("Insert Ok");
             socket.emit("insert_data","OK");

             client.query('SELECT * FROM blynk_data', function (err, result_All) {
              done();
    
              if (err) {
                return console.error('error happened during query', err)
              }
              socket.emit("show_data",result_All.rows);
            })
              
        });
      })
  })

  socket.on("update_data", function(data){
    var d_string = data.split('&'),
    seri_number = d_string[0],
    last_token = d_string[1],
    new_token = d_string[5],
    email = d_string[2],
    name_product = d_string[3],
    editor = d_string[4],
    updated_at = new Date();
    pool.connect(function (err, client, done) {
        if (err) {
          return console.error('error fetching client from pool', err)
        }
        client.query("update blynk_data set last_token = "+last_token+",new_token = "+new_token+",email = "+email+",name_product = "+name_product+",editor = "+editor+",update_at = NOW()) where seri_number = "+seri_number+"", function (err, result) {
          done();

          if (err) {
            return console.error('error happened during query', err)
          }
           console.log("Update data Ok");
           socket.emit("update_data","OK");

           client.query('SELECT seri_number,last_token,email,name_product,editor,date,created_at FROM blynk_data', function (err, result_All) {
            done();
  
            if (err) {
              return console.error('error happened during query', err)
            }
            socket.emit("show_data",result_All.rows);
          })
            
      });
    })
})
    
    socket.on('disconnect', function (){
    console.log(" Disconnect");
    });
      
  });
http.listen(5060, function () {
    console.log("Server running");
  });