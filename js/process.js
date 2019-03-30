var socket;
var update_last_token,update_seri_number,update_email, update_admin, update_new_token,statusDevice;
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
           alert("Insert New Data Success!");
          }
        });
        socket.on('update_data', function (data) {
          if (data = "OK") {
           alert("Update Data Success!");
          }
        });
        socket.on('show_data', function (data) {
           $("#print_data").html(paseData(data));
           $("#update_seri" ).html(paseDataSeclect(data,1));
           $("#update_last" ).html(paseDataSeclect(data,2));
        });
    });
    function onSubmitNewdata(){

      new_email = $("input[name='new_email']").val();
      new_token = $("input[name='new_token']").val();
      new_seri_number = $("input[name='new_seri_number']").val();
      new_date = $("input[name='new_date']").val();
      new_name_product = $("#new_name_product" ).val();
      new_admin = $("#new_admin" ).val();
      infor_data = new_seri_number+"&"+ new_token + "&"+ new_email + "&" + new_name_product + "&" + new_admin+ "&" + new_date;
   
      socket.emit("new_data",infor_data);
      socket.emit("request_data","");
    }
    function onSubmitUpdatedata(){
      update_admin = $("#update_admin").val();
      update_email = $("input[name='update_email']").val();
      update_new_token = $("input[name='update_new_token']").val();
      update_last_token = $("#update_last").val();
      update_seri_number = $("#update_seri").val();
      statusDevice = $("input[name='statusDevice']:checked").val();
      infor_data_update = update_seri_number+"&"+update_last_token+"&"+update_new_token+"&"+update_email+"&"+update_admin+"&"+statusDevice;

      socket.emit("update_data",infor_data_update);
      socket.emit("request_data","");
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
      "<td> Status</td>"+
      "<td> Update At</td>"+
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
        "<td>" + object[i].status + "</td>"+
        "<td>" + object[i].updated_at + "</td>";
      }
      etable += "</table>";
      return etable;
    }
    function paseDataSeclect(object,name_sort) {
      etable = "";
      switch(name_sort) {
        case 1: {
          for (var i = 0; i < object.length;i++){
            etable += "<option value = "+object[i].seri_number+">"+object[i].seri_number+"</option>";
          }
          etable += "</select>";
          return etable;
        }
        case 2: {
          for (var i = 0; i < object.length;i++){
            etable += "<option value = "+object[i].last_token+">"+object[i].last_token+"</option>";
          }
          return etable;
        }
      }
      
    }
    function onGetdata(){
      socket.emit("request_data","");
    }