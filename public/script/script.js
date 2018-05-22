(function(){

    const socket = io.connect()

    const homeTeam = document.querySelector('.home'),
        awayTeam = document.querySelector('.away')

    if(homeTeam) {

        const option = awayTeam.querySelector('option:nth-of-type(3)')
        option.setAttribute('selected', 'selected')

        const allOption = document.querySelectorAll('option')
        allOption.forEach(function (option) {
            const classList = option.classList
            if (option.selected) {
                option.parentElement.style.background = 'linear-gradient(to right bottom, ' + classList[0] + ' 50%, ' + classList[1] + ' 50%)'
                option.parentElement.style.textShadow = '0px 0px 5px white'
            }
        })

        homeTeam.addEventListener('change', function() {
            const allOption = document.querySelectorAll('option')
            allOption.forEach(function (option) {
                const classList = option.classList
                if (option.selected) {
                    option.parentElement.style.background = 'linear-gradient(to right bottom, '+ classList[0] + ' 50%, '+ classList[1] + ' 50%)'
                    option.parentElement.style.textShadow = '0px 0px 5px white'
                }
            })
        })

        awayTeam.addEventListener('change', function () {
            const allOption = document.querySelectorAll('option')
            allOption.forEach(function (option) {
                const classList = option.classList
                if (option.selected) {
                    option.parentElement.style.background = 'linear-gradient(to right bottom, ' + classList[0] + ' 50%, ' + classList[1] + ' 50%)'
                    option.parentElement.style.textShadow = '0px 0px 5px white'
                }
            })
        })
    }

    socket.on('newTweet', function(result, track) {
        const tweetList = document.querySelector('.footballTweets'),
            tweet = '@' + result.user.name + ': ' + result.text + " " + result.created_at,
            elP = document.createElement('p')
            elP.innerHTML = tweet
        
        if(tweetList) {
            tweetList.prepend(elP)
        }
    })

    socket.on('nice', function() {
        alert('gaat lekker')
    })

    const back = document.querySelector('a')
    if(back) {
        back.addEventListener('click', function() {
            socket.emit('closeStream')
        })
    }
    if(homeTeam) {
        const button = document.querySelector('input[type=submit]')

        button.addEventListener('click', function(){
            let homeVal = homeTeam.value,
                awayVal = awayTeam.value

            console.log(homeVal + " " + awayVal)
                
            socket.emit('teamVal', homeVal, awayVal)
        })
    }

    const backButton = document.querySelector('.backButton')
    if(backButton) {
        backButton.addEventListener('click', function () {
            socket.emit('backButtonClicked')
        })
    }

    socket.on('joinedRoom', function(room) {
        console.log('Joined room ' + room)
    })

    socket.on('loadStaticTweets', function(allTweets) { 

        const home = getParameterByName('home'),
            away = getParameterByName('away')
            hashTitle = document.querySelector('.hashtag')

        hashTitle.innerHTML = '#' + home + away

        allTweets.forEach(function(tweet) { 
            const elP = document.createElement('p'),
                elSection = document.querySelector('.footballTweets')

            elP.innerHTML = '@' + tweet.user.name + ': ' + tweet.text + " " + tweet.created_at
            elSection.appendChild(elP)
        })
    })

    if (location.href.includes('hashtag')) {

        const home = getParameterByName( 'home' ),
            away = getParameterByName( 'away' )

        console.log( home, away )

        socket.emit('joinRoom', home + away)
    }

    // https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    socket.on('network', function () {
        alert('Er was een probleem met je internet verbinging. Probeer je te verbinden met het internet en probeer het opnieuw')
    })
    socket.on('http', function () {
        alert('De HTTP request ging niet helemaal lekker. Probeer het opnieuw')
    })
    socket.on('unknown', function () {
        alert('We weten niet echt wat er verkeerd ging, sorry :(')
    })
    socket.on('data error', function () {
        alert('Iets ging verkeerd met de ontvangen data van Twitter. Probeer de pagina te herladen.')
    })

    const list = document.querySelector('.footballTweets')
    
    const checkList = function() {
        if (list) {
            const tweets = list.querySelectorAll('p')
            if (tweets.length == 0) {
                const noTweet = 'There are currently no recent tweets. This match is played a long time ago. Please search for a more recent match.'
                const elP = document.createElement('p')
                elP.innerHTML = noTweet
                elP.classList.add('noTweet')
                list.appendChild(elP)
            }
        }
    }

    setTimeout(checkList, 1000)

})()