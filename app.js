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

app.get('/', function(req, res) {
    res.render('index')
})

const Twitter = new TwitterStream(apikey, false);
Twitter.stream('statuses/filter', {
    track: '#psvaja'
})

Twitter.pipe(fs.createWriteStream('tweets.json'));

Twitter.on('connection success', function (uri) {
    console.log('connection success', uri);
})

Twitter.on('connection aborted', function () {
    console.log('connection aborted');
})

Twitter.on('connection error network', function (error) {
    console.log('connection error network', error);
})

Twitter.on('connection error unknown', function (error) {
    console.log('connection error unknown', error);
    Twitter.close();
})

Twitter.on('connection rate limit', function (httpStatusCode) {
    console.log('connection rate limit', httpStatusCode);
})

Twitter.on('connection error http', function (httpStatusCode) {
    console.log('connection error http', httpStatusCode);
})

app.listen(port, function () {
    console.log('server is online at port ' + port)
})