const RequestManager = require("./managers/requestManager");
const ScrapperManager = require("./managers/scrapperManager");

class CagematchScrapper {
    constructor() {
        this.url = "https://www.cagematch.net";
        /**
         * @type {RequestManager}
         */
        this.requestManager = new RequestManager(this.url);
        /**
         * @type {ScrapperManager}
         */
        this.scrapperManager = new ScrapperManager();
    }

    async extractMatchesByDate(date) {
        const totalMatches = [];
        let done = false;
        let page = 0;
        while (!done) {
            const matchesHTML = await this.requestManager.getMatchesByDate(date, page);
            const matches = this.scrapperManager.extractMatches(matchesHTML);
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

module.exports = CagematchScrapper;