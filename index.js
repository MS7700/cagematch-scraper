const CagematchScraper = require('./cagematch-scraper');
const RequestManager = require('./managers/request-manager');
const fs = require('node:fs/promises');

async function start(){
    const date = new Date();
    date.setFullYear(2025);
    date.setMonth(2);
    date.setDate(2);
    const cagematchScraper = new CagematchScraper();
    const totalMatches = await cagematchScraper.extractMatchesByDate(date);
    try {
        const content ="[" + totalMatches.map(match => JSON.stringify(match)).join(',\n') + "]";
        await fs.writeFile('result.json', content);
    } catch (err) {
        console.log(err);
    }
    const requestManager = new RequestManager('https://www.cagematch.net');
    const matchesHTML = await requestManager.getMatchesByDate(date,2);
    try {
        await fs.writeFile('matches.html', matchesHTML);
    } catch (err) {
        console.log(err);
    }

}

start();