
const CagematchScraper = require('./cagematch-scraper');
const fs = require('node:fs/promises');

const date = new Date();

if(process.argv.length === 5){
    const day = parseInt(process.argv[2]);
    const month = parseInt(process.argv[3]);
    const year = parseInt(process.argv[4]);
    if(isNaN(day) || isNaN(month) || isNaN(year)){
        console.error("Invalid date");
        console.error("Usage: npm run generateMatchesFile [day] [month] [year]");
        process.exit(1);
    }
    try{
        date.setFullYear(year);
        date.setMonth(month - 1);
        date.setDate(day);
        if(isNaN(date.getTime())){
            throw new Error("Invalid date");
        }
        if(date.getMonth() !== month - 1 || date.getDate() !== day || date.getFullYear() !== year){
            throw new Error("Invalid date");
        }
    } catch(e){
        console.error("Invalid date");
        console.error("Usage: npm run generateMatchesFile [day] [month] [year]");
        process.exit(1);
    }
}else if(process.argv.length >= 3){
    console.error("Invalid number of arguments");
    console.error("Usage: npm run generateMatchesFile [day] [month] [year]");
    process.exit(1);
}


/**
 * 
 * @param {Date} date 
 */
async function generateMatchesFile(date) {
    console.log(`Generating matches for ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`);
    const cagematchScraper = new CagematchScraper();
    const totalMatches = await cagematchScraper.extractMatchesByDate(date);
    console.log(`Total matches: ${totalMatches.length}`);
    try {
        const content ="[" + totalMatches.map(match => JSON.stringify(match)).join(',\n') + "]";
        await fs.writeFile('result.json', content);
        console.log("File generated in result.json");
    } catch (err) {
        console.error("Error generating file");
        console.log(err);
    }
}

generateMatchesFile(date);