const CagematchScrapper = require('./cagematchScrapper');
const fs = require('node:fs/promises');

async function start(){
    const date = new Date();
    // date.setFullYear(2025);
    // date.setMonth(2);
    // date.setDate(1);
    const cagematchScrapper = new CagematchScrapper();
    const totalMatches = await cagematchScrapper.extractMatchesByDate(date);
    try {
        const content ="[" + totalMatches.map(match => JSON.stringify(match)).join(',\n') + "]";
        await fs.writeFile('result.json', content);
    } catch (err) {
        console.log(err);
    }
}

start();