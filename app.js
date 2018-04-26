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

        res.render('tweet', {
            allTweets: tweets.statuses, 
            clubs: clubs,
            hashTweet: hashTweet
        })
    })
})


http.listen(port, function () {
    console.log('server is online at port ' + port)
})