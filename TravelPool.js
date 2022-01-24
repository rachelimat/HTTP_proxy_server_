var countriess;
var bool=0;
 var myTable;
 //////////////////////////////////////////////////////
function loading(){
   
       
      $.ajax({
          type: "GET",
          url:'https://travelbriefing.org/countries.json',
          success: (data) => {
              
          countriess =data ;
          console.log(countriess);
          },
          error: (err)=> {
          alert(err.status);
          }
      });
 } 
 /////////////////////////////////////////////////
    window.addEventListener("load", function(windowLoadE) {
        var p, letter, button, holder;
        holder = document.getElementById("buttonsHolder");
        for (var i = 65; i <= 90; i++) {
           if (i == 65 ) {
              p = document.createElement("p");
           }
           letter = String.fromCharCode(i);
           button = document.createElement("button");
           button.innerHTML = letter;
           button.setAttribute("data-letter", letter);
           button.onclick = function(e) {
             
              
              setLetter(this.getAttribute( "data-letter" ) );
              // document.getElementById( "show" ).innerHTML=""; 
             
           };
           p.appendChild(button);
           if ( i == 90) {
              holder.appendChild(p);
           }
        }
    }); 
   
    $(document).ready(function(){
    
   $.ajax('get_current_date.php',{
            success: function(data,status,xhr){
                document.getElementById('myDate').innerHTML=data
            },
            error: function(jqXhr,textStatus,errorMessage)
            {
                $('p').append('Error',errorMessage)
            }
    }); 
      
 loading();  
});
    
     /////////////////////////////////////////////////
      function setLetter(letter) {
        if(bool!==0){
            myTable.remove();
            document.getElementById( "show" ).innerHTML=""; 
            
        }
       bool=1;
       let findCharCountries =countriess.filter((country) =>country.name.startsWith(letter));
   myTable = document.createElement("table");
         var row = myTable.insertRow(), cell;
       
         show.innerHTML=" ";
        var btn;
        var perrow = 2;
        var www;
        
       for(var t=0;  t<findCharCountries.length ;t++) {
           
           for(var s=0;s<2;s++){
           //  var td document.createElement('TD');
           
              if(s==0) {
                cell = row.insertCell();
                 cell.innerHTML = findCharCountries[t].name;
             }
             
          if(s==1) {
       
              cell = row.insertCell();
              btn=document.createElement('button');
              row.appendChild(btn);
              btn.innerHTML="click for datalies";
              
               btn.setAttribute('url',findCharCountries[t].url);////
               
              btn.addEventListener("click",function(){
                document.getElementById( "show" ).innerHTML=""; 
              moreDetails( this.getAttribute( "url" ) ) ;  
                 
              });
             // cell.innerHTML = findCharCountries[t].url;
                
               row = myTable.insertRow();
             }
        


        document.getElementById("container").appendChild(myTable); 
    }
       } 
      }
///////////////////////////////////////////////////////////////////////////
 
 function moreDetails (www){
   $.ajax({
          type: "GET",
          url:www,
          success: (data) => {
           show(data);
        },
          error: (err)=> {
          alert(err.status);
          }
      });   
 } 
////////////////////////////////////////////////////////////////////////
function  show(data){
  
        document.getElementById( "show" ).innerHTML=""; 
        let string;
  // show.innerHTML=" ";
    const dataJ=JSON.parse(data);
    
    // document.getElementById( "show" ).innerHTML=ttt ;
   string = "<b><u>Languages:</u></b>";
    for(let f=0;f<dataJ.language.length;f++){
        if(dataJ.language.language!== null){
          string=string.concat(dataJ.language[f].language)  ;
          }
          if(f<dataJ.language.length-1){
          string=string.concat(" , ")  ;
          
          }
    }
     string=string.concat("<br> <b><u>continent code:</u></b>");
     if(dataJ.names.continent!==null){
       string=string.concat(" "+dataJ.names.continent+"<br>")  ; 
     }
      else{ 
         string=string.concat("<br>")  ;  
      } 
      string=string.concat("<br> <b><u>currency:</u></b><br>");
      if(dataJ.currency.name !==null){
       string=string.concat("<b>name: </b>"+dataJ.currency.name+"<br>")  ; 
     }
      else{ 
        string=string.concat("<b>name: </b> <br>")  ; 
      }
      if(dataJ.currency.symbol !==null){
       string=string.concat("<b>symbol: </b>"+dataJ.currency.symbol+"<br>")  ; 
     }
      else{ 
        string=string.concat("<b>symbol: </b> <br>")  ; 
      }
      if(dataJ.currency.rate){
       string=string.concat("<b>rate: </b>"+dataJ.currency.rate+"<br>")  ; 
     }
      else{ 
        string=string.concat("<b>rate: </b> <br>")  ; 
      }
   
    var month = new Date();
   var temp=  month.getMonth()+1;//+1
    if(temp ==1) {
        mounthToString= "January";}

    if(temp==2) {
        mounthToString= "February";}

    if(temp==3) {
        mounthToString= "March";}

    if(temp) {
    mounthToString= "April";}

    if(temp==5) {
        mounthToString= "May";}

    if(temp==6) {
        mounthToString= "June";}

    if(temp==7) {
        mounthToString= "July";}

    if(temp==8) {
        mounthToString= "August";}

    if(temp==9) {
        mounthToString= "September";}

    if(temp==10) {
        mounthToString="October";}

    if(temp==11) {
        mounthToString="November";}

    if(temp==12) {
        mounthToString="December";}
   
     if(mounthToString !=undefined && dataJ.weather[mounthToString].tAvg!=null){
      string=string.concat("<b><u>Average temp' to the current month:</u></b>"+dataJ.weather[mounthToString].tAvg+"<br>");
     
    }
     else{
        string=string.concat("<b><u>Average temp' to the current month:</u></b> <br>");  
     }
     string=string.concat("<b><u>Neighboring Countries:</u></b>"); 
     for(let r=0;r<dataJ.neighbors.length;r++){
         
             if(dataJ.neighbors[r].name!==null){
                string=string.concat(dataJ.neighbors[r].name);  
             }
             if(r< dataJ.neighbors.length -1){
                string=string.concat(dataJ.neighbors[r].name);  
             }
             string=string.concat(" , "); 
             
        }
        string=string.concat("<br> <b><u> Travel Warning:  </u></b>");
   
    if('advise' in dataJ){
      
        if('UA' in dataJ.advise){
             string=string.concat("<br> <b>UA: </b>");
    
      string=string.concat("  "+  dataJ.advise.UA.advise  +"<br>");}
     if('CA' in dataJ.advise){
         string=string.concat("<br> <b>CA: </b>");
     string=string.concat("  "+  dataJ.advise.CA.advise  +"<br>");
         
     }
        
    }
    
     else{
        string=string.concat("<br>");  
     }
     
    
    document.getElementById( "show" ).innerHTML=string; 
    show.innerHTML=string;
    }
    

/////////////////////////////////////////////////////////////////////////

 




















