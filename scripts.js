$("document").ready(homePageIsReady);
var tripList = [];
var j=0;
//--------------------------------------------------------
// running when document is ready
//--------------------------------------------------------
function homePageIsReady() {

    // get and show all tours
    get_tours();

    // add tour click listener --> open the form
    $(".add_tour").click(function(e) {
        var modal = document.getElementById("myModal");
        var span = document.getElementsByClassName("close")[0];

        // open the modal
        span.onclick = function() {
            modal.style.display = "none";
        }
        modal.style.display = "block";

        // client-side form validation of the inputes
        formValidation();
        // process the form
        $("#tour_form").submit(function(event) {
           // if (!$("#tour_form").valid()) return;
            // get the variables from the form fileds
            var details = getFormVariables();
            addTour(details);
            modal.style.display = "none";
            event.preventDefault();
        });
    });
}

//--------------------------------------------------------
// client-side validation of the form fields
//--------------------------------------------------------
function formValidation() {
    $("form[name='tour_form']").validate({
        rules: {
            id_field: {
                required: true,
                space:true,
            },
            start_date: {//*
                required: true,
               
            },
            duration:{
                required: true,
                digits: true,
            },
            price:{
                required: true,
                digits: true,
            },

        },
        // Specify validation error messages
        messages: {
            field_id: "Please enter only digits"
        }
    });
}

//--------------------------------------------------------
// get all the fileds values (tour details)
//--------------------------------------------------------
function getFormVariables() {
    var deatils= [
       
        $("#id_field").val(),
        $("#start_date").val(),
        $("#duration").val(),
        $("#price").val()

    ]

    return deatils;
}

function getFormVariablesUpdate() {
    var deatils= [
       
        $("#id_field_u").val(),
        $("#start_date_u").val(),
        $("#duration_u").val(),
        $("#price_u").val()

    ]

    return deatils;
}

//--------------------------------------------------------
// send the tour detailes to the related function in the server-side
//--------------------------------------------------------
function addTour(tourDetails) {
    $.ajax({
        type: 'POST', // define the type of HTTP verb we want to use (POST for our form)
        url: 'http://localhost:3001/tours', // the url where we want to POST
        contentType: 'application/json',
        data: JSON.stringify({
            "id": tourDetails[0],
            "start_date": tourDetails[1],//*
            "duration": tourDetails[2],
            "price": tourDetails[3],
            "sites": [],
            "cupon":{}
        }),
        processData: false,
        encode: true,
        success: function(data, textStatus, jQxhr) {
            console.log(data);
            document.getElementById("tour_form").reset(); //reset the form
            get_tours();
        },
        error: function(jqXhr, textStatus, errorThrown) {
            alert(errorThrown);
        }
    });
}


//--------------------------------------------------------
// send DELETE request to delete an tour
//--------------------------------------------------------
function delTour(e) {
    $.ajax({
        type: 'DELETE',
        url: 'http://localhost:3001/tours/' + e,
        contentType: 'application/json',
        processData: false,
        encode: true,
        success: function(data, textStatus, jQxhr) {
            console.log(data);
            get_tours();
        },
        error: function(jqXhr, textStatus, errorThrown) {
           
            alert(errorThrown);
        }
    });
}


//--------------------------------------------------------
//                    update validation 
//--------------------------------------------------------
function updateValidation() {
    $("form[name='update_tour_form']").validate({
        rules: {
            
            start_date_u: {//*
                required: true,
               
            },
            duration_u:{
                required: true,
                digits: true,
            },
            price_u:{
                required: true,
                digits: true,
            },

        },
        // Specify validation error messages
        messages: {
           // field_id: "Please enter only digits"
        }
    });
}




//--------------------------------------------------------
// send GET request to get the tours list (sorted)
//--------------------------------------------------------
function  get_tours() {
    $.ajax({
        type: 'GET',
        url: 'http://localhost:3001/tours',
        contentType: 'application/json',
        success: function(data) {
            console.log(data);
            tripLis=data;/////
            show_tours(data);
        },
        error: function(data) {
            alert(data);
        }
    });
}


//--------------------------------------------------------
// the front-end side --> show the list, add buttons & listeners
//--------------------------------------------------------
function show_tours(data) {
    
    cPrev = -1;
        if(j!= 0){
                document.getElementById("tours").innerHTML=" ";

        }
        let str=''
          
        str+="<table id=\"sortable\"><tr ><th onclick=\"sortTable(0)\" >id</th><th  onclick=\"sortTable(1)\">start day</th><th onclick=\"sortTable(2)\" >duration</th><th onclick=\"sortTable(3)\">price</th><th >sites</th><th >cupons</th><th >update</th><th>delete</th><th></th></tr>"
         
        siteObj = Object.keys(data).map(key => data[key]);
          
        if(siteObj){
            
            $.each( siteObj, function( key, value ) {
                console.log( key + ": " + value );
            });

             for(var i=0;i<siteObj.length;i++) {
               
                str+="<tr>"
                str += "<td>"+siteObj[i].id+"</td>";
                str += "<td>"+siteObj[i].start_date+"</td>";   
                str += "<td>"+siteObj[i].duration+"</td>"; 
                str += "<td>"+siteObj[i].price+"</td>";   
                
                
                str += "<td><button  id="+siteObj[i].id+"  onclick=\"addSt()\" >sites</button></td>";//
                str += "<td><button id="+siteObj[i].id+" onclick=\"aC()\" >cupons</button></td>";
                str += "<td><button id="+siteObj[i].id+" onclick=\"update('"+siteObj[i].id+"')\">update</button></td>";
                str += "<td><button id="+siteObj[i].id+" onclick=\"delTour('"+siteObj[i].id+"')\">Delete</button></td>";                str+="</tr>"
               
            }}
         str+="</table>";
           
            str+="</tbody>";
           
           
          document.getElementById("tours").innerHTML=str;
    
        
    j++;
}


function update(t_id) {

    var modal = document.getElementById("myModal4");
    var span = document.getElementsByClassName("close4")[0];

    // open the modal
    span.onclick = function() {
        modal.style.display = "none";
    }
    modal.style.display = "block";

    // client-side form validation of the inputes
     updateValidation();
    // process the form
    $("#update_tour_form").submit(function(event) {
     
        //  if (!$("#update_tour_form").valid()) return;
        // get the variables from the form fileds
        var details = getFormVariablesUpdate();
        // ajax request --> add tour

        updateTour( details);
        modal.style.display = "none";
        event.preventDefault();
    });
}
function aC() {
    window.location.href = "/aC";
}

function addSt() {
    window.location.href = "/aS";
}

function sortTable(c) {
  
    rows =( document.getElementById("sortable").rows.length ); // num of rows
    
    columns =( document.getElementById("sortable").rows[0].cells.length)-1 ; // num of columns
    
    arrTable = [...Array(rows)].map(e => Array(columns)); // create an empty 2d array

    for (ro=0; ro<rows; ro++) { // cycle through rows
        for (co=0; co<columns; co++) { // cycle through columns
            // assign the value in each row-column to a 2d array by row-column
            arrTable[ro][co] = document.getElementById("sortable").rows[ro].cells[co].innerHTML;//
            
        }
    }

    th = arrTable.shift(); // remove the header row from the array, and save it
    
    if (c != cPrev) { // different column is clicked, so sort by the new column
        arrTable.sort(
            function (a, b) {
                if (a[c] === b[c]) {
                    return 0;
                } else {
                    return (a[c] < b[c]) ? -1 : 1;
                }
            }
        );
    } else { // if the same column is clicked then reverse the array
       arrTable.reverse();
    }
    
    cPrev = c; // save in previous c

    arrTable.unshift(th); // put the header back in to the array

    // cycle through rows-columns placing values from the array back into the html table
    for (ro=0; ro<rows; ro++) {
        for (co=0; co<columns; co++) {
            document.getElementById("sortable").rows[ro].cells[co].innerHTML = arrTable[ro][co];
        }
    }
}


function updateTour(tourId)
{
    $.ajax({
        type: 'PUT', // define the type of HTTP verb we want to use (POST for our form)
        url: '/tours/'+  details[0], // the url where we want to POST
        contentType: 'application/json',
        data: JSON.stringify({
            "id": details[0],
            "start_date": details[1],
            "duration": details[2],
            "price": details[3],
        }),
        processData: false,
        encode: true,
        success: function(data, textStatus, jQxhr) {
            console.log(data);
            document.getElementById("tour_form").reset(); //reset the form
            get_tours();
        },
        error: function(jqXhr, textStatus, errorThrown) {
            alert(errorThrown);
        }
    });
}

///-----------------------------------------------------------------
  $.validator.addMethod("space", function (value, element) {//check if space not exist in the input
    if (value.indexOf(' ') >= 0) {return false; }
    else { return true;}
  });
//----------------------------------------------------------------




