console.log('clinApps.js loaded')

clinApps= function(){
    // ini
    clinApps.loadApps()
    //clinApps.msg('loading apps ...')
    clinApps.getHash()
    //clinAppsMsg.hidden=true
}
clinApps.app={} // store app specific material here

// plain message writter
clinApps.msg=function(txt,clr){
    if(!clr){clr='maroon'}
    clinAppsMsg.style.color=clr
    clinAppsMsg.innerHTML=txt
}

// load apps
clinApps.loadApps=function(){
    //if(document.getElementById('msgIcon')){
    msgIcon.className="fa fa-home"
    clinApps.msg('SBM App Store')
    //} 
    appSpace.innerHTML='' // clean it first
    // load json manifest
    $.getJSON('app/apps.json',function(x){
        clinApps.manif={}
        x.forEach(function(xi,i){
            clinApps.manif[xi.name]=xi
            clinApps.assembleApp(xi)
        })
        //clinApps.msg('SBM appstore','green')
        clinAppsHead.hidden=false
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

clinApps.localforage=function(uri,fun){ // try localforage first, if it fails, it tries localforage/
    if(!fun){fun=function(x){console.log('locaforaged:',x)}}
    localforage.getItem(uri).then(function(x){
        if(!x){
            $.getJSON('localforage/'+uri+'.json')
             .then(function(x){
                 console.log('loading '+uri+' and caching from localforage/'+uri+'.json')
                 localforage.setItem(uri,x)
                    .then(function(x){
                        console.log('saved '+x.length)
                        fun(x)
                    })
            })
        }else{
            console.log('loading '+uri+' from cache')
            fun(x)
        }
    })
}

// ini
$( document ).ready(function() {
    clinApps()
});

// MIS

//done=function(x){console.log('loaded '+x.length)}
