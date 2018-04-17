const http = require('http')
const express = require('express')
const nodemon = require('nodemon')
const ejs = require('ejs')
const TwitterStream = require('twitter-stream-api')
const fs = require('fs')

const app = express()

const port = 3000

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', function(req, res) {
    res.render('index')
})

const keys = {
    consumer_key: "KoXoTAfrg0VSj9RcjqKas4MK9",
    consumer_secret: "vSPL4reVQzSpJ7gfasmh47IG4nmXFn4Avh3MXFquZEnV0Zusj3",
    token: "129562240-TWMiAol6hMV1pCVBPdfTo4olz6cdnGkrX7lJ1zcv",
    token_secret: "0daqhe9BCeeelvOgjcYgAaaXsQ1MfcUNlNp8wOaMJ1dEW"
};

const Twitter = new TwitterStream(keys, false);
Twitter.stream('statuses/filter', {
    track: '#psvaja'
});

Twitter.pipe(fs.createWriteStream('tweets.json'));

Twitter.on('connection success', function (uri) {
    console.log('connection success', uri);
});

app.listen(port, function () {
    console.log('server is online at port ' + port)
})