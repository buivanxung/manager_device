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
        ocket.on('update_data', function (data) {
          if (data = "OK") {
           alert("Update Data Success!")
          }
        });
        socket.on('show_data', function (data) {
           console.log(data);
           
        });
        new_email = $("input[name='new_email']");
        new_token = $("input[name='new_token']");
        new_seri_number = $("input[name='new_seri_number']");
        new_date = $("input[name='new_date']");
        function displayVals() {
          var new_name_product = $( "#new_name_product" ).val();
          var new_admin = $( "#new_admin" ).val();
        }
        $( "select" ).change( displayVals );
        displayVals();
    });
    function onSubmitNewdata(){
      infor_data = new_seri_number+"&"+ new_token + "&"+ new_email + "&" + new_name_product + "&" + new_admin+ "&" + new_date;
      socket.emit("new_data",infor_data);
    }
    function onSubmitNewdata(){
      socket.emit("update_data",infor_data_update);
    }