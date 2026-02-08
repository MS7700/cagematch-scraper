const cheerio = require('cheerio');
const { splitWithParenthesisHandling, cleanMatchesText, splitBySeparatorRaw, extractLastBalancedGroup } = require('../utility/utility-functions');
const logger = require('../utility/logger');
const section = "CAGEMATCH-SCRAPER:SCRAPER-MANAGER";



class ScraperManager {
  constructor() {
    this.isVerbose = false;
  }

  setIsVerbose(verbose) {
    this.isVerbose = verbose;
  }

  extractMatches(html) {
    const $ = cheerio.load(html);
    const matches = [];

    const matchCards = $("span.MatchCard");
    
    matchCards.each((index, element) => {
        const matchCard = $(element);
        
        // Validation Checks
        if (matchCard.html() && matchCard.html().match(/\[[^\]]*<a/)) {
            logger("Match skipped (Invalid format: Link inside brackets): " + matchCard.text(), "error", section, this.isVerbose);
            return; 
        }

        const matchText = matchCard.text();
        const entities = []; 
        const linkMap = new Map(); 

        // Link Processing
        const links = matchCard.find("a");
        links.each((i, el) => {
            const link = $(el);
            const href = link.attr("href") || "";
            const params = new URLSearchParams(href.replace(/^[/?]/, "")); 
            const idStr = params.get("id"); 
            const nr = params.get("nr");
            const name = cleanMatchesText(link.text().trim());

            if (nr && (idStr === "2" || idStr === "28" || idStr === "29")) {
                let type = "wrestler";
                if (idStr === "28") type = "team";
                if (idStr === "29") type = "stable";
                
                const entity = { id: nr, type: type, name: name };
                entities.push(entity);
                if (!linkMap.has(name)) linkMap.set(name, []);
                linkMap.get(name).push(entity);
            }
        });

        // Metadata Extraction
        const row = matchCard.closest("tr");
        
        const dateCell = row.find("td.TCol.TColSeparator").first(); 
        const date = dateCell.length ? dateCell.text().trim() : "";
        
        const promotionImages = row.find("img.ImagePromotionLogoMini.ImagePromotionLogo_mini");
        const promotions = [];
        promotionImages.each((i, img) => {
            promotions.push($(img).attr("alt"));
        });

        const eventLine = matchCard.next();
        let eventName = "", eventLocation = "", eventType = "";
        
        if (eventLine.length) {
            const eventLink = eventLine.find("a");
            eventName = eventLink.length ? eventLink.text() : "";
            
            const eventText = eventLine.text();
            const parts = eventText.split("@");
            eventLocation = parts[1] ? parts[1].trim() : "";
            eventType = parts[0] ? parts[0].split(" - ").slice(-1)[0].trim() : "";
        }

        if (!matchText.includes(" defeats ") && !matchText.includes(" defeat ") && !matchText.includes(" vs. ")) {
            logger("Match skipped (bad format): " + matchText, "error", section, this.isVerbose);
            return;
        }
        if (Array.from(matchText.matchAll(/\sdefeats?\s/g)).length > 1) {
            logger("Match skipped (bad format): " + matchText, "error", section, this.isVerbose);
            return;
        }

        const durationMatch = matchText.match(/\((\d+:\d+)\)/);
        const duration = durationMatch ? durationMatch[1] : "";
        const isDraw = !matchText.includes(" defeat") && matchText.includes(" vs. ");
        const isTeam = matchText.includes(" & ");
        
        // Match Type
        const matchTypeCell = row.find("span.MatchType");
        let matchType = matchTypeCell.length ? matchTypeCell.text().replace(":", "") : "";
        const titles = [];
        const isTitleChange = row.find("span.MatchTitleChange").length > 0;
        
        if (matchTypeCell.length) {
            const titleLinks = matchTypeCell.find("a");
            titleLinks.each((i, el) => {
                const link = $(el);
                const href = link.attr("href") || "";
                const params = new URLSearchParams(href.replace(/^[/?]/, ""));
                const name = link.text().trim();
                
                matchType = matchType.replace(name, "");
                
                if (params.get("id") === "5" && (matchText.includes("(c)") || isTitleChange)) {
                    titles.push({ id: params.get("nr"), name: name });
                }
            });
        }
        matchType = matchType.replace(" / ", "").trim();

        // --- ENTITY RESOLUTION LOGIC ---
        const resolveEntity = (rawText, forceType = null) => {
            const cleanName = cleanMatchesText(rawText);
            if(!cleanName) return null;

            const splitResult = extractLastBalancedGroup(cleanName);

            if (splitResult) {
                let teamName = splitResult.head;
                const membersContent = splitResult.tail;

                const aliasSplit = extractLastBalancedGroup(teamName);
                if (aliasSplit) {
                    teamName = aliasSplit.head; 
                }
                
                const candidates = linkMap.get(teamName);
                let teamEntity = candidates && candidates.length > 0 ? candidates.shift() : null;

                if (teamEntity && teamEntity.type === 'wrestler') {
                    throw new Error("Invalid Format: Wrestler ID used as Team Wrapper");
                }

                const memberNames = membersContent.split(/&|,/).map(s => s.trim());
                const members = [];
                memberNames.forEach(mName => {
                    const m = resolveEntity(mName, "wrestler");
                    if(m) members.push(m);
                });

                if (!teamEntity && members.length === 1) return members[0];

                if (!teamEntity) {
                    teamEntity = { id: null, type: "team", name: teamName, members: members };
                    entities.push(teamEntity);
                } else {
                    if(!teamEntity.members) teamEntity.members = members;
                }
                return teamEntity;
            } 

            const candidates = linkMap.get(cleanName);
            let entity = candidates && candidates.length > 0 ? candidates.shift() : null;
            
            if (entity) {
                if (forceType && entity.type !== forceType && entity.id === null) entity.type = forceType;
            } else {
                entity = { id: null, type: forceType || "wrestler", name: cleanName };
                if (entity.type === "team") entity.members = [entity];
                entities.push(entity);
            }
            return entity;
        };

        const processSide = (sideText) => {
            if (!sideText) return [];
            const topLevelParts = splitBySeparatorRaw(sideText, " and ");
            const sideEntities = [];
            
            topLevelParts.forEach(part => {
                const trimmedPart = part.trim();
                
                const membersParts = splitWithParenthesisHandling(trimmedPart);
                if (membersParts.length > 1) {
                    const members = [];
                    membersParts.forEach(mp => {
                        const m = resolveEntity(mp.trim(), "wrestler");
                        if (m) members.push(m);
                    });
                    const teamEntity = { id: null, type: "team", isMainEntity: true, name: trimmedPart, members: members };
                    if (!entities.some(e => e.name === teamEntity.name && e.type === "team")) entities.push(teamEntity);
                    sideEntities.push(teamEntity);
                    return;
                }

                const entity = resolveEntity(trimmedPart);
                if(entity) {
                    if (isTeam && entity.type === "wrestler") {
                        const teamWrapper = { id: null, type: "team", isMainEntity: true, name: entity.name, members: [entity] };
                        if (!entities.some(e => e.name === teamWrapper.name && e.type === "team")) entities.push(teamWrapper);
                        sideEntities.push(teamWrapper);
                    } else {
                        entity.isMainEntity = true;
                        sideEntities.push(entity);
                    }
                }
            });
            return sideEntities;
        };

        try {
            let winners = [];
            let losers = [];
            let separator = null;
            if (matchText.includes(" defeats ")) separator = " defeats ";
            else if (matchText.includes(" defeat ")) separator = " defeat ";
            
            if (separator) {
                const [winnerText, loserText] = matchText.split(separator);
                winners = processSide(cleanMatchesText(winnerText));
                losers = processSide(cleanMatchesText(loserText));
            } else if (isDraw) {
                const sides = matchText.split(" vs. ");
                sides.forEach(side => processSide(cleanMatchesText(side))); 
            }

            matches.push({
                date, promotions, eventType, event: eventName, location: eventLocation,
                matchType, titles, isTitleChange, duration, isDraw, isTeam,
                entities, winners, losers
            });
        } catch (error) {
            if (error.message.includes("Invalid Format")) {
                logger("Match skipped (" + error.message + "): " + matchText, "error", section, this.isVerbose);
            } else {
                throw error;
            }
        }
    });

    return matches;
  }
}

module.exports = ScraperManager;