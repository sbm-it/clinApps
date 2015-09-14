console.log('getSampleGeo.js loaded')

// get JSON data

$.getJSON('/sample%20data/physicianListing.json')
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

4