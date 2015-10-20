console.log('referral.js')

appSpace.innerHTML='loading ... '

// get physitian data

$.getJSON('data/physicianListing.json',function(x){
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