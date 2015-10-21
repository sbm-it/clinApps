console.log('clinApps.js loaded')

clinApps= function(){
    // ini
    clinApps.loadApps()
    clinApps.msg('loading apps ...')
    clinApps.getHash()
}
clinApps.app={} // store app specific material here

// plain message writter
clinApps.msg=function(txt,clr){
    if(!clr){clr='blue'}
    clinAppsMsg.style.color=clr
    clinAppsMsg.innerHTML='<i class="fa fa-home" id="msgIcon" style="font-size:50px;color:maroon" onclick="clinApps.loadApps()"></i>&nbsp;&nbsp;'+txt
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
    if(document.getElementById('msgIcon')){
        msgIcon.className="fa fa-home"
    }    
    appSpace.innerHTML='' // clean it first
    // load json manifest
    $.getJSON('app/apps.json',function(x){
        x.forEach(function(xi){
            clinApps.assembleApp(xi)
        })
        clinApps.msg('list of subscribed Apps','green')
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

clinApps.getJSON=function(uri,fun){ // try localfrage first, if it fails, it tries localforage/
    
}

// ini
$( document ).ready(function() {
    clinApps()
});

// MIS

//done=function(x){console.log('loaded '+x.length)}
