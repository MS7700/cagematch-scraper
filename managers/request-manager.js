const axios = require('axios');

class RequestManager {
    constructor(url) {
        this.url = url;
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
        console.debug(`Getting matches for ${day}/${month}/${year} page ${page}`);
        const request = new URL(`/?id=112&view=search&sDateFromDay=${day}&sDateFromMonth=${month}&sDateFromYear=${year}&sDateTillDay=${day}&sDateTillMonth=${month}&sDateTillYear=${year}&sWorkerRelationship=Any&s=${pageString}`, this.url);
        try{
            console.debug(`Requesting: ${request.href}`);
            const response = await axios.get(request);
            return response.data;
        } catch(e){
            console.error(e);
            return null;
        }
    }
}

module.exports = RequestManager;