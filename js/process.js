var socket;
       $(document).ready(function() {
        socket = io.connect('http://wirelesstech.online:5060',{
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax : 5000,
          reconnectionAttempts: 99999
        });
  			socket.on('sending_json_data', function (data) {
          var dStatus = data.toString().split(";");
          var d1status = dStatus[0];
          var d2status = dStatus[1];
          if (d1status[3] =='t') {
            $("input[id='myonoffswitch1']").is(':checked');
          }else if (d1status[3] ='f') {
            $("input[id='myonoffswitch1']").attr('checked',false);
          }
          if (d2status[3] =='t') {
            $("input[id='myonoffswitch2']").is(':checked');
          }else if (d2status[3] ='f'){
            $("input[id='myonoffswitch2']").attr('checked',false);
          }
  			});
      $('input').on('click', function() {
        if ($("input[id='myonoffswitch1']").is(':checked')) {
          if (socket) {
              socket.emit('respond_command', "D1ON");
              console.log("D1PON");
            }
        }else {
          if (socket) {
              socket.emit('respond_command', "D1OFF");
            }
            console.log("D1POFF");
        }
        if ($("input[id='myonoffswitch2']").is(':checked')) {
          if (socket) {
              socket.emit('respond_command', "D2ON");
            }
        }
        else {
          if (socket) {
              socket.emit('respond_command', "D2OFF");
            }
        }
      });
    });