console.log('clinApps.js loaded')

clinApps= function(){
    // ini
    clinApps.setMsg()
}

clinApps.setMsg=function(){
    if(typeof(clinAppsMsg)==="object"){
        clinAppsMsg.innerHTML=' &nbsp; &nbsp; &nbsp; &nbsp; <input type="radio"> Operations &nbsp; <input type="radio"> Research &nbsp; <input type="radio"> Patient centric'
    }
}

// ini
$( document ).ready(function() {
    clinApps()
});
