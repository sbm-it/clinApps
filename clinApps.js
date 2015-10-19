console.log('clinApps.js loaded')

clinApps= function(){
    // ini
    clinApps.setMsg()
    clinApps.hashJobs()
}

clinApps.setMsg=function(){
    if(typeof(clinAppsMsg)==="object"){
        clinAppsMsg.innerHTML='<input id="showMsgType" type="button" value="-" style="background:rgba(0,0,0,0);border-width:0"> &nbsp; <input id="radioOperations" type="radio"><span id="spanOperations"> Operations &nbsp;</span> <input id="radioResearch" type="radio"><span id="spanResearch"> Research &nbsp;</span> <input id="radioDSRIP" type="radio"><span id="spanDSRIP"> DSRIP &nbsp;</span> <input id="radioPatient" type="radio"><span id="spanPatient"> Patient &nbsp;</span> <span id="msgSpan" hidden="true"> loading ...</span>'
        // wiring events
        showMsgType.onclick=function(){
            if(showMsgType.value=='-'){
                showMsgType.value='+'
                showMsgType.style.color="blue"
                radioOperations.hidden=spanOperations.hidden=radioResearch.hidden=spanResearch.hidden=radioResearch.hidden=radioDSRIP.hidden=spanDSRIP.hidden=radioPatient.hidden=spanPatient.hidden=true
                msgSpan.hidden=false
            }else{
                showMsgType.value='-'
                showMsgType.style.color="black"
                radioOperations.hidden=spanOperations.hidden=radioResearch.hidden=spanResearch.hidden=radioResearch.hidden=radioDSRIP.hidden=spanDSRIP.hidden=radioPatient.hidden=spanPatient.hidden=false
                msgSpan.hidden=true
            }
        }
        showMsgType.click()
    }
}

clinApps.hashJobs=function(suf){ // perform jobs submited within the hash, i.e. for suf='jobs'
    if(!suf){suf='job'} // look for jobs in ./job/
    var jobs = location.hash.match(RegExp(suf+'=[^&]+','g'))
    if(jobs){
        jobs.forEach(function(Ji){
            // location.hash=location.hash.replace(Ji,'') // remove job from hash
            var job=Ji.split('=')[1]+'.js'
            if(true){ // this is a great place to further restrict allowed origins
                console.log('loading job "'+job+'"...')
                var s = document.createElement('script')
                s.src=suf+'/'+job // note one can load from different subdiretories
                document.head.appendChild(s)
                /*
                $.getScript('job/'+job)
                 .then(
                    function(res){
                        //console.log('... "'+job+'" loaded:')
                    },function(err){
                        //console.log('... "'+job+'" NOT loaded:')
                    }
                 )
                 */
                 
            }
        })
        

    }
        
}

// ini
$( document ).ready(function() {
    clinApps()
});

//console.log('Hi Maggie')
