var socket;
var infor_data,infor_data_update;
       $(document).ready(function() {
        socket = io.connect('http://wirelesstech.online:5060',{
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax : 5000,
          reconnectionAttempts: 99999
        });
  			socket.on('insert_data', function (data) {
          if (data = "OK") {
           alert("Insert New Data Success!")
          }
        });
        ocket.on('update_data', function (data) {
          if (data = "OK") {
           alert("Update Data Success!")
          }
        });
        socket.on('show_data', function (data) {
           console.log(data);
           
  			});
    });
    function onSubmitNewdata(){
      socket.emit("new_data",infor_data);
    }
    function onSubmitNewdata(){
      socket.emit("update_data",infor_data_update);
    }