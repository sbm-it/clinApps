console.log('info.js loaded')

msgIcon.className="fa "+clinApps.manif.info.fa

clinApps.app.info={
    fun:{}
}

clinApps.app.info.fun=(function(){
    appSpace.innerHTML='loading info ... '
    var h = '<h3 style="color:maroon">About</h3>'
    h += '<p style="color:navy">As part of a new "mobile-first" technology development initiative, <a href="http://stonybrookmedicine.edu/" target="_blank">Stony Brook Medicine</a> is developing this experimental App Store. In other words, don\'t take us seriously just yet :-).</p>'
    h += '<h3 style="color:maroon">How to set it in your device</h3>'
    h += 'This experiment seeks to assess the cross-platform use of HTML5 Apps, very much along the same broader lines of <a href="http://smarthealthit.org/smart-on-fhir/" target="_blank">SMART</a>.'
    appSpace.innerHTML=h
    return true
})()