const { chromium } = require('playwright');
const logger = require('../utility/logger');
const section = "CAGEMATCH-SCRAPER:REQUESTER";

class RequestManager {
    constructor(url, cookies = []) {
        this.url = url;
        if (cookies.length > 0) {
            logger("Using provided cookies for Sucuri bypass", "info", section, true);
        } else {
            if(process.env.CAGEMATCH_SCRAPER_COOKIES) {
                try {
                    cookies = JSON.parse(process.env.CAGEMATCH_SCRAPER_COOKIES);
                    if (!Array.isArray(cookies)) {
                        throw new Error("Parsed CAGEMATCH_SCRAPER_COOKIES is not an array");
                    }
                    logger("Using cookies from environment variable for Sucuri bypass", "info", section, true);
                } catch (e) {
                    logger("Failed to parse CAGEMATCH_SCRAPER_COOKIES environment variable, will attempt to bypass Sucuri with Playwright", "error", section, true);
                    cookies = [];
                }
            } else {
                logger("No cookies provided, will attempt to bypass Sucuri with Playwright", "info", section, true);
                cookies = [];
            }
        }
        this.cookies = cookies;
        this.isVerbose = false;
        this.browser = null; 
        this.context = null; // Store the context to maintain headers and cookies
    }

    setIsVerbose(verbose){
        this.isVerbose = verbose;
    }

    async init() {
        if (!this.browser) {
            if (this.isVerbose) logger("Launching Playwright browser...", "info", section, true);
            this.browser = await chromium.launch({ headless: true }); 
            
            // Extract the domain to apply the cookies properly
            const targetDomain = new URL(this.url).hostname;

            // Create a Browser Context with your custom headers
            this.context = await this.browser.newContext({
                userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:150.0) Gecko/20100101 Firefox/150.0',
                extraHTTPHeaders: {
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language': 'es-ES,es;q=0.9,en-US;q=0.8,en;q=0.7',
                    'Accept-Encoding': 'gzip, deflate, br, zstd',
                    'Alt-Used': 'www.cagematch.net',
                    'Connection': 'keep-alive',
                    'Upgrade-Insecure-Requests': '1',
                    'Sec-Fetch-Dest': 'document',
                    'Sec-Fetch-Mode': 'navigate',
                    'Sec-Fetch-Site': 'none',
                    'Sec-Fetch-User': '?1',
                    'Priority': 'u=0, i'
                }
            });

            // Inject target domain into cookies and set them in the context
            this.cookies = this.cookies.map(cookie => ({
                ...cookie,
                domain: targetDomain,
                path: '/'
            }));
            // Inject the Sucuri clearance cookies directly into the context
            await this.context.addCookies(this.cookies);
        }
    }

    async close() {
    if (this.context) {
        try { await this.context.close(); }
        catch (e) { logger(`Error closing context: ${e.message}`, "error", section, this.isVerbose); }
        this.context = null;
    }
    if (this.browser) {
        if (this.isVerbose) logger("Closing Playwright browser...", "info", section, true);
        try {
            await Promise.race([
                this.browser.close(),
                new Promise((_, rej) => setTimeout(() => rej(new Error("close timed out")), 5000))
            ]);
        } catch (e) {
            logger(`browser.close() failed/hung: ${e.message}`, "error", section, true);
        }
        this.browser = null;
    }
}

    async getMatchesByDate(date, page = 0) {
        if (!this.browser) {
            await this.init();
        }

        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString();
        const pageString = (page * 100).toString();
        
        if (this.isVerbose) {
            logger(`Getting matches for ${day}/${month}/${year} page ${page}`, "info", section, true);
        }

        const requestUrl = new URL(`/?id=112&view=search&sDateFromDay=${day}&sDateFromMonth=${month}&sDateFromYear=${year}&sDateTillDay=${day}&sDateTillMonth=${month}&sDateTillYear=${year}&sWorkerRelationship=Any&s=${pageString}`, this.url);
        
        let activePage;

        try {
            if (this.isVerbose) logger(`Requesting: ${requestUrl.href}`, "info", section, true);
            
            activePage = await this.context.newPage();
            
            await activePage.goto(requestUrl.toString(), { waitUntil: 'networkidle' });
            
            const htmlContent = await activePage.content();
            logger(htmlContent.toString(),"info", section, this.isVerbose);
            return htmlContent;

        } catch(e) {
            logger(`Error requesting: ${requestUrl.href}`, "error", section, this.isVerbose);
            logger(e.message, "error", section, this.isVerbose);
            return undefined;
        } finally {
            if (activePage) {
                await activePage.close();
            }
            await this.close(); 
        }
    }
}

module.exports = RequestManager;