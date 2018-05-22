const express = require('express')
const app = express() 
const nodemon = require('nodemon')
const ejs = require('ejs')
const twitterStream = require('twitter-stream-api')

const apikey = require('./apikey')
const clubs = require('./clubs')
const Twitter = require('twitter')

const http = require('http').Server(app);
const io = require('socket.io')(http)

const port = 3000

app.set('view engine', 'ejs')
app.use(express.static('public'))

const client = new Twitter({
    consumer_key: 'KoXoTAfrg0VSj9RcjqKas4MK9',
    consumer_secret: 'vSPL4reVQzSpJ7gfasmh47IG4nmXFn4Avh3MXFquZEnV0Zusj3',
    access_token_key: '129562240-TWMiAol6hMV1pCVBPdfTo4olz6cdnGkrX7lJ1zcv',
    access_token_secret: '0daqhe9BCeeelvOgjcYgAaaXsQ1MfcUNlNp8wOaMJ1dEW'
})

let tweets = {}

app.get('/', function (req, res) {

    res.render('index', { 
        clubs: clubs
    })
})

app.get('/hashtag', function (req, res) {

    res.render('tweet' )

})










io.on('connection', function (socket) {

    socket.on('joinRoom', function( room ) {
        console.log(room)
        socket.join(room)
        socket.in(room).emit('joinedRoom', room)
    })

    socket.on('teamVal', function (homeVal, awayVal) {

        let room = '#' + homeVal + awayVal,
            home = homeVal,
            away = awayVal

        console.log('#' + home + away)

        socket.on('backButtonClicked', function () {
            
        })

        //         client.get('search/tweets', { q: room, result_type: 'recent', count: "30" }, function (error, tweets, response) {
        //             if (tweets) {
        //                 res.render('tweet', {
        //                     allTweets: tweets.statuses, 
        //                     clubs: clubs,
        //                     hashTweet: room
        //                 })
        //             }

        //             const newTwitterStream = new twitterStream(apikey, false);
        //             newTwitterStream.stream('statuses/filter', {
        //                 track: room
        //             })

        //             newTwitterStream.on('data', function (obj) {
        //                 const result = JSON.parse(obj)
        //                 io.emit('newTweet', result)
        //             })
        //         })
        //     })
        // })
    })
})









    



    //     // Errors

    //     newTwitterStream.on('connection aborted', function() {
    //         io.emit('aborted')
    //     })
    //     newTwitterStream.on('connection error network', function () {
    //         io.emit('network')
    //     })
    //     newTwitterStream.on('connection error http', function () {
    //         io.emit('http')
    //     })
    //     newTwitterStream.on('connection error unknown', function () {
    //         io.emit('unknown')
    //     })
    //     newTwitterStream.on('data error', function () {
    //         io.emit('data error')
    //     })


http.listen(port, function () {
    console.log('server is online at port ' + port)
})