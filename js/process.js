var socket;
var infor_data,infor_data_update, new_admin,new_date,new_email,new_name_product,new_seri_number,new_token;
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
        socket.on('update_data', function (data) {
          if (data = "OK") {
           alert("Update Data Success!")
          }
        });
        socket.on('show_data', function (data) {
           console.log(JSON.stringify(data));
           
        });
        new_email = $("input[name='new_email']").val();
        new_token = $("input[name='new_token']").val();
        new_seri_number = $("input[name='new_seri_number']").val();
        new_date = $("input[name='new_date']").val();
        var new_name_product = $( "#new_name_product" ).val();
        var new_admin = $( "#new_admin" ).val();
        infor_data = new_seri_number+"&"+ new_token + "&"+ new_email + "&" + new_name_product + "&" + new_admin+ "&" + new_date;
        console.log(infor_data);
    });
    function onSubmitNewdata(){
      console.log(infor_data);
      socket.emit("new_data",infor_data);
    }
    function onSubmitUpdatedata(){
      socket.emit("update_data",infor_data_update);
    }