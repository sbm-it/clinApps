console.log('findadoc.js')

// get physician data

clinApps.app.findadoc={
    fun:{}
}

clinApps.app.findadoc.fun=function(){ // find a doc action
    clinAppsHead.hidden=false
    clinAppsMsg.hidden=false
    msgIcon.className="fa fa-user-md"
    clinApps.msg(clinApps.manif.findadoc.description,'maroon')
    appSpace.innerHTML='loading find-a-doc ... '
    clinApps.localforage('SBMdocs',function(x){
        clinApps.app.findadoc.docs=x
        // assemble UI
        var h = '<table>'
        h += '<tr><td><h4 style="color:maroon">Speciality</h4></td><td id="speciality"><select id="specialitySelect"></select></td></tr>'
        h += '<tr><td><h4 style="color:maroon">Insurance</h4></td><td id="insurance">...</td></tr>'
        h += '<tr><td><h4 style="color:maroon">Location</h4></td><td id="location">...</td></tr>'
        h += '</table>'
        appSpace.innerHTML=h
        // digest data
        clinApps.app.findadoc.tab={}
        var parms = Object.getOwnPropertyNames(clinApps.app.findadoc.docs[0])
        parms.forEach(function(p){
            clinApps.app.findadoc.tab[p]=[]
            clinApps.app.findadoc.docs.forEach(function(d,i){
                clinApps.app.findadoc.tab[p][i]=d[p]
            })            
        })
        // prepare indexes
        clinApps.app.findadoc.Ind={
            Speciality:{},
            Insurance:{},
            Location:{}
        }
        var trailBlank=function(str){ // remove trailing blank
            if(str.slice(-1)==" "){
                return trailBlank(str.slice(0,-1))
            }else{
                return str
            }
        }
        // Index Speciality first
        setTimeout(function(){
            var allVals=[]
            clinApps.app.findadoc.tab.CERT.forEach(function(c){
                c.split('<br>').forEach(function(ci){
                    allVals.push(trailBlank(ci))
                })
            })
            clinApps.app.findadoc.Ind.Speciality=jmat.unique(allVals).sort().slice(1)
            clinApps.app.findadoc.Ind.Speciality.forEach(function(s){
                var op = document.createElement('option')
                op.textContent=s
                specialitySelect.appendChild(op)
            })
            

        },10) 


        


        4
    })
    return true
}()


// extensions on clinApps root

clinApps.app.findadoc.fun=(function(){

    clinApps.getSbmDoctors=function(fun){ // get SBM doctors
        if(!fun){fun=function(){console.log(clinApps.getSbmDoctors.docs)}}
        localforage.getItem('SBMdocs').then(function(docs){
            if(true){
            //if(!docs){
                var url='http://findadoc.uhmc.sunysb.edu/sbmed/jsonp.cfm?thisPage='
                var i = 1
                var docs=[]
                jsonpCallback=function(x){ // ught! this jsonp service doesn't respond to the callback parameter :-('
                    x.forEach(function(xi){
                        docs.push(xi)
                    })
                    i++
                    console.log(i+': '+x.length)
                    clinApps.msg(' loading basic info on '+docs.length+' physicians','red')
                    if(x.length>0){
                        getDoc(i)
                    }else{
                        clinApps.msg(' loaded basic info on '+docs.length+' physicians','green')
                        // loading detailed data for each of them now
                        clinApps.getSbmDoctors.docs=docs
                        var j = 0
                        var funj = function(){ // updates basic info in jth entry of clinApps.getSbmDoctors.docs                     
                            if(j<clinApps.getSbmDoctors.docs.length){
                                j++
                                clinApps.getOneSbmDoc(j-1,funj)
                            }else{ // done updating
                                localforage.setItem('SBMdocs',clinApps.getSbmDoctors.docs).then(function(){
                                    localStorage.setItem('SBMdocs',new Date())
                                    clinApps.msg(' loaded detailed info on '+docs.length+' SBM physicians','green')
                                    fun()
                                })
                            }
                        }
                        clinApps.getOneSbmDoc(j,funj)       
                    }        
                }
                var getDoc=function(i){
                    $.getScript(url+i,function(x){
                        4
                    })
                }
                getDoc(i) // starts here
            }else{
                clinApps.getSbmDoctors.docs=docs
                fun()
            }
        })
    }

    clinApps.getOneSbmDoc=function(i,fun){ // get info on the ith SBM doc
        if(!fun){fun=function(y){console.log(i,y)}}
        var url='http://findadoc.uhmc.sunysb.edu/fadp/fadprofile-drupal.asp?pid='
        var xi = clinApps.getSbmDoctors.docs[i]
        jsonpCallback=function(xj){ // same ugly frozen jsonp callback :-(
            Object.getOwnPropertyNames(xj[0]).forEach(function(p){
                xi[p]=xj[0][p]
                if(xi.PICTURE.match(/\.jpg/i)){
                    xi.PICTURE='http://www.stonybrookmedicine.edu/webfiles/physician-pics/placeholder.png'
                }
                clinApps.getSbmDoctors.docs[i]=xi
            })
            //console.log(i,xi)
            clinApps.msg(i+'/'+clinApps.getSbmDoctors.docs.length+': loading on Dr '+xi.LASTNAME+', '+xi.FIRSTNAME)
            fun(xi)
        }
        if((xi.ID!=='1901')&&(xi.ID!=='1902')&&(xi.ID!=='1865')&&(xi.ID!=='1848')){ // #72 last time I checked
            $.getScript(url+xi.ID)
        }else{
            console.log('see https://github.com/sbm-it/clinApps/issues/2')
            fun(xi)
        }
    }

    clinApps.getSbmDoctors.geocode=function(){ // geocode docs in clinApps.getSbmDoctors.docs
        clinApps.getSbmDoctors.docs.forEach(function(d,i){
            if(d.LOCATION){
                var loc = d.LOCATION.match(/https:\/\/www.google.com\/maps\/place\/[^" ]+/g)
                if(loc){
                    d.mapAddress=loc[0].replace('https://www.google.com/maps/place/','')
                    clinApps.getSbmDoctors.docs[i]=d
                    // get geocode
                    if(true){
                    if(!d.geoloc){
                        $.getJSON('https://maps.googleapis.com/maps/api/geocode/json?address='+d.mapAddress)
                        .then(function(g){
                            console.log('trying:',i,d,g)
                            if(g.status=='OK'){
                                var res=g.results[0]
                                if(res.geometry){
                                    d.geoloc=res.geometry.location
                                    clinApps.getSbmDoctors.docs[i]=d
                                }else{
                                    console.log('no geometry: ',i,d)
                                }
                            }else{
                                console.log('Gmaps error: ',i,g.status)
                                // let's not quit just yet
                                // d.mapAddress.slice(d.mapAddress.indexOf(',')+1)
                                $.getJSON('https://maps.googleapis.com/maps/api/geocode/json?address='+d.mapAddress.slice(d.mapAddress.indexOf(',')+1))
                                 .then(function(g){
                                    console.log('trying again:',i,d,g)
                                    if(g.status=='OK'){
                                        var res=g.results[0]
                                        if(res.geometry){
                                            d.geoloc=res.geometry.location
                                            clinApps.getSbmDoctors.docs[i]=d
                                        }else{
                                            console.log('no geometry: ',i,d)
                                        }
                                    }
                                  })
                                  .fail(function(err){
                                      throw('final failure ',i,d,g)
                                  })
                           }                    
                        })
                        .fail(function(err){
                            console.log('failure',i,d,g)
                        })
                    }else{
                        console.log('done already: ',i)
                    }

                    }                           
                }
            }
        })
    }




    
    var lala = 9
    return true
})()

if(false){
    localforage.getItem('SBMdocs').then(function(x){
        clinApps.getSbmDoctors.docs=x;
        console.log('loaded '+x.length+ 'SBM docs')
        clinApps.getSbmDoctors.geocode()
    })
}

if(false){
    localforage.getItem('SBMdocs')
    .then(function(x){
        clinApps.getSbmDoctors.docs=x;
        console.log('loaded '+x.length+ ' SBM docs')
    })
}

/*
$.getJSON('data/SBMdocs.json',function(x){
    clinApps.msg('Loaded data on '+x.length+' physicians','green')
    var h = '<h3 style="color:maroon">Referrals</h3>'
    h += '<table>'
    h += '<tr><td>Speciality</td id="speciality"><td></td></tr>'
    h += '<tr><td>Insurance</td><td id="insurance"></td></tr>'
    h += '<tr><td>Location</td><td id="location"></td></tr>'
    h += '</table>'
    appSpace.innerHTML=h;
    // containing the code
    (function(docs){
        var tab = {} // table
        var txt = [] // text search
        docs.forEach(function(di,i){
            Object.getOwnPropertyNames(di).forEach(function(p){
                if(!tab[p]){tab[p]=[]}
                tab[p][i]=di[p]
            })
        })


        4
    })(x)


})

*/


