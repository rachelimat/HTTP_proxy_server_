
var cuponArray;
var cArray;
var add = 0;
//-----------------------------------------------------------------------
//                 cupon   Validation
//-----------------------------------------------------------------------


$.validator.addMethod("check_date", function (value, element) {
    if (value > tripList[id_].startdate) {//check cupon start before trip begin 
      return false;
    }
    else {
      return true;
    }
  });
 
  $.validator.addMethod("earlier", function (value, element) {
    if ($("#startdate").val() > value) {//Checks if the expiration date is not early   than the startdate of the coupon
      return false;
    }
    else {
      return true;
    }
  });
$.validator.addMethod("space", function (value, element) {//check if space not exist in the input
if (value.indexOf(' ') >= 0) {return false; }
else { return true;}
});

function cuponValidation() {
    $("form[name='cupon_form']").validate({
        rules: {
            id_t: {
                required: true,
                space: true,
            },
            code: {
                required: true,
                space: true,
            },
            percent:{
                required: true,
                number: true,
                
            },
            startdate:{
                required: true,
                // check_Date: true,
                space: true,
            },
            expiredate:{
                required: true,
                // check_Date: true,
                space: true,
                earlier:true,
            },
        },
       
        
        // Specify validation error messages
        messages: {
            
            "code": {
                space: "enter country without space",
              },
              "startdate": {
                // check_Date:"date not valid'enter again "
              },
              "expiredate": {
                // check_Date:"date not valid'enter again ",
                space: "enter country without space",
                earlier: "enter date that bigger than start day",
              }
        
        }
    });
}


//--------------------------------------------------------
// get all the fileds values (cupon details)
//--------------------------------------------------------
function getCuponVariables() {
   var deatils = [
       
        $("#id_t").val(),
        $("#code").val(),
        $("#percent").val(),
        $("#startdate").val(),
        $("#expiredate").val()
    ]
  return deatils;
}


function addCupon() {
    var modal = document.getElementById("myModal3");
    var span = document.getElementsByClassName("close3")[0];

    // open the modal
    span.onclick = function() {
        modal.style.display = "none";
    }
    modal.style.display = "block";

    // client-side form validation of the inputes
     cuponValidation();
    // process the form
    $("#cupon_form").submit(function(event) {
        //  if (!$("#cupon_form").valid()) return;///
        // get the variables from the form fileds
        var details = getCuponVariables();
        addCuponCall(details) // ajax request --> add site to tour
        // ajax request --> add cupon
        modal.style.display = "none";
        event.preventDefault();
    });
}


function back(){
    window.location.href = "/";
}



function addCuponCall(cuponDeatilsArray){
  cArray=cuponDeatilsArray
  $.ajax({
      type: 'POST', // define the type of HTTP verb we want to use (POST for our form)
      url: 'aC/' + cuponDeatilsArray[0], // the url where we want to POST
      contentType: 'application/json',
      data: JSON.stringify({
          "code": $("#code").val(),
          "percent": $("#percent").val(),
          "start_date": $("#startdate").val(),
          "expire_date": $("#expiredate").val(),
      }),
      processData: false,
      encode: true,
      success: function (resul) {
      alert("add to json")
      $.ajax({
        type: 'GET',
        url: '/tours/'+cuponDeatilsArray[0],
        contentType: 'application/json',

        success: function(data) {
          if(i != 0)
            document.getElementById("cupons").innerHTML =" ";

          alert(data)
          let str=''
          str=document.getElementById("cupons").innerHTML;
          str+="<table><tr><th>Code</th><th>Percent</th><th>Start Date</th><th>Expire Date</th><th>Delet Cupon</th><th></th></tr>"
          ////////////////////////////////////////////////////////////////////איך לשמור 
          cuponObj=data.cupon
          if(cuponObj){
          cuponArray = Object.values(cuponObj)

          if(cuponObj){

            for(var i=0;i<cuponArray.length;i++) {
                  
                str+="<tr>"
                str += "<td>"+cuponArray[i].code+"</td>";
                str += "<td>"+cuponArray[i].percent+"</td>";  
                str += "<td>"+cuponArray[i].start_date+"</td>";           
                str += "<td>"+cuponArray[i].expire_date+"</td>";
                // str += "<td><button id=delete onclick=\"deletCupon()\">delete</button></td>";
                str += "<td><button id="+i+" onclick=\"deletCupon('"+i+"')\">delete</button></td>";

                str+="</tr>"
  
            }}
            str+="</table>"
          }
            document.getElementById("cupons").innerHTML=str;
            i++;
    
        },
        error: function(data) {
            alert(data);
        }
    });
      
      },
      error: function (jqXhr, textStatus, errorThrown) {
        console.log(errorThrown);
      }
    })
}

//--------------------------------------------------------
// send DELETE request to delete cupon of an tour
//--------------------------------------------------------
function deletCupon(i)
{

    $.ajax({
        type: 'DELETE',
        url: '/tours/'+cArray[0]+'/cupon/'+cuponArray[i].code,
        contentType: 'application/json',
        processData: false,
        encode: true,
        success: function(data, textStatus, jQxhr) {
            console.log(data);
            document.getElementById("cupons").innerHTML =" ";
            $.ajax({
              type: 'GET',
              url: '/tours/'+cArray[0],
              contentType: 'application/json',
      
              success: function(data) {
                alert(data)
                let str=''
                str=document.getElementById("cupons").innerHTML;
                str+="<table><tr><th>Code</th><th>Percent</th><th>Start Date</th><th>Expire Date</th><th>Delet Cupon</th><th></th></tr>"
                ////////////////////////////////////////////////////////////////////איך לשמור 
                cuponObj=data.cupon
                if(cuponObj){
                cuponArray = Object.values(cuponObj)
      
                if(cuponObj){
      
                  for(var i=0;i<cuponArray.length;i++) {
                        
                      str+="<tr>"
                      str += "<td>"+cuponArray[i].code+"</td>";
                      str += "<td>"+cuponArray[i].percent+"</td>";  
                      str += "<td>"+cuponArray[i].start_date+"</td>";           
                      str += "<td>"+cuponArray[i].expire_date+"</td>";
                      // str += "<td><button id=delete onclick=\"deletCupon()\">delete</button></td>";
                      str += "<td><button id="+i+" onclick=\"deletCupon('"+i+"')\">delete</button></td>";
      
                      str+="</tr>"
        
                  }}
                  str+="</table>"
                }
                  console.log(str)
                  document.getElementById("cupons").innerHTML=str;
          
              },
              error: function(data) {
                  alert(data);
              }
          });


            // get_cupons();//need to add   
        },
        error: function(jqXhr, textStatus, errorThrown) {
            alert(errorThrown);
        }
    });
}

