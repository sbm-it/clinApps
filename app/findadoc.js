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
        //var h = '<table>'
        //h += '<tr><td><h4 style="color:maroon">Speciality</h4></td><td id="speciality"><select id="specialitySelect"></select></td></tr>'
        //h += '<tr><td><h4 style="color:maroon">Insurance</h4></td><td id="insurance">...</td></tr>'
        //h += '<tr><td><h4 style="color:maroon">Location</h4></td><td id="location">...</td></tr>'
        //h += '</table>'
        var h = '<h4 style="color:maroon"><input type="checkbox" id="specialityCheck"> Speciality <select id="specialitySelect"></select></h4>'
        h += '<h4 style="color:maroon"> <input type="checkbox" id="insuranceCheck"> Insurance <select id="insuranceSelect"></select></h4>'
        h += '<h4 style="color:maroon"> <input type="checkbox" id="distanceCheck"> By distance to Zip <input id="locationZip" size=5 style="color:navy"> <button id="locationCurrent" style="color:red">current</button></h4><span id="currentFormatedAddress"></span>'
        h += '<p id=listDocsHere></p><p>max :<input size=3 value=20 id="nMaxDocs">'
        appSpace.innerHTML=h
        var listDocs=function(docs){
            //console.log(docs)
            listDocsHere.innerHTML='' // clear listDocs
            var nMax=parseInt(nMaxDocs.value)
            var n = Math.min(docs.length,nMax)
            for(var i=0 ; i<n ; i++){
                var li = document.createElement('p')
                li.i=docs[i].i // .i is the index in the full set
                li.innerHTML=(i+1)+'. '+docs[i].LASTNAME+', '+docs[i].FIRSTNAME+' ('+docs[i].SPECIALTY.replace(/<br \/>$/,'').replace(/<br \/>/g,', ')+') '
                var sp = document.createElement('span')
                sp.textContent='+'
                sp.style.color='blue'
                sp.onclick=function(){
                    if(this.textContent=='+'){
                        doc=clinApps.app.findadoc.docs[parseInt(this.parentElement.i)]
                        this.textContent='-'
                        var docDiv = document.createElement('div') // doc div
                        var im = document.createElement('img')
                        jsonpCallback=function(x){ // this is soooo wrong :-(
                            im.src='http://www.stonybrookmedicine.edu/webfiles/physician-pics/'+x[0].PICTURE
                            if(im.src=='http://www.stonybrookmedicine.edu/webfiles/physician-pics/placeholder.png'){
                                setTimeout(function(){
                                    im.hidden=true
                                },2000)
                            }
                        }
                        $.getScript('http://findadoc.uhmc.sunysb.edu/fadp/fadprofile-drupal.asp?pid='+doc.ID)
                        //if(doc.PICTURE.match('http')){
                        //    im.src=doc.PICTURE
                        //}else{
                        //    im.src='http://www.stonybrookmedicine.edu/webfiles/physician-pics/'+doc.PICTURE
                        //}
                        docDiv.appendChild(im)
                        $('<p>working on formating all of this:</p>').appendTo(docDiv)
                        this.appendChild(docDiv)
                        
                        var pre=document.createElement('pre')
                        pre.innerHTML=JSON.stringify(JSON.stringify(doc,null,3)).replace(/\\n/g,'<br />').replace(/\\/g,'').slice(1,-1)
                        this.appendChild(pre)
                    }else{
                        this.textContent='+'
                    }
                    4
                }
                li.appendChild(sp)
                listDocsHere.appendChild(li)

            }
            return docs
        }
        var trimDocs=function(){ // queries results and redisplays them
            var docs = clinApps.app.findadoc.docs
            docs.forEach(function(d,i){docs[i].i=i}) // keeping index
            var changed=false
            if(specialityCheck.checked){
                docs=docs.filter(function(d){
                    return d.SPECIALTY.match(specialitySelect.value)
                })
                changed=true
            }
            if(insuranceCheck.checked){
                docs=docs.filter(function(d){
                    if(!d.INSURANCE){
                        return false
                    } else{
                        return d.INSURANCE.match(insuranceSelect.value)
                    }                
                })
                changed=true
            }
            if(distanceCheck.checked&&(clinApps.geo)){ //resort by distance to current geo
                // calculate the distance of each doc to the target clinAppls.geo.location
                d=[]
                docs.forEach(function(doc,i){ // at latitude 40 ...
                    if(doc.geoloc){
                        d[i]=Math.sqrt(Math.pow(63*(doc.geoloc.lat-clinApps.geo.location.lat),2)+Math.pow(63*(doc.geoloc.lng-clinApps.geo.location.lng),2))
                    }else{
                        d[i]=1000 // indicates NaN really
                    }
                })
                dd=jmat.sort(d)
                docsorted=[]
                docs.forEach(function(di,i){
                    docsorted[i]=docs[dd[1][i]]
                    docsorted[i].d=dd[0][i]
                })
                docs=docsorted
                4
            }
            if(changed){
                listDocs(docs)
            }
            //return docs
        }
        trimDocs() // first run
        nMaxDocs.onkeyup=function(evt){
            if(evt.keyCode==13){
                trimDocs()
            }
        }
        specialityCheck.onclick=specialitySelect.onchange=insuranceCheck.onclick=insuranceSelect.onchange=insuranceCheck.onclick=distanceCheck.onclick=trimDocs
        setTimeout(function(){
            specialityCheck.click()
        },100)

        // GEO
        var getGeo=function(q){
                $.getJSON('https://maps.googleapis.com/maps/api/geocode/json?'+q).then(function(x){
                    if(x.status==="OK"){
                        x.results.forEach(function(xi){
                            if((xi.types.join()=="street_address")||(x.results.length==1)){
                                currentFormatedAddress.textContent=xi.formatted_address
                                currentFormatedAddress.style.color='green'
                                clinApps.geo={location:xi.geometry.location}
                                xi.address_components.forEach(function(xii){
                                    if(xii.types.join()=="postal_code"){
                                        clinApps.geo.zip=xii.long_name
                                        locationZip.value=xii.long_name
                                    }
                                })
                                if(distanceCheck.checked){trimDocs()}
                                //console.log(xi)
                            }
                        })
                        4
                    }
                    4
                })
        }


        // GEO




        //https://maps.googleapis.com/maps/api/geocode/json?address=11790
        locationZip.onkeyup=function(evt){
            if(this.value.length==5){
                getGeo('address='+this.value)
            }
        }
        locationCurrent.onclick=function(){
            locationCurrent.disabled=true
            locationCurrent.style.color='orange'
            navigator.geolocation.getCurrentPosition(function(g){
                locationCurrent.style.color='green'
                clinApps.geo=g
                locationCurrent.disabled=false
                getGeo('latlng='+clinApps.geo.coords.latitude+','+clinApps.geo.coords.longitude)
            })
        }
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
                return str.replace(/<br \/>$/,'')
            }
        }
        // Index Speciality first
        setTimeout(function(){
            var allVals=[]
            clinApps.app.findadoc.tab.SPECIALTY.forEach(function(c){
                c.split('<br />').forEach(function(ci){
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
        // Index Insurance
        setTimeout(function(){
            var allVals=[]
            clinApps.app.findadoc.tab.INSURANCE.forEach(function(v){
                if(v){
                var vv = v.replace('<li>','').replace(/<\/li>$/,'').split('</li><li>')
                    vv.forEach(function(vi){
                        allVals.push(trailBlank(vi))
                    })
                }        
            })
            clinApps.app.findadoc.Ind.Insurance=jmat.unique(allVals).sort()
            clinApps.app.findadoc.Ind.Insurance.forEach(function(s){
                var op = document.createElement('option')
                op.textContent=s
                insuranceSelect.appendChild(op)
            })

            4
        },20)


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
                if(!xi.PICTURE.match(/\.jpg/i)){
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




log=function(x){if(!x){x=this};console.log(x)}
