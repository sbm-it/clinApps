console.log('clinApps.js loaded')

clinApps= function(){
    // ini
    clinApps.loadApps()
    clinApps.msg('loading apps ...')
    clinApps.getHash()
}

// plain message writter
clinApps.msg=function(txt,clr){
    if(!clr){clr='blue'}
    clinAppsMsg.style.color=clr
    clinAppsMsg.innerHTML='&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+txt
    /*
    var i=0,t=5
    clinApps.msg.int = setInterval(function(){
        if(i<txt.length)
        clinAppsMsg.textContent+=txt[i]
        i++
    },t)
    setTimeout(function(){
        clearInterval(clinApps.msg.int)
    },t*txt.length*2)
    */
}

// load apps
clinApps.loadApps=function(){
    appSpace.innerHTML='' // clean it first
    // load json manifest
    $.getJSON('app/apps.json',function(x){
        x.forEach(function(xi){
            clinApps.assembleApp(xi)
        })
    })
}

// load jobs
clinApps.getHash=function(){
    if(location.hash.length>0){
        clinApps.getScript(location.hash.slice(1))
    }
}

clinApps.assembleApp=function(x){
    //var 
    img = document.createElement('img')
    appSpace.appendChild(img)
    img.src=x.icon
    img.width=100
    img.onclick=function(){
        clinApps.getScript(x.onclick)
        //$.getScript(x.onclick)
        clinApps.msg(x.description,'green')
    }
    
}

clinApps.getScript=function(src){ // like $.getScript but loads it into the head
    var s = document.createElement('script')
    s.src=src
    document.head.appendChild(s)
}

clinApps.getSbmDoctors=function(fun){ // get SBM doctors
    if(!fun){fun=function(){console.log(clinApps.getSbmDoctors.docs)}}
    localforage.getItem('SBMdocs_1').then(function(docs){
        if(true){
        //if(!docs){
            var url='http://findadoc.uhmc.sunysb.edu/sbmed/jsonp.cfm?thisPage='
            var i = 1
            var docs=[]
            jsonpCallback=function(x){
                x.forEach(function(xi){
                    if(xi.PICTURE==="NONE"){
                        xi.PICTURE='http://www.stonybrookmedicine.edu/webfiles/physician-pics/placeholder.png'
                    }else{
                        xi.PICTURE='http://www.stonybrookmedicine.edu/webfiles/physician-pics/'+xi.PICTURE
                    }                    
                    docs.push(xi)
                })
                i++
                console.log(i+': '+x.length)
                clinApps.msg(' loading info on '+docs.length+' physicians','red')
                if(x.length>0){
                    getDoc(i)
                }else{
                    clinApps.msg(' loaded info on '+docs.length+' physicians','green')
                    clinApps.getSbmDoctors.docs=docs
                    localforage.setItem('SBMdocs',clinApps.getSbmDoctors.docs).then(function(){
                        localStorage.setItem('SBMdocs',new Date())
                        fun()
                    })
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

// ini
$( document ).ready(function() {
    clinApps()
});

/*
Notes:

opt=&ins=&loc=&lang=29&gen=&nm=&cn=&zip=&radius=
opt=&ins=&loc=&lang=29&gen=&nm=&cn=&zip=&radius=

*/