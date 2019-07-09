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

app.get('/',function(req,res) {
  var infor = req.url.split("?");
  var raw = infor[1].split("&");
  var seri = raw[0].split("=");
  var token = raw[1].split("=");
  var email = raw[3].split("=");
  email = email[1].split("%40");
  email= email[0] + "@" + email[1];
  
  pool.connect(function (err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err)
    }
    client.query("update blynk_data set new_token='"+token[1]+"' ,status = 'ON',updated_at = 'NOW()' WHERE seri_number='"+seri[1]+"' AND email='"+email+"' ", function (err, result) {
      done();

      if (err) {
          res.end();
          return console.error('error happened during query', err)
      }
      if (result.rows[0] == null ) {
        res.send("Thong tin khong ton tai!");
      }else{
        res.send("Cap nhat thanh cong!");
      }
    });
  })
})

app.get('/data_admin', function(req, res){
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
app.get('/check', function(req, res){
  var seri = req.url.split("?");
  var status_device,token_device;
  pool.connect(function (err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err)
    }
    client.query("SELECT status,new_token FROM blynk_data WHERE seri_number='"+seri[1]+"'", function (err, result_status) {
      done();

      if (err) {
        return console.error('error happened during query', err)
      }
      if (result_status.rows[0] != null) {
        status_device = result_status.rows[0].status;
        token_device = result_status.rows[0].new_token;
        if (status_device == "ON") {
          res.send("O" + token_device);
        } else {
          res.send("F");
        }
      }else{
        res.send("F");
      }
    })
})
});
app.get('/reques', function(req, res){
  var seri = req.url.split("?");
  pool.connect(function (err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err)
    }
    client.query("update blynk_data set status = 'OF' WHERE seri_number='"+seri[1]+"'", function (err, result_status) {
      done();

      if (err) {
        return console.error('error happened during query', err)
      }
      res.send("F");
    })
  })
});
io.on('connection', function (socket) {
    pool.connect(function (err, client, done) {
      if (err) {
        return console.error('error fetching client from pool', err)
      }
      client.query('SELECT * FROM blynk_data', function (err, result_All) {
        done();

        if (err) {
          return console.error('error happened during query', err)
        }
        socket.emit("show_data",result_All.rows);
    })
  })
  pool.connect(function (err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err)
    }
    client.query("SELECT * FROM forwarding_tokens f WHERE NOT EXISTS (SELECT * FROM blynk_data b WHERE f.token = b.new_token OR f.email = b.email)", function (err, result) {
      done();

      if (err) {
        return console.error('error happened during query', err)
      }
      socket.emit("free",result.rows);
    });
  })
  socket.on("request_data", function(data){
      pool.connect(function (err, client, done) {
        if (err) {
          return console.error('error fetching client from pool', err)
        }
        client.query('SELECT * FROM blynk_data', function (err, result_All) {
          done();

          if (err) {
            return console.error('error happened during query', err)
          }
          socket.emit("show_data",result_All.rows);
        })
    })
    });

    socket.on("new_data", function(data){
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
          client.query("INSERT INTO blynk_data (seri_number,last_token,email,name_product,editor,status,date,created_at) VALUES('"+seri_number+"','"+last_token+"','"+email+"','"+name_product+"','"+editor+"','OF','"+date+"','NOW()')", function (err, result) {
            done();
  
            if (err) {
              return console.error('error happened during query', err)
            }
             socket.emit("insert_data","OK");
          });
      })
  })

  socket.on("update_data", function(data){
    var d_string = data.split('&'),
    seri_number = d_string[0],
    last_token = d_string[1],
    new_token = d_string[2],
    email = d_string[3],
    editor = d_string[4],
    status_device =d_string[5];
    console.log(status_device);
    
    pool.connect(function (err, client, done) {
        if (err) {
          return console.error('error fetching client from pool', err)
        }
        client.query("update blynk_data set last_token = '"+last_token+"',new_token = '"+new_token+"',email = '"+email+"',editor = '"+editor+"',status = '"+status_device+"',updated_at = 'NOW()' where seri_number = '"+seri_number+"'", function (err, result) {
          done();

          if (err) {
            return console.error('error happened during query', err)
          }
           socket.emit("update_data","OK");
        });
    })
  })
  socket.on("one_device", function(data){
    pool.connect(function (err, client, done) {
        if (err) {
          return console.error('error fetching client from pool', err)
        }
        client.query("select * from blynk_data where seri_number ='"+data+"'", function (err, result) {
          done();

          if (err) {
            return console.error('error happened during query', err)
          }
           socket.emit("show_data",result.rows);
        });
    })
  })
  socket.on("free_data", function(data){
    
  })
    
    socket.on('disconnect', function (){
    });
      
  });
http.listen(5060, function () {
    console.log("Server running");
  });