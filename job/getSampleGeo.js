console.log('getSampleGeo.js loaded')

// get JSON data

//$.getJSON('clinApps/sample%20data/physicianListing.json')
$.getJSON('https://sbu-bmi.github.io/clinApps/sample%20data/physicianListing.json')
 .then(function(x){
     xx=x
     // adr = xi.address1+', '+xi.address2+', '+xi.city+', '+xi.state+xi.zipcode
     // 'https://maps.googleapis.com/maps/api/geocode/json?address='+adr+'&key=API_KEY''
     x.forEach(function(xi,i){
         //var adr = xi.address1+', '+xi.address2+', '+xi.city+', '+xi.state+xi.zipcode
         var adr = xi.address1+', '+xi.address2+', '+xi.city+', '+xi.state+xi.zipcode
         if(true){//i<20){       
         setTimeout(
            function(){
                console.log(i,adr)
                jQuery.getJSON('https://maps.googleapis.com/maps/api/geocode/json?address='+adr)
                 .then(function(g){                           
                             x[i].geocode=g
                             console.log(i,g)
                             if(xx[i].geocode.status==='OK'){
                               // clear flag
                             } else {
                                    var adr = xi.address2+', '+xi.city+', '+xi.state+xi.zipcode
                                    setTimeout(function(){
                                       console.log('redoing: '+adr)
                                       jQuery.getJSON('https://maps.googleapis.com/maps/api/geocode/json?address='+adr)
                                        .then(function(g){
                                            x[i].geocode=g
                                            console.log(i,'RE-DONE with '+adr,g)
                                        })
                                    
                                    },100)
                             }
                             
                 })
                
            },300*i
         )
         }
     })

 })

// When it's dne do something like
// jmat.saveFile(JSON.stringify(xx,null,3),'physicianListingGEO.json')