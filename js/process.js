var socket;
var infor_data,infor_data_update, new_admin,new_date,new_email,new_name_product,new_seri_number,new_token;
var etable = "";
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
           $("#print_data").html(paseData(data));
           socket.destroy();
        });
        new_email = $("input[name='new_email']").val();
        new_token = $("input[name='new_token']").val();
        new_seri_number = $("input[name='new_seri_number']").val();
        new_date = $("input[name='new_date']").val();
        new_name_product = $( "#new_name_product" ).val();
        new_admin = $( "#new_admin" ).val();
        infor_data = new_seri_number+"&"+ new_token + "&"+ new_email + "&" + new_name_product + "&" + new_admin+ "&" + new_date;
    });
    function onSubmitNewdata(){
      socket.emit("new_data",infor_data);
    }
    function onSubmitUpdatedata(){
      socket.emit("update_data",infor_data_update);
      socket.close();
    }
    function paseData(object) {
      etable = "<table id = log_data> <tr>"+
      "<td> STT </td>"+
      "<td> Serial Number</td>"+
      "<td> Last Token</td>"+
      "<td> New Token</td>"+
      "<td> Email</td>"+
      "<td> Name Product</td>"+
      "<td> Editor </td>"+
      "<td> Date</td>"+
      "<td> Created At</td>"+
      "<td> Update At</td>"+
      "<td> Deleted At</td>"+
      "</tr> ";
      for (var i = 0; i < object.length;i++){
        etable += "<tr> <td>" + object[i].id + "</td>" +
        "<td>" + object[i].seri_number + "</td>"+
        "<td>" + object[i].last_token + "</td>"+
        "<td>" + object[i].new_token + "</td>"+
        "<td>" + object[i].email + "</td>"+
        "<td>" + object[i].name_product + "</td>"+
        "<td>" + object[i].editor + "</td>"+
        "<td>" + object[i].date + "</td>"+
        "<td>" + object[i].created_at + "</td>"+
        "<td>" + object[i].updated_at + "</td>"+
        "<td>" + object[i].deleted_at + "</td> </tr>";
      }
      etable += "</table>";
      return etable;
    }