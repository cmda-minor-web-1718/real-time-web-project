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
    consumer_key: '',
    consumer_secret: '',
    access_token_key: '',
    access_token_secret: ''
})

let tweets = {}

app.get('/', function (req, res) {

    res.render('index', { 
        clubs: clubs
    })
})

app.get('/hashtag', (req, res) => {
    const { home, away } = req.query,
        hashTweet = "#" + req.query.home + req.query.away

    client.get('search/tweets', { q: "#" + req.query.home + req.query.away, result_type: 'recent', count: "30" }, function (error, tweets, response) {

        const newTwitterStream = new twitterStream(apikey, false);
        newTwitterStream.stream('statuses/filter', {
            track: "#" + req.query.home + req.query.away,
        });

        newTwitterStream.on('data', function (obj) {
            const result = JSON.parse(obj)
            io.emit('newTweet', result)
        })


        // Errors

        newTwitterStream.on('connection aborted', function() {
            io.emit('aborted')
        })
        newTwitterStream.on('connection error network', function () {
            io.emit('network')
        })
        newTwitterStream.on('connection error http', function () {
            io.emit('http')
        })
        newTwitterStream.on('connection error unknown', function () {
            io.emit('unknown')
        })
        newTwitterStream.on('data error', function () {
            io.emit('data error')
        })



        io.on('connection', function(socket){
            socket.on('closeStream', function() {
                newTwitterStream.close()
            })
        })

        if(tweets) {
            res.render('tweet', {
                allTweets: tweets.statuses, 
                clubs: clubs,
                hashTweet: hashTweet
            })
        }
    })
})

http.listen(port, function () {
    console.log('server is online at port ' + port)
})