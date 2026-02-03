const axios = require('axios');
const logger = require('../utility/logger');
const section = "CAGEMATCH-SCRAPER:REQUESTER";

class RequestManager {
    constructor(url) {
        this.url = url;
        this.isVerbose = false;
    }

    setIsVerbose(verbose){
        this.isVerbose = verbose;
    }

    async getMatchesByDate(date, page = 0) {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString();
        const pageString = (page * 100).toString();
        
        if (this.isVerbose) {
            logger(`Getting matches for ${day}/${month}/${year} page ${page}`, "info", section, true);
        }

        const requestUrl = new URL(`/?id=112&view=search&sDateFromDay=${day}&sDateFromMonth=${month}&sDateFromYear=${year}&sDateTillDay=${day}&sDateTillMonth=${month}&sDateTillYear=${year}&sWorkerRelationship=Any&s=${pageString}`, this.url);
        
        try {
            if (this.isVerbose) logger(`Requesting: ${requestUrl.href}`, "info", section, true);
            const response = await axios.get(requestUrl.toString());
            // Return only the data string to allow the response object to be GC'd
            return response.data;
        } catch(e) {
            logger(`Error requesting: ${requestUrl.href}`, "error", section, this.isVerbose);
            // Log message only to save memory in logs
            logger(e.message, "error", section, this.isVerbose);
            return undefined;
        }
    }
}

module.exports = RequestManager;