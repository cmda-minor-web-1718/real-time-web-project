const express = require('express')
const app = express() 
const nodemon = require('nodemon')
const ejs = require('ejs')

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
    
    client.get('search/tweets', { q: '#azfey', result_type: 'recent', count: "30" }, function (error, tweets, response) {

        res.render('index', { 
            allTweets: tweets.statuses, 
            clubs: clubs
        })
    })
})

io.on('connection', function(socket) {
    socket.on('hashtag', function(hashtag) {
        console.log(hashtag)
    })
})

http.listen(port, function () {
    console.log('server is online at port ' + port)
})