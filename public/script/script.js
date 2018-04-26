(function(){

    const socket = io()

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
            tweet = result.user.name + " @" + result.user.screen_name + ": " + result.text + " " + result.created_at,
            elP = document.createElement('p')
            elP.innerHTML = tweet
        
        tweetList.prepend(elP)
    })

    const list = document.querySelector('.footballTweets')
    if(list) {
        const tweets = list.querySelectorAll('p')
        console.log(tweets)
        if (tweets.length == 0) {
            const noTweet = 'There are currently no recent tweets. This match is played a long time ago. Please search for a more recent match.'
            const elP = document.createElement('p')
            elP.innerHTML = noTweet
            elP.classList.add('noTweet')
            list.appendChild(elP)
        }
    }

})()