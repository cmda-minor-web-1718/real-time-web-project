var unified = require('unified');
var english = require('retext-english');
var stringify = require('retext-stringify');
var profanities = require('retext-profanities');
var report = require('vfile-reporter');

unified = unified()
.use(english)
.use(profanities)
.use(stringify);

exports.censorProfanity = function(data, socket){
    let cusswords = [];
    let actualMessage = data.message;

    unified.process(data.message, function(err, message) {
        for(message of message.messages){
            console.log(message.profanitySeverity)
            // Only using *really* profane messages
            if (message.profanitySeverity === 2){
                actualMessage = actualMessage.replace(String(message.actual), '*'.repeat(String(message.actual).length))
                cusswords.push(message.message)    
            }       
        }
    }) 
    if (cusswords.length > 0) {
        socket.emit('profane message', {
            cusswords: cusswords,
            message: 'WATCH YOUR MOUTH YOUNG ONE',
        });
    }
    return actualMessage;
}
