const RequestManager = require("./managers/request-manager");
const ScraperManager = require("./managers/scraper-manager");
const logger = require("./utility/logger");
const section = "CAGEMATCH-SCRAPER";

// Safety limit: Cagematch rarely has >10 pages (1000 matches) for a single day.
// This prevents infinite loops if the exit condition fails.
const MAX_PAGES = 50; 

// Helper for "polite" scraping to save CPU and avoid blocks
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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
        let page = 0;
        
        // Safety: Changed from purely boolean flag to explicit loop limit
        while (page < MAX_PAGES) {
            let matchesHTML = await this.requestManager.getMatchesByDate(date, page);
            
            // 1. Validations
            if (matchesHTML == null) {
                logger("Error getting matches (null response)", "error", section, this.isVerbose);
                return [{error: "Error getting matches, check logs"}];
            }
            if (matchesHTML.includes("Error 404 - Page not found")) {
                // If it's page 0 and 404, it's an error. If page > 0, it's just end of list.
                if (page === 0) {
                    logger("No matches found for this date (404)", "info", section, this.isVerbose);
                }
                break; 
            }

            // 2. Extraction
            const matches = this.scraperManager.extractMatches(matchesHTML);
            
            // Free memory of the large HTML string immediately
            matchesHTML = null; 

            // 3. Exit Condition
            if (matches.length === 0) {
                break;
            }

            // 4. Optimization: Bulk push instead of single item loop
            totalMatches.push(...matches);

            // 5. Rate Limiting / CPU Breather
            // A 200ms pause allows the VM's Event Loop to handle other tasks (like GC)
            await sleep(200);

            page++;
        }

        logger(`Total matches: ${totalMatches.length}`, "info", section, this.isVerbose);
        return totalMatches;
    }
}

module.exports = CagematchScraper;