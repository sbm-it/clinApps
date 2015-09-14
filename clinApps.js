console.log('clinApps.js loaded')

clinApps= function(){
    // ini
    clinApps.setMsg()
}

clinApps.setMsg=function(){
    if(typeof(clinAppsMsg)==="object"){
        clinAppsMsg.innerHTML=' &nbsp; <input type="button" value="<"> &nbsp; <input type="radio"> Operations &nbsp; <input type="radio"> Research &nbsp; <input type="radio"> Patient &nbsp; <input type="button" value="<">'
    }
}

// ini
$( document ).ready(function() {
    clinApps()
});
