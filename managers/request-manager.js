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

    /**
     * 
     * @param {Date} date 
     * @param {Number} page
     * @returns 
     */
    async getMatchesByDate(date, page = 0) {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString();
        const pageString = (page * 100).toString();
        logger(`Getting matches for ${day}/${month}/${year} page ${page}`,"info", section, this.isVerbose);
        const request = new URL(`/?id=112&view=search&sDateFromDay=${day}&sDateFromMonth=${month}&sDateFromYear=${year}&sDateTillDay=${day}&sDateTillMonth=${month}&sDateTillYear=${year}&sWorkerRelationship=Any&s=${pageString}`, this.url);
        try{
            logger(`Requesting: ${request.href}`, "info", section, this.isVerbose);
            const response = await axios.get(request);
            return response.data;
        } catch(e){
            logger(`Error requesting: ${request.href}`, "error", section, this.isVerbose);
            logger(e, "error", section, this.isVerbose);
            return null;
        }
    }
}

module.exports = RequestManager;