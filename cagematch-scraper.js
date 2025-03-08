const RequestManager = require("./managers/request-manager");
const ScraperManager = require("./managers/scraper-manager");

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
    }

    async extractMatchesByDate(date) {
        const totalMatches = [];
        let done = false;
        let page = 0;
        while (!done) {
            const matchesHTML = await this.requestManager.getMatchesByDate(date, page);
            const matches = this.scraperManager.extractMatches(matchesHTML);
            if (matches.length === 0) {
                break;
            }
            for (let i = 0; i < matches.length; i++) {
                totalMatches.push(matches[i]);
            }
            page++;
        }
        console.debug(`Total matches: ${totalMatches.length}`);
        return totalMatches;
    }
}

module.exports = CagematchScraper;