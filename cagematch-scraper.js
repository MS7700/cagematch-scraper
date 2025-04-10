const RequestManager = require("./managers/request-manager");
const ScraperManager = require("./managers/scraper-manager");
const logger = require("./utility/logger");
const section = "CAGEMATCH-SCRAPER";

class CagematchScraper {
    constructor() {
        this.url = "https://www.cagematch.net";
        /**
         * @type {RequestManager}
         */
        this.requestManager = new RequestManager(this.url);
        /**
         * @type {ScraperManager}
         */
        this.scraperManager = new ScraperManager();
        this.isVerbose = false;
    }

    setIsVerbose(verbose){
        this.isVerbose = verbose;
        this.requestManager.setIsVerbose(verbose);
        this.scraperManager.setIsVerbose(verbose);
    }
    async extractMatchesByDate(date) {
        const totalMatches = [];
        let done = false;
        let page = 0;
        while (!done) {
            const matchesHTML = await this.requestManager.getMatchesByDate(date, page);
            if(matchesHTML == null){
                logger("Error getting matches", "error", section, this.isVerbose);
                done = true;
                return [{error:"Error getting matches, please activate the verbose mode to see the error in logs"}];
            }
            if(matchesHTML.includes("Error 404 - Page not found")){
                logger("Error getting matches, [Error 404 - Page not found]", "info", section, this.isVerbose);
                done = true;
                return [{error:"Error getting matches, please activate the verbose mode to see the error in logs"}];
            }
            const matches = this.scraperManager.extractMatches(matchesHTML);
            if (matches.length === 0) {
                break;
            }
            for (let i = 0; i < matches.length; i++) {
                totalMatches.push(matches[i]);
            }
            page++;
        }
        logger(`Total matches: ${totalMatches.length}`, "info", section, this.isVerbose);
        return totalMatches;
    }
}

module.exports = CagematchScraper;