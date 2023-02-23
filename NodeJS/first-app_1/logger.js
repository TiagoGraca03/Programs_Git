console.log(__filename);
console.log(__dirname);

var logger = "http://mylogger.io/log";

function log(message){

    console.log(message);
}

module.exports = log;