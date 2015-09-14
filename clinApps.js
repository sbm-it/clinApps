console.log('clinApps.js loaded')

clinApps= function(){
    // ini
    clinApps.setMsg()
}

clinApps.setMsg=function(){
    if(typeof(clinAppsMsg)==="object"){
        clinAppsMsg.innerHTML=' &nbsp; <input id="arrowType" type="button" value="<" style="background:rgba(0,0,0,0);border-width:0"> &nbsp; <input id="radioOperations" type="radio"><span id="spanOperations"> Operations &nbsp;</span> <input id="radioResearch" type="radio"><span id="spanResearch"> Research &nbsp;</span> <input id="radioPatient" type="radio"><span id="spanPatient"> Patient &nbsp;</span> <input id="arrowLogin" type="button" value="<" style="background:rgba(0,0,0,0);border-width:0">'
    }
}

// ini
$( document ).ready(function() {
    clinApps()
});
