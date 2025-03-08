const util = require('util');

const logger = function(message, type, section = "CAGEMATCH-SCRAPPER", verbose = false){
    const log = util.debuglog(section);
    if(verbose && !process.env.NODE_DEBUG){
        console[type](message);
    } else {
        log(`[${type.toUpperCase()}] ${message}`);
    }
}

module.exports = logger;