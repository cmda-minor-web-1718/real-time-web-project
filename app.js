const http = require('http')
const express = require('express')
const nodemon = require('nodemon')
const ejs = require('ejs')
const TwitterStream = require('twitter-stream-api')
const fs = require('fs')
const apikey = require('./apikey')

const app = express()

const port = 3000

app.set('view engine', 'ejs')
app.use(express.static('public'))

const Twitter = new TwitterStream(apikey, false);
Twitter.stream('statuses/filter', {
    follow: '2902821'
})

Twitter.pipe(fs.createWriteStream('tweets.json'));

app.get('/', function (req, res) {
    res.render('index', { tweets: tweetFile })
})

Twitter.on('connection success', function (uri) {
    console.log('connection success', uri);
})

Twitter.on('connection success', function (uri) {
    console.log('connection success', uri);
})

Twitter.on('connection aborted', function () {
    console.log('connection aborted');
});

Twitter.on('connection error network', function (error) {
    console.log('connection error network', error);
});

Twitter.on('connection error stall', function () {
    console.log('connection error stall');
});

Twitter.on('connection error http', function (httpStatusCode) {
    console.log('connection error http', httpStatusCode);
});

Twitter.on('connection error unknown', function (error) {
    console.log('connection error unknown', error);
    Twitter.close();
});

app.listen(port, function () {
    console.log('server is online at port ' + port)
})