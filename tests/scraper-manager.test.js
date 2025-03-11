const ScraperManager = require('../managers/scraper-manager');
const fs = require('fs');
const path = require('path');



    const testHTML = fs.readFileSync(path.join(__dirname, 'testMatches.html'), 'UTF-8');

describe('ScraperManager', () => {
    describe('extractMatches',()=> {
        it('should extract the matches from the html', () => {
            const scraperManager = new ScraperManager();
            const matches = scraperManager.extractMatches(testHTML);
            expect(matches.length).toEqual(100);
        });
        it('should extract a singles match',()=> {
            let testSinglesMatchHTML = `<div class="TableContents">
            <table class="TBase TableBorderColor">
            <tr class="THeaderRow"><td class="THeaderCol AlignCenter" style="width: 30px">#</td>
            <td class="THeaderCol TColSeparator" style="white-space:nowrap;width:1%;">Date</td>
            <td class="THeaderCol TColSeparator" style="width:25px;">Promotion</td>
            <td class="THeaderCol TColSeparator">Match</td>
            </tr>
            <tr class="TRow2 TRowTVShow">
                <td class="TCol AlignCenter TextLowlight">10</td>
                    <td class="TCol TColSeparator">01.03.2025</td>
                    <td class="TCol TColSeparator"><a href="?id=8&amp;nr=2287"><img src="/site/main/img/ligen/normal/2287_AEW Collision.gif" class="ImagePromotionLogoMini ImagePromotionLogo_mini" width="36" height="18" alt="All Elite Wrestling" title="All Elite Wrestling" /></a></td>
                    <td class="TCol TColSeparator">
                <span class="MatchCard"><a href="?id=2&amp;nr=12703&amp;name=Swerve+Strickland">Swerve Strickland</a> defeats <a href="?id=2&amp;nr=19930&amp;name=Clark+Connors">Clark Connors</a> (10:08)</span>
                <div class="MatchEventLine"><a href="?id=1&amp;nr=412142">AEW Collision #82</a> - TV-Show @ Oakland Arena in Oakland, California, USA</div>
                </td>
                </tr>
                </table>
                </div>`;



            const scraperManager = new ScraperManager();
            let matches = scraperManager.extractMatches(testSinglesMatchHTML); 
            expect(matches.length).toEqual(1);
            expect(matches[0].date).toEqual("01.03.2025");
            expect(matches[0].promotions).toEqual(['All Elite Wrestling']);
            expect(matches[0].winners).toEqual([{"type":"wrestler","id":"12703","isMainEntity":true,"name":"Swerve Strickland"}]);
            expect(matches[0].losers).toEqual([{"type":"wrestler","id":"19930","isMainEntity":true,"name":"Clark Connors"}]);
            expect(matches[0].duration).toEqual("10:08");
            expect(matches[0].eventType).toEqual('TV-Show');
            expect(matches[0].event).toEqual('AEW Collision #82');
            expect(matches[0].location).toEqual('Oakland Arena in Oakland, California, USA');
            expect(matches[0].isDraw).toEqual(false);
            expect(matches[0].isTeam).toEqual(false);
            expect(matches[0].titles).toEqual([]);
            expect(matches[0].matchType).toEqual('');
            expect(matches[0].isTitleChange).toEqual(false);
            expect(matches[0].entities).toEqual([{"type":"wrestler","id":"12703","isMainEntity":true, "name":"Swerve Strickland"},{"type":"wrestler","id":"19930","isMainEntity":true,"name":"Clark Connors"}]);

            testSinglesMatchHTML = `<div class="TableContents">
            <table class="TBase TableBorderColor">
            <tr class="THeaderRow"><td class="THeaderCol AlignCenter" style="width: 30px">#</td>
            <td class="THeaderCol TColSeparator" style="white-space:nowrap;width:1%;">Date</td>
            <td class="THeaderCol TColSeparator" style="width:25px;">Promotion</td>
            <td class="THeaderCol TColSeparator">Match</td>
            </tr>
            <tr class="TRow2 TRowTVShow">
                <td class="TCol AlignCenter TextLowlight">10</td>
                    <td class="TCol TColSeparator">01.03.2025</td>
                    <td class="TCol TColSeparator"><a href="?id=8&amp;nr=2287"><img src="/site/main/img/ligen/normal/2287_AEW Collision.gif" class="ImagePromotionLogoMini ImagePromotionLogo_mini" width="36" height="18" alt="All Elite Wrestling" title="All Elite Wrestling" /></a></td>
                    <td class="TCol TColSeparator">
                <span class="MatchCard"><a href="?id=2&amp;nr=12703&amp;name=Swerve+Strickland">Swerve Strickland</a> vs. <a href="?id=2&amp;nr=19930&amp;name=Clark+Connors">Clark Connors</a> (10:08)</span>
                <div class="MatchEventLine"><a href="?id=1&amp;nr=412142">AEW Collision #82</a> - TV-Show @ Oakland Arena in Oakland, California, USA</div>
                </td>
                </tr>
                </table>
                </div>`;


            matches = scraperManager.extractMatches(testSinglesMatchHTML); 
            expect(matches.length).toEqual(1);
            expect(matches[0].date).toEqual("01.03.2025");
            expect(matches[0].promotions).toEqual(['All Elite Wrestling']);
            expect(matches[0].winners).toEqual([]);
            expect(matches[0].losers).toEqual([]);
            expect(matches[0].duration).toEqual("10:08");
            expect(matches[0].eventType).toEqual('TV-Show');
            expect(matches[0].event).toEqual('AEW Collision #82');
            expect(matches[0].location).toEqual('Oakland Arena in Oakland, California, USA');
            expect(matches[0].isDraw).toEqual(true);
            expect(matches[0].isTeam).toEqual(false);
            expect(matches[0].titles).toEqual([]);
            expect(matches[0].matchType).toEqual('');
            expect(matches[0].isTitleChange).toEqual(false);
            expect(matches[0].entities).toEqual([{"type":"wrestler","id":"12703","isMainEntity":true,"name":"Swerve Strickland"},{"type":"wrestler","id":"19930","isMainEntity":true,"name":"Clark Connors"}]);

            testSinglesMatchHTML = `<div class="TableContents">
            <table class="TBase TableBorderColor">
            <tr class="THeaderRow"><td class="THeaderCol AlignCenter" style="width: 30px">#</td>
            <td class="THeaderCol TColSeparator" style="white-space:nowrap;width:1%;">Date</td>
            <td class="THeaderCol TColSeparator" style="width:25px;">Promotion</td>
            <td class="THeaderCol TColSeparator">Match</td>
            </tr>
            <tr class="TRow2 TRowTVShow">
                <td class="TCol AlignCenter TextLowlight">10</td>
                    <td class="TCol TColSeparator">01.03.2025</td>
                    <td class="TCol TColSeparator"><a href="?id=8&amp;nr=2287"><img src="/site/main/img/ligen/normal/2287_AEW Collision.gif" class="ImagePromotionLogoMini ImagePromotionLogo_mini" width="36" height="18" alt="All Elite Wrestling" title="All Elite Wrestling" /></a></td>
                    <td class="TCol TColSeparator">
                <span class="MatchCard">Swerve Strickland defeats Clark Connors (10:08)</span>
                <div class="MatchEventLine"><a href="?id=1&amp;nr=412142">AEW Collision #82</a> - TV-Show @ Oakland Arena in Oakland, California, USA</div>
                </td>
                </tr>
                </table>
                </div>`;


            matches = scraperManager.extractMatches(testSinglesMatchHTML); 
            expect(matches.length).toEqual(1);
            expect(matches[0].date).toEqual("01.03.2025");
            expect(matches[0].promotions).toEqual(['All Elite Wrestling']);
            expect(matches[0].winners).toEqual([{"type":"wrestler","id":null,"isMainEntity":true,"name":"Swerve Strickland"}]);
            expect(matches[0].losers).toEqual([{"type":"wrestler","id":null,"isMainEntity":true,"name":"Clark Connors"}]);
            expect(matches[0].duration).toEqual("10:08");
            expect(matches[0].eventType).toEqual('TV-Show');
            expect(matches[0].event).toEqual('AEW Collision #82');
            expect(matches[0].location).toEqual('Oakland Arena in Oakland, California, USA');
            expect(matches[0].isDraw).toEqual(false);
            expect(matches[0].isTeam).toEqual(false);
            expect(matches[0].titles).toEqual([]);
            expect(matches[0].matchType).toEqual('');
            expect(matches[0].isTitleChange).toEqual(false);
            expect(matches[0].entities).toEqual([{"type":"wrestler","id":null,"isMainEntity":true,"name":"Swerve Strickland"},{"type":"wrestler","id":null,"isMainEntity":true,"name":"Clark Connors"}]);

            testSinglesMatchHTML = `<div class="TableContents">
            <table class="TBase TableBorderColor">
            <tr class="THeaderRow"><td class="THeaderCol AlignCenter" style="width: 30px">#</td>
            <td class="THeaderCol TColSeparator" style="white-space:nowrap;width:1%;">Date</td>
            <td class="THeaderCol TColSeparator" style="width:25px;">Promotion</td>
            <td class="THeaderCol TColSeparator">Match</td>
            </tr>
            <tr class="TRow2 TRowTVShow">
                <td class="TCol AlignCenter TextLowlight">10</td>
                    <td class="TCol TColSeparator">01.03.2025</td>
                    <td class="TCol TColSeparator"><a href="?id=8&amp;nr=2287"><img src="/site/main/img/ligen/normal/2287_AEW Collision.gif" class="ImagePromotionLogoMini ImagePromotionLogo_mini" width="36" height="18" alt="All Elite Wrestling" title="All Elite Wrestling" /></a></td>
                    <td class="TCol TColSeparator">
                <span class="MatchCard">Swerve Strickland vs. Clark Connors (10:08)</span>
                <div class="MatchEventLine"><a href="?id=1&amp;nr=412142">AEW Collision #82</a> - TV-Show @ Oakland Arena in Oakland, California, USA</div>
                </td>
                </tr>
                </table>
                </div>`;


            matches = scraperManager.extractMatches(testSinglesMatchHTML); 
            expect(matches.length).toEqual(1);
            expect(matches[0].date).toEqual("01.03.2025");
            expect(matches[0].promotions).toEqual(['All Elite Wrestling']);
            expect(matches[0].winners).toEqual([]);
            expect(matches[0].losers).toEqual([]);
            expect(matches[0].duration).toEqual("10:08");
            expect(matches[0].eventType).toEqual('TV-Show');
            expect(matches[0].event).toEqual('AEW Collision #82');
            expect(matches[0].location).toEqual('Oakland Arena in Oakland, California, USA');
            expect(matches[0].isDraw).toEqual(true);
            expect(matches[0].isTeam).toEqual(false);
            expect(matches[0].titles).toEqual([]);
            expect(matches[0].matchType).toEqual('');
            expect(matches[0].isTitleChange).toEqual(false);
            expect(matches[0].entities).toEqual([{"type":"wrestler","id":null,"isMainEntity":true,"name":"Swerve Strickland"},{"type":"wrestler","id":null,"isMainEntity":true,"name":"Clark Connors"}]);


            testSinglesMatchHTML = `<div class="TableContents">
            <table class="TBase TableBorderColor">
            <tr class="THeaderRow"><td class="THeaderCol AlignCenter" style="width: 30px">#</td>
            <td class="THeaderCol TColSeparator" style="white-space:nowrap;width:1%;">Date</td>
            <td class="THeaderCol TColSeparator" style="width:25px;">Promotion</td>
            <td class="THeaderCol TColSeparator">Match</td>
            </tr>
            <tr class="TRow2 TRowTVShow">
                <td class="TCol AlignCenter TextLowlight">10</td>
                    <td class="TCol TColSeparator">01.03.2025</td>
                    <td class="TCol TColSeparator"><a href="?id=8&amp;nr=2287"><img src="/site/main/img/ligen/normal/2287_AEW Collision.gif" class="ImagePromotionLogoMini ImagePromotionLogo_mini" width="36" height="18" alt="All Elite Wrestling" title="All Elite Wrestling" /></a></td>
                    <td class="TCol TColSeparator">
                <span class="MatchCard"><a href="?id=2&amp;nr=12703&amp;name=Swerve+Strickland">Swerve Strickland</a> vs. Clark Connors (10:08)</span>
                <div class="MatchEventLine"><a href="?id=1&amp;nr=412142">AEW Collision #82</a> - TV-Show @ Oakland Arena in Oakland, California, USA</div>
                </td>
                </tr>
                </table>
                </div>`;


            matches = scraperManager.extractMatches(testSinglesMatchHTML); 
            expect(matches.length).toEqual(1);
            expect(matches[0].date).toEqual("01.03.2025");
            expect(matches[0].promotions).toEqual(['All Elite Wrestling']);
            expect(matches[0].winners).toEqual([]);
            expect(matches[0].losers).toEqual([]);
            expect(matches[0].duration).toEqual("10:08");
            expect(matches[0].eventType).toEqual('TV-Show');
            expect(matches[0].event).toEqual('AEW Collision #82');
            expect(matches[0].location).toEqual('Oakland Arena in Oakland, California, USA');
            expect(matches[0].isDraw).toEqual(true);
            expect(matches[0].isTeam).toEqual(false);
            expect(matches[0].titles).toEqual([]);
            expect(matches[0].matchType).toEqual('');
            expect(matches[0].isTitleChange).toEqual(false);
            expect(matches[0].entities).toEqual([{"type":"wrestler","id":"12703","isMainEntity":true,"name":"Swerve Strickland"},{"type":"wrestler","id":null,"isMainEntity":true,"name":"Clark Connors"}]);
        });

        it('should extract titles',()=>{
            let testSinglesMatchHTML = `<div class="TableContents">
            <table class="TBase TableBorderColor">
            <tr class="THeaderRow"><td class="THeaderCol AlignCenter" style="width: 30px">#</td>
            <td class="THeaderCol TColSeparator" style="white-space:nowrap;width:1%;">Date</td>
            <td class="THeaderCol TColSeparator" style="width:25px;">Promotion</td>
            <td class="THeaderCol TColSeparator">Match</td>
            </tr>
            <tr class="TRow1 TRowOnlineStream">
            <td class="TCol AlignCenter TextLowlight">15</td>
            <td class="TCol TColSeparator">03.03.2025</td>
            <td class="TCol TColSeparator"><a href="?id=8&amp;nr=1"><img src="/site/main/img/ligen/normal/1_WWE Monday Night RAW_20250106-.gif" class="ImagePromotionLogoMini ImagePromotionLogo_mini" width="36" height="18" alt="World Wrestling Entertainment" title="World Wrestling Entertainment" /></a></td>
            <td class="TCol TColSeparator">
            <span class="MatchType"><a href="?id=5&amp;nr=3116">WWE Women's World Title</a>: </span>
            <span class="MatchCard"><a href="?id=2&amp;nr=9555&amp;name=IYO+SKY">IYO SKY</a> defeats <a href="?id=2&amp;nr=16519&amp;name=Rhea+Ripley">Rhea Ripley</a> (c) (18:38) - <span class="MatchTitleChange">TITLE CHANGE !!!</span></span>
            <div class="MatchEventLine"><a href="?id=1&amp;nr=416326">WWE Monday Night RAW #1658</a> - Online Stream @ KeyBank Center in Buffalo, New York, USA</div>
            </td>
            </tr>
                </table>
                </div>`;

            const scraperManager = new ScraperManager();
            let matches = scraperManager.extractMatches(testSinglesMatchHTML);
            expect(matches.length).toEqual(1);
            expect(matches[0].date).toEqual("03.03.2025");
            expect(matches[0].promotions).toEqual(['World Wrestling Entertainment']);
            expect(matches[0].winners).toEqual([{"type":"wrestler","id":"9555","isMainEntity":true,"name":"IYO SKY"}]);
            expect(matches[0].losers).toEqual([{"type":"wrestler","id":"16519","isMainEntity":true,"name":"Rhea Ripley"}]);
            expect(matches[0].duration).toEqual("18:38");
            expect(matches[0].eventType).toEqual('Online Stream');
            expect(matches[0].event).toEqual('WWE Monday Night RAW #1658');
            expect(matches[0].location).toEqual('KeyBank Center in Buffalo, New York, USA');
            expect(matches[0].isDraw).toEqual(false);
            expect(matches[0].isTeam).toEqual(false);
            expect(matches[0].titles).toEqual([{"id":"3116","name":"WWE Women's World Title"}]);
            expect(matches[0].matchType).toEqual('');
            expect(matches[0].isTitleChange).toEqual(true);
            expect(matches[0].entities).toEqual([{"type":"wrestler","id":"9555","isMainEntity":true,"name":"IYO SKY"},{"type":"wrestler","id":"16519","isMainEntity":true,"name":"Rhea Ripley"}]);

            testSinglesMatchHTML = `<div class="TableContents">
            <table class="TBase TableBorderColor">
            <tr class="THeaderRow"><td class="THeaderCol AlignCenter" style="width: 30px">#</td>
            <td class="THeaderCol TColSeparator" style="white-space:nowrap;width:1%;">Date</td>
            <td class="THeaderCol TColSeparator" style="width:25px;">Promotion</td>
            <td class="THeaderCol TColSeparator">Match</td>
            </tr>
            <tr class="TRow1 TRowOnlineStream">
            <td class="TCol AlignCenter TextLowlight">15</td>
            <td class="TCol TColSeparator">03.03.2025</td>
            <td class="TCol TColSeparator"><a href="?id=8&amp;nr=1"><img src="/site/main/img/ligen/normal/1_WWE Monday Night RAW_20250106-.gif" class="ImagePromotionLogoMini ImagePromotionLogo_mini" width="36" height="18" alt="World Wrestling Entertainment" title="World Wrestling Entertainment" /></a></td>
            <td class="TCol TColSeparator">
            <span class="MatchType"><a href="?id=5&amp;nr=3116">WWE Women's World Title</a>: </span>
            <span class="MatchCard"><a href="?id=2&amp;nr=9555&amp;name=IYO+SKY">IYO SKY</a> defeats <a href="?id=2&amp;nr=16519&amp;name=Rhea+Ripley">Rhea Ripley</a> (c) (18:38)</span>
            <div class="MatchEventLine"><a href="?id=1&amp;nr=416326">WWE Monday Night RAW #1658</a> - Online Stream @ KeyBank Center in Buffalo, New York, USA</div>
            </td>
            </tr>
                </table>
                </div>`;

            matches = scraperManager.extractMatches(testSinglesMatchHTML);
            expect(matches.length).toEqual(1);
            expect(matches[0].date).toEqual("03.03.2025");
            expect(matches[0].promotions).toEqual(['World Wrestling Entertainment']);
            expect(matches[0].winners).toEqual([{"type":"wrestler","id":"9555","isMainEntity":true,"name":"IYO SKY"}]);
            expect(matches[0].losers).toEqual([{"type":"wrestler","id":"16519","isMainEntity":true,"name":"Rhea Ripley"}]);
            expect(matches[0].duration).toEqual("18:38");
            expect(matches[0].eventType).toEqual('Online Stream');
            expect(matches[0].event).toEqual('WWE Monday Night RAW #1658');
            expect(matches[0].location).toEqual('KeyBank Center in Buffalo, New York, USA');
            expect(matches[0].isDraw).toEqual(false);
            expect(matches[0].isTeam).toEqual(false);
            expect(matches[0].titles).toEqual([{"id":"3116","name":"WWE Women's World Title"}]);
            expect(matches[0].matchType).toEqual('');
            expect(matches[0].isTitleChange).toEqual(false);
            expect(matches[0].entities).toEqual([{"type":"wrestler","id":"9555","isMainEntity":true,"name":"IYO SKY"},{"type":"wrestler","id":"16519","isMainEntity":true,"name":"Rhea Ripley"}]);


            testSinglesMatchHTML = `<div class="TableContents">
            <table class="TBase TableBorderColor">
            <tr class="THeaderRow"><td class="THeaderCol AlignCenter" style="width: 30px">#</td>
            <td class="THeaderCol TColSeparator" style="white-space:nowrap;width:1%;">Date</td>
            <td class="THeaderCol TColSeparator" style="width:25px;">Promotion</td>
            <td class="THeaderCol TColSeparator">Match</td>
            </tr>
            <tr class="TRow1 TRowOnlineStream">
            <td class="TCol AlignCenter TextLowlight">19</td>
            <td class="TCol TColSeparator">03.03.2025</td>
            <td class="TCol TColSeparator"><a href="?id=8&amp;nr=745"><img src="/site/main/img/ligen/normal/745__2021-.gif" class="ImagePromotionLogoMini ImagePromotionLogo_mini" width="36" height="18" alt="World Wonder Ring Stardom" title="World Wonder Ring Stardom" /></a></td>
            <td class="TCol TColSeparator">
            <span class="MatchType"><a href="?id=5&amp;nr=1333">High Speed Title</a> Best Two Out Of Three Falls: </span>
            <span class="MatchCard"><a href="?id=2&amp;nr=20430&amp;name=Mei+Seira">Mei Seira</a> (c) defeats <a href="?id=2&amp;nr=3709&amp;name=Fukigen+Death">Fukigen Death</a> [2:1] (3:15)</span>
            <div class="MatchEventLine"><a href="?id=1&amp;nr=420608">Stardom Nighter In Korakuen</a> - Online Stream @ Korakuen Hall in Tokyo, Japan</div></td></tr>
                </table>
                </div>`;

            matches = scraperManager.extractMatches(testSinglesMatchHTML);
            expect(matches.length).toEqual(1);
            expect(matches[0].date).toEqual("03.03.2025");
            expect(matches[0].promotions).toEqual(['World Wonder Ring Stardom']);
            expect(matches[0].winners).toEqual([{"type":"wrestler","id":"20430","isMainEntity":true,"name":"Mei Seira"}]);
            expect(matches[0].losers).toEqual([{"type":"wrestler","id":"3709","isMainEntity":true,"name":"Fukigen Death"}]);
            expect(matches[0].duration).toEqual("3:15");
            expect(matches[0].eventType).toEqual('Online Stream');
            expect(matches[0].event).toEqual('Stardom Nighter In Korakuen');
            expect(matches[0].location).toEqual('Korakuen Hall in Tokyo, Japan');
            expect(matches[0].isDraw).toEqual(false);
            expect(matches[0].isTeam).toEqual(false);
            expect(matches[0].titles).toEqual([{"id":"1333","name":"High Speed Title"}]);
            expect(matches[0].matchType).toEqual('Best Two Out Of Three Falls');
            expect(matches[0].isTitleChange).toEqual(false);
            expect(matches[0].entities).toEqual([{"type":"wrestler","id":"20430","isMainEntity":true,"name":"Mei Seira"},{"type":"wrestler","id":"3709","isMainEntity":true,"name":"Fukigen Death"}]);


            testSinglesMatchHTML = `<div class="TableContents">
            <table class="TBase TableBorderColor">
            <tr class="THeaderRow"><td class="THeaderCol AlignCenter" style="width: 30px">#</td>
            <td class="THeaderCol TColSeparator" style="white-space:nowrap;width:1%;">Date</td>
            <td class="THeaderCol TColSeparator" style="width:25px;">Promotion</td>
            <td class="THeaderCol TColSeparator">Match</td>
            </tr>
            <tr class="TRow2 TRowOnlineStream">
            <td class="TCol AlignCenter TextLowlight">248</td>
            <td class="TCol TColSeparator">02.03.2025</td>
            <td class="TCol TColSeparator"><a href="?id=8&amp;nr=8"><img src="/site/main/img/ligen/normal/8__20210212-.gif" class="ImagePromotionLogoMini ImagePromotionLogo_mini" width="36" height="18" alt="Pro Wrestling NOAH" title="Pro Wrestling NOAH" /></a></td>
            <td class="TCol TColSeparator">
            <span class="MatchType"><a href="?id=5&amp;nr=140">GHC Heavyweight Title</a>  / <a href="?id=5&amp;nr=4394">GHC National Title</a> Lumberjack Death: </span>
            <span class="MatchCard"><a href="?id=2&amp;nr=27318&amp;name=OZAWA">OZAWA</a> (c) [Heavyweight] defeats <a href="?id=2&amp;nr=5153&amp;name=Manabu+Soya">Manabu Soya</a> (c) [National] (23:08) - <span class="MatchTitleChange">TITLE CHANGE !!!</span></span>
            <div class="MatchEventLine"><a href="?id=1&amp;nr=420479">NOAH Memorial Voyage In Yokohama ~ NOAH Jr. Tag League 2025 ~</a> - Online Stream @ Yokohama Budokan in Yokohama, Kanagawa, Japan</div></td></tr>
                </table>
                </div>`;

            matches = scraperManager.extractMatches(testSinglesMatchHTML);

            expect(matches.length).toEqual(1);
            expect(matches[0].date).toEqual("02.03.2025");
            expect(matches[0].promotions).toEqual(['Pro Wrestling NOAH']);
            expect(matches[0].winners).toEqual([{"type":"wrestler","id":"27318","isMainEntity":true,"name":"OZAWA"}]);
            expect(matches[0].losers).toEqual([{"type":"wrestler","id":"5153","isMainEntity":true,"name":"Manabu Soya"}]);
            expect(matches[0].duration).toEqual("23:08");
            expect(matches[0].eventType).toEqual('Online Stream');
            expect(matches[0].event).toEqual('NOAH Memorial Voyage In Yokohama ~ NOAH Jr. Tag League 2025 ~');
            expect(matches[0].location).toEqual('Yokohama Budokan in Yokohama, Kanagawa, Japan');
            expect(matches[0].isDraw).toEqual(false);
            expect(matches[0].isTeam).toEqual(false);
            expect(matches[0].titles).toEqual([{"id":"140","name":"GHC Heavyweight Title"},{"id":"4394","name":"GHC National Title"}]);
            expect(matches[0].matchType).toEqual('Lumberjack Death');
            expect(matches[0].isTitleChange).toEqual(true);
            expect(matches[0].entities).toEqual([{"type":"wrestler","id":"27318","isMainEntity":true,"name":"OZAWA"},{"type":"wrestler","id":"5153","isMainEntity":true,"name":"Manabu Soya"}]);

            testSinglesMatchHTML = `<div class="TableContents">
            <table class="TBase TableBorderColor">
            <tr class="THeaderRow"><td class="THeaderCol AlignCenter" style="width: 30px">#</td>
            <td class="THeaderCol TColSeparator" style="white-space:nowrap;width:1%;">Date</td>
            <td class="THeaderCol TColSeparator" style="width:25px;">Promotion</td>
            <td class="THeaderCol TColSeparator">Match</td>
            </tr>
            <tr class="TRow1 TRowTVShow"><td class="TCol AlignCenter TextLowlight">275</td><td class="TCol TColSeparator">01.03.2025</td><td class="TCol TColSeparator"><a href="?id=8&amp;nr=2287"><img src="/site/main/img/ligen/normal/2287_AEW Collision.gif" class="ImagePromotionLogoMini ImagePromotionLogo_mini" width="36" height="18" alt="All Elite Wrestling" title="All Elite Wrestling" /></a></td><td class="TCol TColSeparator">
<span class="MatchType"><a href="?id=5&amp;nr=4578">AEW TNT Title</a>: </span><span class="MatchCard"><a href="?id=2&amp;nr=20642&amp;name=Daniel+Garcia">Daniel Garcia</a> (c) vs. <a href="?id=2&amp;nr=7142&amp;name=Adam+Cole">Adam Cole</a> - No Contest (15:16)</span><div class="MatchEventLine"><a href="?id=1&amp;nr=412142">AEW Collision #82</a> - TV-Show @ Oakland Arena in Oakland, California, USA</div></td></tr>
                </table>
                </div>`;

            matches = scraperManager.extractMatches(testSinglesMatchHTML);

            expect(matches.length).toEqual(1);
            expect(matches[0].date).toEqual("01.03.2025");
            expect(matches[0].promotions).toEqual(['All Elite Wrestling']);
            expect(matches[0].winners).toEqual([]);
            expect(matches[0].losers).toEqual([]);
            expect(matches[0].duration).toEqual("15:16");
            expect(matches[0].eventType).toEqual('TV-Show');
            expect(matches[0].event).toEqual('AEW Collision #82');
            expect(matches[0].location).toEqual('Oakland Arena in Oakland, California, USA');
            expect(matches[0].isDraw).toEqual(true);
            expect(matches[0].isTeam).toEqual(false);
            expect(matches[0].titles).toEqual([{"id":"4578","name":"AEW TNT Title"}]);
            expect(matches[0].matchType).toEqual('');
            expect(matches[0].isTitleChange).toEqual(false);
            expect(matches[0].entities).toEqual([{"type":"wrestler","id":"20642","isMainEntity":true,"name":"Daniel Garcia"},{"type":"wrestler","id":"7142","isMainEntity":true,"name":"Adam Cole"}]);


            
        })
    });
    
    it('should extract multiple wrestlers',()=>{
        let testMultiMatchHTML = `<div class="TableContents">
            <table class="TBase TableBorderColor">
            <tr class="THeaderRow"><td class="THeaderCol AlignCenter" style="width: 30px">#</td>
            <td class="THeaderCol TColSeparator" style="white-space:nowrap;width:1%;">Date</td>
            <td class="THeaderCol TColSeparator" style="width:25px;">Promotion</td>
            <td class="THeaderCol TColSeparator">Match</td>
            </tr>
            <tr class="TRow2 TRowPremiumLiveEvent"><td class="TCol AlignCenter TextLowlight">322</td><td class="TCol TColSeparator">01.03.2025</td><td class="TCol TColSeparator"><a href="?id=8&amp;nr=1"><img src="/site/main/img/ligen/normal/1.gif" class="ImagePromotionLogoMini ImagePromotionLogo_mini" width="36" height="18" alt="World Wrestling Entertainment" title="World Wrestling Entertainment" /></a></td><td class="TCol TColSeparator">
<span class="MatchType"><a href="?id=5&amp;nr=20">WWE Title</a>  / <a href="?id=5&amp;nr=3102">WWE Universal Title</a> #1 Contendership Elimination Chamber: </span><span class="MatchCard"><a href="?id=2&amp;nr=691&amp;name=John+Cena">John Cena</a> defeats <a href="?id=2&amp;nr=80&amp;name=CM+Punk">CM Punk</a> and <a href="?id=2&amp;nr=16337&amp;name=Damian+Priest">Damian Priest</a> and <a href="?id=2&amp;nr=2879&amp;name=Drew+McIntyre">Drew McIntyre</a> and <a href="?id=2&amp;nr=25777&amp;name=Logan+Paul">Logan Paul</a> and <a href="?id=2&amp;nr=2250&amp;name=Seth+Rollins">Seth Rollins</a> (32:36)</span><div class="MatchEventLine"><a href="?id=1&amp;nr=411030">WWE Elimination Chamber 2025 - Toronto</a> - Premium Live Event @ Rogers Centre in Toronto, Ontario, Canada</div></td></tr>
                </table>
                </div>`;

            const scraperManager = new ScraperManager();
            let matches = scraperManager.extractMatches(testMultiMatchHTML);
            expect(matches.length).toEqual(1);
            expect(matches[0].date).toEqual("01.03.2025");
            expect(matches[0].promotions).toEqual(['World Wrestling Entertainment']);
            expect(matches[0].winners).toEqual([{"type":"wrestler","id":"691","isMainEntity":true,"name":"John Cena"}]);
            expect(matches[0].losers).toEqual([{"type":"wrestler","id":"80","isMainEntity":true,"name":"CM Punk"},{"type":"wrestler","id":"16337","isMainEntity":true,"name":"Damian Priest"},{"type":"wrestler","id":"2879","isMainEntity":true,"name":"Drew McIntyre"},{"type":"wrestler","id":"25777","isMainEntity":true,"name":"Logan Paul"},{"type":"wrestler","id":"2250","isMainEntity":true,"name":"Seth Rollins"}]);
            expect(matches[0].duration).toEqual("32:36");
            expect(matches[0].eventType).toEqual('Premium Live Event');
            expect(matches[0].event).toEqual('WWE Elimination Chamber 2025 - Toronto');
            expect(matches[0].location).toEqual('Rogers Centre in Toronto, Ontario, Canada');
            expect(matches[0].isDraw).toEqual(false);
            expect(matches[0].isTeam).toEqual(false);
            expect(matches[0].titles).toEqual([]);
            expect(matches[0].matchType).toEqual('#1 Contendership Elimination Chamber');
            expect(matches[0].isTitleChange).toEqual(false);
            expect(matches[0].entities).toEqual([{"type":"wrestler","id":"691","isMainEntity":true,"name":"John Cena"},{"type":"wrestler","id":"80","isMainEntity":true,"name":"CM Punk"},{"type":"wrestler","id":"16337","isMainEntity":true,"name":"Damian Priest"},{"type":"wrestler","id":"2879","isMainEntity":true,"name":"Drew McIntyre"},{"type":"wrestler","id":"25777","isMainEntity":true,"name":"Logan Paul"},{"type":"wrestler","id":"2250","isMainEntity":true,"name":"Seth Rollins"}]);

            testMultiMatchHTML = `<div class="TableContents">
            <table class="TBase TableBorderColor">
            <tr class="THeaderRow"><td class="THeaderCol AlignCenter" style="width: 30px">#</td>
            <td class="THeaderCol TColSeparator" style="white-space:nowrap;width:1%;">Date</td>
            <td class="THeaderCol TColSeparator" style="width:25px;">Promotion</td>
            <td class="THeaderCol TColSeparator">Match</td>
            </tr>
            <tr class="TRow2 TRowPremiumLiveEvent"><td class="TCol AlignCenter TextLowlight">322</td><td class="TCol TColSeparator">01.03.2025</td><td class="TCol TColSeparator"><a href="?id=8&amp;nr=1"><img src="/site/main/img/ligen/normal/1.gif" class="ImagePromotionLogoMini ImagePromotionLogo_mini" width="36" height="18" alt="World Wrestling Entertainment" title="World Wrestling Entertainment" /></a></td><td class="TCol TColSeparator">
<span class="MatchType"><a href="?id=5&amp;nr=20">WWE Title</a>  / <a href="?id=5&amp;nr=3102">WWE Universal Title</a> #1 Contendership Elimination Chamber: </span><span class="MatchCard">John Cena defeats CM Punk and <a href="?id=2&amp;nr=16337&amp;name=Damian+Priest">Damian Priest</a> and <a href="?id=2&amp;nr=2879&amp;name=Drew+McIntyre">Drew McIntyre</a> and <a href="?id=2&amp;nr=25777&amp;name=Logan+Paul">Logan Paul</a> and <a href="?id=2&amp;nr=2250&amp;name=Seth+Rollins">Seth Rollins</a> (32:36)</span><div class="MatchEventLine"><a href="?id=1&amp;nr=411030">WWE Elimination Chamber 2025 - Toronto</a> - Premium Live Event @ Rogers Centre in Toronto, Ontario, Canada</div></td></tr>
                </table>
                </div>`;

                matches = scraperManager.extractMatches(testMultiMatchHTML);
                expect(matches.length).toEqual(1);
                expect(matches[0].date).toEqual("01.03.2025");
                expect(matches[0].promotions).toEqual(['World Wrestling Entertainment']);
                expect(matches[0].winners).toEqual([{"type":"wrestler","id":null,"isMainEntity":true,"name":"John Cena"}]);
                expect(matches[0].losers).toEqual([{"type":"wrestler","id":"16337","isMainEntity":true,"name":"Damian Priest"},{"type":"wrestler","id":"2879","isMainEntity":true,"name":"Drew McIntyre"},{"type":"wrestler","id":"25777","isMainEntity":true,"name":"Logan Paul"},{"type":"wrestler","id":"2250","isMainEntity":true,"name":"Seth Rollins"},{"type":"wrestler","id":null,"isMainEntity":true,"name":"CM Punk"}]);
                expect(matches[0].duration).toEqual("32:36");
                expect(matches[0].eventType).toEqual('Premium Live Event');
                expect(matches[0].event).toEqual('WWE Elimination Chamber 2025 - Toronto');
                expect(matches[0].location).toEqual('Rogers Centre in Toronto, Ontario, Canada');
                expect(matches[0].isDraw).toEqual(false);
                expect(matches[0].isTeam).toEqual(false);
                expect(matches[0].titles).toEqual([]);
                expect(matches[0].matchType).toEqual('#1 Contendership Elimination Chamber');
                expect(matches[0].isTitleChange).toEqual(false);
                expect(matches[0].entities).toEqual([{"type":"wrestler","id":"16337","isMainEntity":true,"name":"Damian Priest"},{"type":"wrestler","id":"2879","isMainEntity":true,"name":"Drew McIntyre"},{"type":"wrestler","id":"25777","isMainEntity":true,"name":"Logan Paul"},{"type":"wrestler","id":"2250","isMainEntity":true,"name":"Seth Rollins"},{"type":"wrestler","id":null,"isMainEntity":true,"name":"John Cena"},{"type":"wrestler","id":null,"isMainEntity":true,"name":"CM Punk"}]);
    });

    it('should extract teams',()=>{
        let testTeamMatchHTML = `<div class="TableContents">
            <table class="TBase TableBorderColor">
            <tr class="THeaderRow"><td class="THeaderCol AlignCenter" style="width: 30px">#</td>
            <td class="THeaderCol TColSeparator" style="white-space:nowrap;width:1%;">Date</td>
            <td class="THeaderCol TColSeparator" style="width:25px;">Promotion</td>
            <td class="THeaderCol TColSeparator">Match</td>
            <tr class="TRow2"><td class="TCol AlignCenter TextLowlight">8</td><td class="TCol TColSeparator">05.03.2025</td><td class="TCol TColSeparator"><a href="?id=8&amp;nr=96"><img src="/site/main/img/ligen/normal/96__20191204-.gif" class="ImagePromotionLogoMini ImagePromotionLogo_mini" width="36" height="18" alt="Dragongate Japan Pro-Wrestling" title="Dragongate Japan Pro-Wrestling" /></a></td><td class="TCol TColSeparator">
<span class="MatchType">Rey De Parejas 2025 Block A: </span><span class="MatchCard"><a href="?id=29&amp;nr=3107&amp;name=Z-Brats">Z-Brats</a> (<a href="?id=2&amp;nr=26367&amp;name=ISHIN">ISHIN</a> & <a href="?id=2&amp;nr=26802&amp;name=Yoshiki+Kato">Yoshiki Kato</a>) [3] defeat <a href="?id=29&amp;nr=3126&amp;name=GOLD+CLASS">GOLD CLASS</a> (<a href="?id=2&amp;nr=21942&amp;name=JACKY+KAMEI">JACKY KAMEI</a> & <a href="?id=2&amp;nr=26300&amp;name=Riiita">Riiita</a>) [2] (8:35)</span><div class="MatchEventLine"><a href="?id=1&amp;nr=420770">DG Rey De Parejas 2025 - Tag 3</a> - Event @ Yokohama Radiant Hall in Yokohama, Kanagawa, Japan</div></td></tr>
                </table>
                </div>`;

            const scraperManager = new ScraperManager();
            let matches = scraperManager.extractMatches(testTeamMatchHTML);
            expect(matches.length).toEqual(1);
            expect(matches[0].date).toEqual("05.03.2025");
            expect(matches[0].promotions).toEqual(['Dragongate Japan Pro-Wrestling']);
            expect(matches[0].winners).toEqual([{"type":"stable","id":"3107","isMainEntity":true,"name":"Z-Brats","members":[{"type":"wrestler","id":"26367","name":"ISHIN"},{"type":"wrestler","id":"26802","name":"Yoshiki Kato"}]}]);
            expect(matches[0].losers).toEqual([{"type":"stable","id":"3126","name":"GOLD CLASS","isMainEntity":true,"members":[{"type":"wrestler","id":"21942","name":"JACKY KAMEI"},{"type":"wrestler","id":"26300","name":"Riiita"}]}]);
            expect(matches[0].duration).toEqual("8:35");
            expect(matches[0].eventType).toEqual('Event');
            expect(matches[0].event).toEqual('DG Rey De Parejas 2025 - Tag 3');
            expect(matches[0].location).toEqual('Yokohama Radiant Hall in Yokohama, Kanagawa, Japan');
            expect(matches[0].isDraw).toEqual(false);
            expect(matches[0].isTeam).toEqual(true);
            expect(matches[0].titles).toEqual([]);
            expect(matches[0].matchType).toEqual('Rey De Parejas 2025 Block A');
            expect(matches[0].isTitleChange).toEqual(false);
            expect(matches[0].entities).toEqual([{"type":"stable","id":"3107","isMainEntity":true,"name":"Z-Brats","members":[{"type":"wrestler","id":"26367","name":"ISHIN"},{"type":"wrestler","id":"26802","name":"Yoshiki Kato"}]},{"type":"wrestler","id":"26367","name":"ISHIN"},{"type":"wrestler","id":"26802","name":"Yoshiki Kato"},{"type":"stable","id":"3126","isMainEntity":true,"name":"GOLD CLASS","members":[{"type":"wrestler","id":"21942","name":"JACKY KAMEI"},{"type":"wrestler","id":"26300","name":"Riiita"}]},{"type":"wrestler","id":"21942","name":"JACKY KAMEI"},{"type":"wrestler","id":"26300","name":"Riiita"}]);

            testTeamMatchHTML = `<div class="TableContents">
            <table class="TBase TableBorderColor">
            <tr class="THeaderRow"><td class="THeaderCol AlignCenter" style="width: 30px">#</td>
            <td class="THeaderCol TColSeparator" style="white-space:nowrap;width:1%;">Date</td>
            <td class="THeaderCol TColSeparator" style="width:25px;">Promotion</td>
            <td class="THeaderCol TColSeparator">Match</td>
            <tr class="TRow1 TRowTVShow"><td class="TCol AlignCenter TextLowlight">5</td><td class="TCol TColSeparator">05.03.2025</td><td class="TCol TColSeparator"><a href="?id=8&amp;nr=2287"><img src="/site/main/img/ligen/normal/2287_AEW Dynamite_20240306-.gif" class="ImagePromotionLogoMini ImagePromotionLogo_mini" width="36" height="18" alt="All Elite Wrestling" title="All Elite Wrestling" /></a></td><td class="TCol TColSeparator">
<span class="MatchCard"><a href="?id=2&amp;nr=12277&amp;name=Powerhouse+Hobbs">Powerhouse Hobbs</a>, <a href="?id=29&amp;nr=4126&amp;name=The+Conglomeration">The Conglomeration</a> (<a href="?id=2&amp;nr=110&amp;name=Mark+Briscoe">Mark Briscoe</a> & <a href="?id=2&amp;nr=2813&amp;name=Orange+Cassidy">Orange Cassidy</a>) & <a href="?id=2&amp;nr=14028&amp;name=Will+Ospreay">Will Ospreay</a> defeat <a href="?id=2&amp;nr=16433&amp;name=Bryan+Keith">Bryan Keith</a> & <a href="?id=29&amp;nr=3709&amp;name=The+Don+Callis+Family">The Don Callis Family</a> (<a href="?id=2&amp;nr=4823&amp;name=Brian+Cage">Brian Cage</a>, <a href="?id=2&amp;nr=1062&amp;name=Lance+Archer">Lance Archer</a> & <a href="?id=2&amp;nr=11545&amp;name=Mark+Davis">Mark Davis</a>) (15:06)</span><div class="MatchEventLine"><a href="?id=1&amp;nr=416693">AEW Dynamite #283</a> - TV-Show @ Sacramento Memorial Auditorium in Sacramento, California, USA</div></td></tr>
                </table>
                </div>`;

            matches = scraperManager.extractMatches(testTeamMatchHTML);
            expect(matches.length).toEqual(1);
            expect(matches[0].date).toEqual("05.03.2025");
            expect(matches[0].promotions).toEqual(['All Elite Wrestling']);
            expect(matches[0].winners).toEqual([
                {
                    "id": null,
                    "type": "team",
                    "name": "Powerhouse Hobbs, The Conglomeration (Mark Briscoe & Orange Cassidy) & Will Ospreay",
                    "isMainEntity":true,
                    "members": [
                        {
                            "type": "wrestler",
                            "id": "12277",
                            "name": "Powerhouse Hobbs"
                        },
                        {
                            "type": "stable",
                            "id": "4126",
                            "name": "The Conglomeration",
                            "members": [
                                {
                                    "type": "wrestler",
                                    "id": "110",
                                    "name": "Mark Briscoe"
                                },
                                {
                                    "type": "wrestler",
                                    "id": "2813",
                                    "name": "Orange Cassidy"
                                }
                            ]
                        },
                        {
                            "type": "wrestler",
                            "id": "14028",
                            "name": "Will Ospreay"
                        }
                    ]
                }
            ]);
            expect(matches[0].losers).toEqual([
                {
                    "id": null,
                    "type": "team",
                    "isMainEntity":true,
                    "name": "Bryan Keith & The Don Callis Family (Brian Cage, Lance Archer & Mark Davis)",
                    "members": [
                        {
                            "type": "wrestler",
                            "id": "16433",
                            "name": "Bryan Keith"
                        },
                        {
                            "type": "stable",
                            "id": "3709",
                            "name": "The Don Callis Family",
                            "members": [
                                {
                                    "type": "wrestler",
                                    "id": "4823",
                                    "name": "Brian Cage"
                                },
                                {
                                    "type": "wrestler",
                                    "id": "1062",
                                    "name": "Lance Archer"
                                },
                                {
                                    "type": "wrestler",
                                    "id": "11545",
                                    "name": "Mark Davis"
                                }
                            ]
                        }
                    ]
                }
            ]);
            expect(matches[0].duration).toEqual("15:06");
            expect(matches[0].eventType).toEqual('TV-Show');
            expect(matches[0].event).toEqual('AEW Dynamite #283');
            expect(matches[0].location).toEqual('Sacramento Memorial Auditorium in Sacramento, California, USA');
            expect(matches[0].isDraw).toEqual(false);
            expect(matches[0].isTeam).toEqual(true);
            expect(matches[0].titles).toEqual([]);
            expect(matches[0].matchType).toEqual('');
            expect(matches[0].isTitleChange).toEqual(false);
            expect(matches[0].entities).toEqual([
                {
                    "type": "wrestler",
                    "id": "12277",
                    "name": "Powerhouse Hobbs"
                },
                {
                    "type": "stable",
                    "id": "4126",
                    "name": "The Conglomeration",
                    "members": [
                        {
                            "type": "wrestler",
                            "id": "110",
                            "name": "Mark Briscoe"
                        },
                        {
                            "type": "wrestler",
                            "id": "2813",
                            "name": "Orange Cassidy"
                        }
                    ]
                },
                {
                    "type": "wrestler",
                    "id": "110",
                    "name": "Mark Briscoe"
                },
                {
                    "type": "wrestler",
                    "id": "2813",
                    "name": "Orange Cassidy"
                },
                {
                    "type": "wrestler",
                    "id": "14028",
                    "name": "Will Ospreay"
                },
                {
                    "type": "wrestler",
                    "id": "16433",
                    "name": "Bryan Keith"
                },
                {
                    "type": "stable",
                    "id": "3709",
                    "name": "The Don Callis Family",
                    "members": [
                        {
                            "type": "wrestler",
                            "id": "4823",
                            "name": "Brian Cage"
                        },
                        {
                            "type": "wrestler",
                            "id": "1062",
                            "name": "Lance Archer"
                        },
                        {
                            "type": "wrestler",
                            "id": "11545",
                            "name": "Mark Davis"
                        }
                    ]
                },
                {
                    "type": "wrestler",
                    "id": "4823",
                    "name": "Brian Cage"
                },
                {
                    "type": "wrestler",
                    "id": "1062",
                    "name": "Lance Archer"
                },
                {
                    "type": "wrestler",
                    "id": "11545",
                    "name": "Mark Davis"
                },
                {
                    "id": null,
                    "type": "team",
                    "name": "Powerhouse Hobbs, The Conglomeration (Mark Briscoe & Orange Cassidy) & Will Ospreay",
                    "isMainEntity":true,
                    "members": [
                        {
                            "type": "wrestler",
                            "id": "12277",
                            "name": "Powerhouse Hobbs"
                        },
                        {
                            "type": "stable",
                            "id": "4126",
                            "name": "The Conglomeration",
                            "members": [
                                {
                                    "type": "wrestler",
                                    "id": "110",
                                    "name": "Mark Briscoe"
                                },
                                {
                                    "type": "wrestler",
                                    "id": "2813",
                                    "name": "Orange Cassidy"
                                }
                            ]
                        },
                        {
                            "type": "wrestler",
                            "id": "14028",
                            "name": "Will Ospreay"
                        }
                    ]
                },
                {
                    "id": null,
                    "type": "team",
                    "name": "Bryan Keith & The Don Callis Family (Brian Cage, Lance Archer & Mark Davis)",
                    "isMainEntity":true,
                    "members": [
                        {
                            "type": "wrestler",
                            "id": "16433",
                            "name": "Bryan Keith"
                        },
                        {
                            "type": "stable",
                            "id": "3709",
                            "name": "The Don Callis Family",
                            "members": [
                                {
                                    "type": "wrestler",
                                    "id": "4823",
                                    "name": "Brian Cage"
                                },
                                {
                                    "type": "wrestler",
                                    "id": "1062",
                                    "name": "Lance Archer"
                                },
                                {
                                    "type": "wrestler",
                                    "id": "11545",
                                    "name": "Mark Davis"
                                }
                            ]
                        }
                    ]
                }
            ]);

            testTeamMatchHTML = `<div class="TableContents">
            <table class="TBase TableBorderColor">
            <tr class="THeaderRow"><td class="THeaderCol AlignCenter" style="width: 30px">#</td>
            <td class="THeaderCol TColSeparator" style="white-space:nowrap;width:1%;">Date</td>
            <td class="THeaderCol TColSeparator" style="width:25px;">Promotion</td>
            <td class="THeaderCol TColSeparator">Match</td>
            <tr class="TRow1 TRowTVShow"><td class="TCol AlignCenter TextLowlight">9</td><td class="TCol TColSeparator">05.03.2025</td><td class="TCol TColSeparator"><a href="?id=8&amp;nr=2287"><img src="/site/main/img/ligen/normal/2287_AEW Collision.gif" class="ImagePromotionLogoMini ImagePromotionLogo_mini" width="36" height="18" alt="All Elite Wrestling" title="All Elite Wrestling" /></a></td><td class="TCol TColSeparator">
<span class="MatchCard"><a href="?id=29&amp;nr=4369&amp;name=The+Opps">The Opps</a> (<a href="?id=2&amp;nr=24607&amp;name=Hook">Hook</a>, <a href="?id=2&amp;nr=1202&amp;name=Katsuyori+Shibata">Katsuyori Shibata</a> & <a href="?id=2&amp;nr=676&amp;name=Samoa+Joe">Samoa Joe</a>) defeat Jack Banning, <a href="?id=2&amp;nr=23219&amp;name=Starboy+Charlie">Starboy Charlie</a> & <a href="?id=2&amp;nr=24067&amp;name=Titus+Alexander">Titus Alexander</a></span><div class="MatchEventLine"><a href="?id=1&amp;nr=417753">AEW Collision #83</a> - TV-Show @ Sacramento Memorial Auditorium in Sacramento, California, USA</div></td></tr>
                </table>
                </div>`;

            matches = scraperManager.extractMatches(testTeamMatchHTML);
            expect(matches.length).toEqual(1);
            expect(matches[0].date).toEqual("05.03.2025");
            expect(matches[0].promotions).toEqual(['All Elite Wrestling']);
            expect(matches[0].winners).toEqual([
                {
                    "type": "stable",
                    "id": "4369",
                    "name": "The Opps",
                    "isMainEntity":true,
                    "members": [
                        {
                            "type": "wrestler",
                            "id": "24607",
                            "name": "Hook"
                        },
                        {
                            "type": "wrestler",
                            "id": "1202",
                            "name": "Katsuyori Shibata"
                        },
                        {
                            "type": "wrestler",
                            "id": "676",
                            "name": "Samoa Joe"
                        }
                    ]
                }
            ]);
            expect(matches[0].losers).toEqual([{
                "id": null,
                "type": "team",
                "name": "Jack Banning, Starboy Charlie & Titus Alexander",
                "isMainEntity":true,
                "members": [
                    {
                        "type": "wrestler",
                        "id": null,
                        "name": "Jack Banning"
                    },
                    {
                        "type": "wrestler",
                        "id": "23219",
                        "name": "Starboy Charlie"
                    },
                    {
                        "type": "wrestler",
                        "id": "24067",
                        "name": "Titus Alexander"
                    }
                ]
            }]);
            expect(matches[0].duration).toEqual("");
            expect(matches[0].eventType).toEqual('TV-Show');
            expect(matches[0].event).toEqual('AEW Collision #83');
            expect(matches[0].location).toEqual('Sacramento Memorial Auditorium in Sacramento, California, USA');
            expect(matches[0].isDraw).toEqual(false);
            expect(matches[0].isTeam).toEqual(true);
            expect(matches[0].titles).toEqual([]);
            expect(matches[0].matchType).toEqual('');
            expect(matches[0].isTitleChange).toEqual(false);
            expect(matches[0].entities).toEqual([
                {
                    "type": "stable",
                    "id": "4369",
                    "name": "The Opps",
                    "isMainEntity":true,
                    "members": [
                        {
                            "type": "wrestler",
                            "id": "24607",
                            "name": "Hook"
                        },
                        {
                            "type": "wrestler",
                            "id": "1202",
                            "name": "Katsuyori Shibata"
                        },
                        {
                            "type": "wrestler",
                            "id": "676",
                            "name": "Samoa Joe"
                        }
                    ]
                },
                {
                    "type": "wrestler",
                    "id": "24607",
                    "name": "Hook"
                },
                {
                    "type": "wrestler",
                    "id": "1202",
                    "name": "Katsuyori Shibata"
                },
                {
                    "type": "wrestler",
                    "id": "676",
                    "name": "Samoa Joe"
                },
                
                {
                    "type": "wrestler",
                    "id": "23219",
                    "name": "Starboy Charlie"
                },
                {
                    "type": "wrestler",
                    "id": "24067",
                    "name": "Titus Alexander"
                },
                {
                    "type": "wrestler",
                    "id": null,
                    "name": "Jack Banning"
                },
                {
                    "id": null,
                    "type": "team",
                    "name": "Jack Banning, Starboy Charlie & Titus Alexander",
                    "isMainEntity":true,
                    "members": [
                        {
                            "type": "wrestler",
                            "id": null,
                            "name": "Jack Banning"
                        },
                        {
                            "type": "wrestler",
                            "id": "23219",
                            "name": "Starboy Charlie"
                        },
                        {
                            "type": "wrestler",
                            "id": "24067",
                            "name": "Titus Alexander"
                        }
                    ]
                }
            ]);
            
            testTeamMatchHTML = `<div class="TableContents">
            <table class="TBase TableBorderColor">
            <tr class="THeaderRow"><td class="THeaderCol AlignCenter" style="width: 30px">#</td>
            <td class="THeaderCol TColSeparator" style="white-space:nowrap;width:1%;">Date</td>
            <td class="THeaderCol TColSeparator" style="width:25px;">Promotion</td>
            <td class="THeaderCol TColSeparator">Match</td>
            <tr class="TRow2"><td class="TCol AlignCenter TextLowlight">250</td><td class="TCol TColSeparator">02.03.2025</td><td class="TCol TColSeparator"><a href="?id=8&amp;nr=326"><img src="/site/main/img/ligen/normal/326.gif" class="ImagePromotionLogoMini ImagePromotionLogo_mini" width="36" height="18" alt="Pro Wrestling WAVE" title="Pro Wrestling WAVE" /></a></td><td class="TCol TColSeparator">
<span class="MatchType">Three Way: </span><span class="MatchCard"><a href="?id=2&amp;nr=168&amp;name=Ikuto+Hidaka">Ikuto Hidaka</a> & <a href="?id=2&amp;nr=18743&amp;name=Itsuki+Aoki">Itsuki Aoki</a> defeat <a href="?id=28&amp;nr=9035&amp;name=galaxyPunch!">galaxyPunch!</a> (<a href="?id=2&amp;nr=19538&amp;name=Hikari+Shimizu">Hikari Shimizu</a> & <a href="?id=2&amp;nr=15602&amp;name=SAKI">SAKI</a>) and <a href="?id=28&amp;nr=9714&amp;name=SPiCEAP">SPiCEAP</a> (<a href="?id=2&amp;nr=17462&amp;name=Maika+Ozaki">Maika Ozaki</a> & <a href="?id=2&amp;nr=17543&amp;name=Tae+Honma">Tae Honma</a>) (18:45)</span><div class="MatchEventLine"><a href="?id=1&amp;nr=420444">WAVE Spring Revolution</a> - Event @ Korakuen Hall in Tokyo, Japan</div></td></tr>
                </table>
                </div>`;

            matches = scraperManager.extractMatches(testTeamMatchHTML);
            expect(matches.length).toEqual(1);
            expect(matches[0].date).toEqual("02.03.2025");
            expect(matches[0].promotions).toEqual(['Pro Wrestling WAVE']);
            expect(matches[0].winners).toEqual([{
                "id": null,
                "type": "team",
                "name": "Ikuto Hidaka & Itsuki Aoki",
                "isMainEntity":true,
                "members": [
                    {
                        "type": "wrestler",
                        "id": "168",
                        "name": "Ikuto Hidaka"
                    },
                    {
                        "type": "wrestler",
                        "id": "18743",
                        "name": "Itsuki Aoki"
                    }
                ]
            }]);
            expect(matches[0].losers).toEqual([{
                "type": "team",
                "id": "9035",
                "name": "galaxyPunch!",
                "isMainEntity":true,
                "members": [
                    {
                        "type": "wrestler",
                        "id": "19538",
                        "name": "Hikari Shimizu"
                    },
                    {
                        "type": "wrestler",
                        "id": "15602",
                        "name": "SAKI"
                    }
                ]
            },
            {
                "type": "team",
                "id": "9714",
                "name": "SPiCEAP",
                "isMainEntity":true,
                "members": [
                    {
                        "type": "wrestler",
                        "id": "17462",
                        "name": "Maika Ozaki"
                    },
                    {
                        "type": "wrestler",
                        "id": "17543",
                        "name": "Tae Honma"
                    }
                ]
            }]);
            expect(matches[0].duration).toEqual("18:45");
            expect(matches[0].eventType).toEqual('Event');
            expect(matches[0].event).toEqual('WAVE Spring Revolution');
            expect(matches[0].location).toEqual('Korakuen Hall in Tokyo, Japan');
            expect(matches[0].isDraw).toEqual(false);
            expect(matches[0].isTeam).toEqual(true);
            expect(matches[0].titles).toEqual([]);
            expect(matches[0].matchType).toEqual('Three Way');
            expect(matches[0].isTitleChange).toEqual(false);
            expect(matches[0].entities).toEqual([{
                "type": "wrestler",
                "id": "168",
                "name": "Ikuto Hidaka"
            },
            {
                "type": "wrestler",
                "id": "18743",
                "name": "Itsuki Aoki"
            },
            {
                "type": "team",
                "id": "9035",
                "name": "galaxyPunch!",
                "isMainEntity":true,
                "members": [
                    {
                        "type": "wrestler",
                        "id": "19538",
                        "name": "Hikari Shimizu"
                    },
                    {
                        "type": "wrestler",
                        "id": "15602",
                        "name": "SAKI"
                    }
                ]
            },
            {
                "type": "wrestler",
                "id": "19538",
                "name": "Hikari Shimizu"
            },
            {
                "type": "wrestler",
                "id": "15602",
                "name": "SAKI"
            },
            {
                "type": "team",
                "id": "9714",
                "name": "SPiCEAP",
                "isMainEntity":true,
                "members": [
                    {
                        "type": "wrestler",
                        "id": "17462",
                        "name": "Maika Ozaki"
                    },
                    {
                        "type": "wrestler",
                        "id": "17543",
                        "name": "Tae Honma"
                    }
                ]
            },
            {
                "type": "wrestler",
                "id": "17462",
                "name": "Maika Ozaki"
            },
            {
                "type": "wrestler",
                "id": "17543",
                "name": "Tae Honma"
            },
            {
                "id": null,
                "type": "team",
                "name": "Ikuto Hidaka & Itsuki Aoki",
                "isMainEntity":true,
                "members": [
                    {
                        "type": "wrestler",
                        "id": "168",
                        "name": "Ikuto Hidaka"
                    },
                    {
                        "type": "wrestler",
                        "id": "18743",
                        "name": "Itsuki Aoki"
                    }
                ]
            }]);

            testTeamMatchHTML = `<div class="TableContents">
            <table class="TBase TableBorderColor">
            <tr class="THeaderRow"><td class="THeaderCol AlignCenter" style="width: 30px">#</td>
            <td class="THeaderCol TColSeparator" style="white-space:nowrap;width:1%;">Date</td>
            <td class="THeaderCol TColSeparator" style="width:25px;">Promotion</td>
            <td class="THeaderCol TColSeparator">Match</td>
            <tr class="TRow1 TRowOnlineStream"><td class="TCol AlignCenter TextLowlight">245</td><td class="TCol TColSeparator">02.03.2025</td><td class="TCol TColSeparator"><a href="?id=8&amp;nr=2382"><img src="/site/main/img/ligen/normal/2382.gif" class="ImagePromotionLogoMini ImagePromotionLogo_mini" width="36" height="18" alt="Wrestling In The USA - Freelance Shows" title="Wrestling In The USA - Freelance Shows" /></a></td><td class="TCol TColSeparator">
<span class="MatchType">Jewish Heavyweight Title Two On One Handicap: </span><span class="MatchCard"><a href="?id=2&amp;nr=994&amp;name=Colt+Cabana">Colt Cabana</a> (c) defeats <a href="?id=29&amp;nr=3596&amp;name=The+BackSeat+Boyz">The BackSeat Boyz</a> (<a href="?id=2&amp;nr=19622&amp;name=JP+Grayson">JP Grayson</a> & <a href="?id=2&amp;nr=19965&amp;name=Tommy+Grayson">Tommy Grayson</a>) (8:37)</span><div class="MatchEventLine"><a href="?id=1&amp;nr=418190">Maccabiah Mania III: The Last Hora</a> - Online Stream @ Livingston High School in Livingston, New Jersey, USA</div></td></tr>
                </table>
                </div>`;

            matches = scraperManager.extractMatches(testTeamMatchHTML);
            expect(matches.length).toEqual(1);
            expect(matches[0].date).toEqual("02.03.2025");
            expect(matches[0].promotions).toEqual(['Wrestling In The USA - Freelance Shows']);
            expect(matches[0].winners).toEqual([{
                "type": "team",
                "id": null,
                "name": "Colt Cabana",
                "isMainEntity":true,
                "members": [
                    {
                        "type": "wrestler",
                        "id": "994",
                        "name": "Colt Cabana"
                    }
                ]
            }]);
            expect(matches[0].losers).toEqual([{
                "type": "stable",
                "id": "3596",
                "name": "The BackSeat Boyz",
                "isMainEntity":true,
                "members": [
                    {
                        "type": "wrestler",
                        "id": "19622",
                        "name": "JP Grayson"
                    },
                    {
                        "type": "wrestler",
                        "id": "19965",
                        "name": "Tommy Grayson"
                    }
                ]
            }]);
            expect(matches[0].duration).toEqual("8:37");
            expect(matches[0].eventType).toEqual('Online Stream');
            expect(matches[0].event).toEqual('Maccabiah Mania III: The Last Hora');
            expect(matches[0].location).toEqual('Livingston High School in Livingston, New Jersey, USA');
            expect(matches[0].isDraw).toEqual(false);
            expect(matches[0].isTeam).toEqual(true);
            expect(matches[0].titles).toEqual([]);
            expect(matches[0].matchType).toEqual('Jewish Heavyweight Title Two On One Handicap');
            expect(matches[0].isTitleChange).toEqual(false);
            expect(matches[0].entities).toEqual([ 
            {
                "type": "wrestler",
                "id": "994",
                "name": "Colt Cabana"
            },
            {
                "type": "stable",
                "id": "3596",
                "name": "The BackSeat Boyz",
                "isMainEntity":true,
                "members": [
                    {
                        "type": "wrestler",
                        "id": "19622",
                        "name": "JP Grayson"
                    },
                    {
                        "type": "wrestler",
                        "id": "19965",
                        "name": "Tommy Grayson"
                    }
                ]
            },
            {
                "type": "wrestler",
                "id": "19622",
                "name": "JP Grayson"
            },
            {
                "type": "wrestler",
                "id": "19965",
                "name": "Tommy Grayson"
            },
            {
                "id": null,
                "type": "team",
                "name": "Colt Cabana",
                "isMainEntity":true,
                "members": [
                    {
                        "type": "wrestler",
                        "id": "994",
                        "name": "Colt Cabana"
                    }
                ]
            }]);

            testTeamMatchHTML = `<div class="TableContents">
            <table class="TBase TableBorderColor">
            <tr class="THeaderRow"><td class="THeaderCol AlignCenter" style="width: 30px">#</td>
            <td class="THeaderCol TColSeparator" style="white-space:nowrap;width:1%;">Date</td>
            <td class="THeaderCol TColSeparator" style="width:25px;">Promotion</td>
            <td class="THeaderCol TColSeparator">Match</td>
            <tr class="TRow2"><td class="TCol AlignCenter TextLowlight">616</td><td class="TCol TColSeparator">15.02.2025</td><td class="TCol TColSeparator"><a href="?id=8&amp;nr=731"><img src="/site/main/img/ligen/normal/731__2023-.gif" class="ImagePromotionLogoMini ImagePromotionLogo_mini" width="36" height="18" alt="Victory Pro Wrestling" title="Victory Pro Wrestling" /></a></td><td class="TCol TColSeparator">
<span class="MatchType">Kings Of New York Qualifying Beat The Clock: </span><span class="MatchCard">Primadonnas (<a href="?id=2&amp;nr=20855&amp;name=Samwell+Thompson">Samwell Thompson</a> & <a href="?id=2&amp;nr=30331&amp;name=Valerie+Verman">Valerie Verman</a>) vs. <a href="?id=28&amp;nr=13177&amp;name=Skull+And+Bonez">Skull And Bonez</a> (<a href="?id=2&amp;nr=23811&amp;name=Bonez">Bonez</a> & <a href="?id=2&amp;nr=30877&amp;name=Hamlet+Hurtssue">Hamlet Hurtssue</a>) - Draw (8:45)</span><div class="MatchEventLine"><a href="?id=1&amp;nr=419522">VPW Kings Of New York</a> - Event @ Pro Game Athletics in Bay Shore, New York, USA</div></td></tr>
                </table>
                </div>`;
            matches = scraperManager.extractMatches(testTeamMatchHTML);
            expect(matches.length).toEqual(1);
            expect(matches[0].date).toEqual("15.02.2025");
            expect(matches[0].promotions).toEqual(['Victory Pro Wrestling']);
            expect(matches[0].winners).toEqual([]);
            expect(matches[0].losers).toEqual([]);
            expect(matches[0].duration).toEqual("8:45");
            expect(matches[0].eventType).toEqual('Event');
            expect(matches[0].event).toEqual('VPW Kings Of New York');
            expect(matches[0].location).toEqual('Pro Game Athletics in Bay Shore, New York, USA');
            expect(matches[0].isDraw).toEqual(true);
            expect(matches[0].isTeam).toEqual(true);
            expect(matches[0].titles).toEqual([]);
            expect(matches[0].matchType).toEqual('Kings Of New York Qualifying Beat The Clock');
            expect(matches[0].isTitleChange).toEqual(false);
            expect(matches[0].entities).toEqual([
                {
                    "type": "wrestler",
                    "id": "20855",
                    "name": "Samwell Thompson"
                },
                {
                    "type": "wrestler",
                    "id": "30331",
                    "name": "Valerie Verman"
                },
                {
                    "type": "team",
                    "id": "13177",
                    "name": "Skull And Bonez",
                    "members": [
                        {
                            "type": "wrestler",
                            "id": "23811",
                            "name": "Bonez"
                        },
                        {
                            "type": "wrestler",
                            "id": "30877",
                            "name": "Hamlet Hurtssue"
                        }
                    ],
                    "isMainEntity": true
                },
                {
                    "type": "wrestler",
                    "id": "23811",
                    "name": "Bonez"
                },
                {
                    "type": "wrestler",
                    "id": "30877",
                    "name": "Hamlet Hurtssue"
                },
                {
                    "type": "team",
                    "id": null,
                    "name": "Primadonnas",
                    "members": [
                        {
                            "type": "wrestler",
                            "id": "20855",
                            "name": "Samwell Thompson"
                        },
                        {
                            "type": "wrestler",
                            "id": "30331",
                            "name": "Valerie Verman"
                        }
                    ],
                    "isMainEntity": true
                }
            ]);

    });

    it('should not extract details about the result', ()=>{
        let testMatchHTML = `<div class="TableContents">
            <table class="TBase TableBorderColor">
            <tr class="THeaderRow"><td class="THeaderCol AlignCenter" style="width: 30px">#</td>
            <td class="THeaderCol TColSeparator" style="white-space:nowrap;width:1%;">Date</td>
            <td class="THeaderCol TColSeparator" style="width:25px;">Promotion</td>
            <td class="THeaderCol TColSeparator">Match</td>
            <tr class="TRow1 TRowOnlineStream"><td class="TCol AlignCenter TextLowlight">17</td><td class="TCol TColSeparator">05.03.2025</td><td class="TCol TColSeparator"><a href="?id=8&amp;nr=96"><img src="/site/main/img/ligen/normal/96__20191204-.gif" class="ImagePromotionLogoMini ImagePromotionLogo_mini" width="36" height="18" alt="Dragongate Japan Pro-Wrestling" title="Dragongate Japan Pro-Wrestling" /></a></td><td class="TCol TColSeparator">
<span class="MatchCard"><a href="?id=29&amp;nr=4100&amp;name=PARADOX">PARADOX</a> (<a href="?id=2&amp;nr=2902&amp;name=BxB+Hulk">BxB Hulk</a>, <a href="?id=2&amp;nr=3269&amp;name=Naruki+Doi">Naruki Doi</a> & <a href="?id=2&amp;nr=4082&amp;name=YAMATO">YAMATO</a>) vs. <a href="?id=29&amp;nr=3107&amp;name=Z-Brats">Z-Brats</a> (<a href="?id=2&amp;nr=18139&amp;name=Gianni+Valletta">Gianni Valletta</a>, <a href="?id=2&amp;nr=14150&amp;name=Jason+Lee+">Jason Lee</a> & <a href="?id=2&amp;nr=19988&amp;name=Kota+Minoura">Kota Minoura</a>) - Double Count Out (11:01)</span><div class="MatchEventLine"><a href="?id=1&amp;nr=420770">DG Rey De Parejas 2025 - Tag 3</a> - Online Stream @ Yokohama Radiant Hall in Yokohama, Kanagawa, Japan</div></td></tr>
                </table>
                </div>`;
        const scraperManager = new ScraperManager();
        let matches = scraperManager.extractMatches(testMatchHTML);
        expect(matches.length).toEqual(1);
        expect(matches[0].date).toEqual("05.03.2025");
        expect(matches[0].promotions).toEqual(['Dragongate Japan Pro-Wrestling']);
        expect(matches[0].winners).toEqual([]);
        expect(matches[0].losers).toEqual([]);
        expect(matches[0].duration).toEqual("11:01");
        expect(matches[0].eventType).toEqual('Online Stream');
        expect(matches[0].event).toEqual('DG Rey De Parejas 2025 - Tag 3');
        expect(matches[0].location).toEqual('Yokohama Radiant Hall in Yokohama, Kanagawa, Japan');
        expect(matches[0].isDraw).toEqual(true);
        expect(matches[0].isTeam).toEqual(true);
        expect(matches[0].titles).toEqual([]);
        expect(matches[0].matchType).toEqual('');
        expect(matches[0].isTitleChange).toEqual(false);
        expect(matches[0].entities).toEqual([{
            "type": "stable",
            "id": "4100",
            "name": "PARADOX",
            "isMainEntity":true,
            "members": [
                {
                    "type": "wrestler",
                    "id": "2902",
                    "name": "BxB Hulk"
                },
                {
                    "type": "wrestler",
                    "id": "3269",
                    "name": "Naruki Doi"
                },
                {
                    "type": "wrestler",
                    "id": "4082",
                    "name": "YAMATO"
                }
            ]
        },
        {
            "type": "wrestler",
            "id": "2902",
            "name": "BxB Hulk"
        },
        {
            "type": "wrestler",
            "id": "3269",
            "name": "Naruki Doi"
        },
        {
            "type": "wrestler",
            "id": "4082",
            "name": "YAMATO"
        },
        {
            "type": "stable",
            "id": "3107",
            "name": "Z-Brats",
            "isMainEntity":true,
            "members": [
                {
                    "type": "wrestler",
                    "id": "18139",
                    "name": "Gianni Valletta"
                },
                {
                    "type": "wrestler",
                    "id": "14150",
                    "name": "Jason Lee"
                },
                {
                    "type": "wrestler",
                    "id": "19988",
                    "name": "Kota Minoura"
                }
            ]
        },
        {
            "type": "wrestler",
            "id": "18139",
            "name": "Gianni Valletta"
        },
        {
            "type": "wrestler",
            "id": "14150",
            "name": "Jason Lee"
        },
        {
            "type": "wrestler",
            "id": "19988",
            "name": "Kota Minoura"
        }]);

        testMatchHTML = `<div class="TableContents">
            <table class="TBase TableBorderColor">
            <tr class="THeaderRow"><td class="THeaderCol AlignCenter" style="width: 30px">#</td>
            <td class="THeaderCol TColSeparator" style="white-space:nowrap;width:1%;">Date</td>
            <td class="THeaderCol TColSeparator" style="width:25px;">Promotion</td>
            <td class="THeaderCol TColSeparator">Match</td>
            <tr class="TRow1 TRowOnlineStream"><td class="TCol AlignCenter TextLowlight">33</td><td class="TCol TColSeparator">04.03.2025</td><td class="TCol TColSeparator"><a href="?id=8&amp;nr=78"><img src="/site/main/img/ligen/normal/78__20180914-.gif" class="ImagePromotionLogoMini ImagePromotionLogo_mini" width="36" height="18" alt="Consejo Mundial De Lucha Libre" title="Consejo Mundial De Lucha Libre" /></a></td><td class="TCol TColSeparator">
<span class="MatchType">Lightning: </span><span class="MatchCard"><a href="?id=2&amp;nr=28129&amp;name=Zandokan+Jr.">Zandokan Jr.</a> defeats <a href="?id=2&amp;nr=5593&amp;name=Valiente">Valiente</a> by DQ (6:57)</span><div class="MatchEventLine"><a href="?id=1&amp;nr=420773">CMLL Martes Populares</a> - Online Stream @ Arena Mexico in Mexico City, Distrito Federal, Mexiko</div></td></tr>
                </table>
                </div>`;
        matches = scraperManager.extractMatches(testMatchHTML);
        expect(matches.length).toEqual(1);
        expect(matches[0].date).toEqual("04.03.2025");
        expect(matches[0].promotions).toEqual(['Consejo Mundial De Lucha Libre']);
        expect(matches[0].winners).toEqual([{"type":"wrestler","id":"28129","isMainEntity":true,"name":"Zandokan Jr."}]);
        expect(matches[0].losers).toEqual([{"type":"wrestler","id":"5593","isMainEntity":true,"name":"Valiente"}]);
        expect(matches[0].duration).toEqual("6:57");
        expect(matches[0].eventType).toEqual('Online Stream');
        expect(matches[0].event).toEqual('CMLL Martes Populares');
        expect(matches[0].location).toEqual('Arena Mexico in Mexico City, Distrito Federal, Mexiko');
        expect(matches[0].isDraw).toEqual(false);
        expect(matches[0].isTeam).toEqual(false);
        expect(matches[0].titles).toEqual([]);
        expect(matches[0].matchType).toEqual('Lightning');
        expect(matches[0].isTitleChange).toEqual(false);
        expect(matches[0].entities).toEqual([{"type":"wrestler","id":"28129","isMainEntity":true,"name":"Zandokan Jr."},{"type":"wrestler","id":"5593","isMainEntity":true,"name":"Valiente"}]);


    });

    it('should extract multiple promotions', () => {
        let testMatchHTML = `<div class="TableContents">
            <table class="TBase TableBorderColor">
            <tr class="THeaderRow"><td class="THeaderCol AlignCenter" style="width: 30px">#</td>
            <td class="THeaderCol TColSeparator" style="white-space:nowrap;width:1%;">Date</td>
            <td class="THeaderCol TColSeparator" style="width:25px;">Promotion</td>
            <td class="THeaderCol TColSeparator">Match</td>
            <tr class="TRow1"><td class="TCol AlignCenter TextLowlight">285</td><td class="TCol TColSeparator">02.03.2025</td><td class="TCol TColSeparator"><a href="?id=8&amp;nr=9"><img src="/site/main/img/ligen/normal/9__2019-.gif" class="ImagePromotionLogoMini ImagePromotionLogo_mini" width="36" height="18" alt="National Wrestling Alliance" title="National Wrestling Alliance" /></a><a href="?id=8&amp;nr=3244"><img src="/site/main/img/ligen/normal/3244.gif" class="ImagePromotionLogoMini ImagePromotionLogo_mini" width="36" height="18" alt="PROject codename: WRESTLING" title="PROject codename: WRESTLING" /></a></td><td class="TCol TColSeparator">
<span class="MatchType">Three Way: </span><span class="MatchCard"><a href="?id=2&amp;nr=20173&amp;name=Kerr">Kerr</a> defeats Himi Hendrix and <a href="?id=2&amp;nr=12243&amp;name=Rex+Lawless">Rex Lawless</a></span><div class="MatchEventLine"><a href="?id=1&amp;nr=420543">NWA/PROject codename: WRESTLING NWA On Tour!</a> - Event @ Morgan Jr Arena in Wallington, New Jersey, USA</div></td></tr>
                </table>
                </div>`;
        const scraperManager = new ScraperManager();
        let matches = scraperManager.extractMatches(testMatchHTML);
        expect(matches.length).toEqual(1);
        expect(matches[0].date).toEqual("02.03.2025");
        expect(matches[0].promotions).toEqual(['National Wrestling Alliance', 'PROject codename: WRESTLING']);
        expect(matches[0].winners).toEqual([{"type":"wrestler","id":"20173","isMainEntity":true,"name":"Kerr"}]);
        expect(matches[0].losers).toEqual([{"type":"wrestler","id":"12243","isMainEntity":true,"name":"Rex Lawless"},{"type":"wrestler","id":null,"isMainEntity":true,"name":"Himi Hendrix"}]);
        expect(matches[0].duration).toEqual("");
        expect(matches[0].eventType).toEqual('Event');
        expect(matches[0].event).toEqual('NWA/PROject codename: WRESTLING NWA On Tour!');
        expect(matches[0].location).toEqual('Morgan Jr Arena in Wallington, New Jersey, USA');
        expect(matches[0].isDraw).toEqual(false);
        expect(matches[0].isTeam).toEqual(false);
        expect(matches[0].titles).toEqual([]);
        expect(matches[0].matchType).toEqual('Three Way');
        expect(matches[0].isTitleChange).toEqual(false);
        expect(matches[0].entities).toEqual([{"type":"wrestler","id":"20173","isMainEntity":true,"name":"Kerr"},{"type":"wrestler","id":"12243","isMainEntity":true,"name":"Rex Lawless"},{"type":"wrestler","id":null,"isMainEntity":true,"name":"Himi Hendrix"}]);
    })

});

