(function(){

    var socket = io()
    
    const homeTeam = document.querySelector('.home'),
        awayTeam = document.querySelector('.away')

    homeTeam.addEventListener('change', function() {
        const hashtag = "#" + homeTeam.value + awayTeam.value
        socket.emit('hashtag')
    })

    awayTeam.addEventListener('change', function () {
        const hashtag = "#" + homeTeam.value + awayTeam.value
        socket.emit('hashtag', hashtag)
    })

})()