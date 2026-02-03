const { JSDOM } = require('jsdom');
const { splitWithParenthesisHandling } = require('../utility/utility-functions');
const logger = require('../utility/logger');
const section = "CAGEMATCH-SCRAPER:SCRAPER-MANAGER";

// --- STATIC HELPERS ---

function cleanMatchesText(text) {
    if (!text) return "";
    return text.replaceAll(" (c)", "")
        .replaceAll(/\(\d{1,}:\d{1,}\)/g, "")
        .replaceAll(/\s-\s.*$/g, "")
        .replaceAll(/\sby\s.*$/g, "")
        .replaceAll(/\s*\[\d{1,}:\d{1,}\]\s*/g, "")
        .replaceAll(/\s*\[[^\]]*?\]/g, "")
        .trim();
}

function splitBySeparatorRaw(text, separator) {
    const parts = [];
    let current = "";
    let depth = 0;
    
    for (let i = 0; i < text.length; i++) {
        if (text[i] === '(') depth++;
        else if (text[i] === ')') depth--;
        
        if (depth === 0 && text.substr(i, separator.length) === separator) {
            parts.push(current);
            current = "";
            i += separator.length - 1; 
        } else {
            current += text[i];
        }
    }
    parts.push(current);
    return parts;
}

/**
 * Extracts the content of the last balanced parenthesized group.
 * Returns { head, tail } or null if no group found at end.
 * Example: "Name (A) (B & C)" -> head: "Name (A)", tail: "B & C"
 */
function extractLastBalancedGroup(text) {
    const trimmed = text.trim();
    if (!trimmed.endsWith(')')) return null;

    let depth = 0;
    for (let i = trimmed.length - 1; i >= 0; i--) {
        if (trimmed[i] === ')') depth++;
        else if (trimmed[i] === '(') depth--;

        if (depth === 0) {
            // Found the matching opening parenthesis
            return {
                head: trimmed.substring(0, i).trim(),
                tail: trimmed.substring(i + 1, trimmed.length - 1)
            };
        }
    }
    return null;
}

class ScraperManager {
  constructor() {
    this.isVerbose = false;
  }

  setIsVerbose(verbose) {
    this.isVerbose = verbose;
  }

  extractMatches(html) {
    const dom = new JSDOM(html);
    const window = dom.window;
    const document = window.document;
    const matches = [];

    try {
        const matchCards = document.querySelectorAll("span.MatchCard");
        
        for (let i = 0; i < matchCards.length; i++) {
            const matchCard = matchCards[i];

            // Validation Checks
            if (matchCard.innerHTML.match(/\[[^\]]*<a/)) {
                logger("Match skipped (Invalid format: Link inside brackets): " + matchCard.textContent, "error", section, this.isVerbose);
                continue;
            }

            const matchText = matchCard.textContent;
            const entities = []; 
            const linkMap = new Map(); 

            // Link Processing
            const links = matchCard.querySelectorAll("a");
            for(let link of links) {
                const href = link.getAttribute("href") || "";
                const params = new URLSearchParams(href.substring(1));
                const idStr = params.get("id"); 
                const nr = params.get("nr");
                const name = cleanMatchesText(link.textContent.trim());

                if (nr && (idStr === "2" || idStr === "28" || idStr === "29")) {
                    let type = "wrestler";
                    if (idStr === "28") type = "team";
                    if (idStr === "29") type = "stable";
                    
                    const entity = { id: nr, type: type, name: name };
                    entities.push(entity);
                    if (!linkMap.has(name)) linkMap.set(name, []);
                    linkMap.get(name).push(entity);
                }
            }

            // Metadata Extraction
            const row = matchCard.closest("tr");
            const dateCell = row ? row.querySelector("td.TCol.TColSeparator") : null;
            const date = dateCell ? dateCell.textContent : "";
            
            const promotionImages = row ? row.querySelectorAll("img.ImagePromotionLogoMini.ImagePromotionLogo_mini") : null;
            const promotions = [];
            if (promotionImages) {
                promotionImages.forEach(img => promotions.push(img.getAttribute("alt")));
            }

            const eventLine = matchCard.nextElementSibling;
            let eventName = "", eventLocation = "", eventType = "";
            if (eventLine) {
                const eventLink = eventLine.querySelector("a");
                eventName = eventLink ? eventLink.textContent : "";
                const parts = eventLine.textContent.split("@");
                eventLocation = parts[1] ? parts[1].trim() : "";
                eventType = parts[0] ? parts[0].split(" - ").slice(-1)[0].trim() : "";
            }

            if (!matchText.includes(" defeats ") && !matchText.includes(" defeat ") && !matchText.includes(" vs. ")) {
                logger("Match skipped (bad format): " + matchText, "error", section, this.isVerbose);
                continue;
            }
            if (Array.from(matchText.matchAll(/\sdefeats?\s/g)).length > 1) {
                logger("Match skipped (bad format): " + matchText, "error", section, this.isVerbose);
                continue;
            }

            const durationMatch = matchText.match(/\((\d+:\d+)\)/);
            const duration = durationMatch ? durationMatch[1] : "";
            const isDraw = !matchText.includes(" defeat") && matchText.includes(" vs. ");
            const isTeam = matchText.includes(" & ");
            
            // Match Type
            const matchTypeCell = row ? row.querySelector("span.MatchType") : null;
            let matchType = matchTypeCell ? matchTypeCell.textContent.replace(":", "") : "";
            const titles = [];
            const isTitleChange = row ? !!row.querySelector("span.MatchTitleChange") : false;
            
            if (matchTypeCell) {
                const titleLinks = matchTypeCell.querySelectorAll("a");
                for(let link of titleLinks) {
                    const href = link.getAttribute("href") || "";
                    const params = new URLSearchParams(href.substring(1));
                    const name = link.textContent.trim();
                    matchType = matchType.replace(name, "");
                    
                    if (params.get("id") === "5" && (matchText.includes("(c)") || isTitleChange)) {
                        titles.push({ id: params.get("nr"), name: name });
                    }
                }
            }
            matchType = matchType.replace(" / ", "").trim();

            const resolveEntity = (rawText, forceType = null) => {
                const cleanName = cleanMatchesText(rawText);
                if(!cleanName) return null;

                // 1. Try to extract members from the last parenthesized group
                // Input: "Step Brothers (Dragon & Nighthawk) (The Scoop & Tommy Ellis)"
                // Output: head="Step Brothers (Dragon & Nighthawk)", tail="The Scoop & Tommy Ellis"
                const splitResult = extractLastBalancedGroup(cleanName);

                // Only treat as structured team if it looks like one AND contains separators or is an alias wrapper
                if (splitResult) {
                    let teamName = splitResult.head;
                    const membersContent = splitResult.tail;

                    // 2. Check if the 'teamName' ITSELF has an alias group to discard
                    // Input: "Step Brothers (Dragon & Nighthawk)"
                    // Output: head="Step Brothers", tail="Dragon & Nighthawk"
                    const aliasSplit = extractLastBalancedGroup(teamName);
                    if (aliasSplit) {
                        // We discard the tail (the alias list) and keep the real name
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

                    // Alias Check: Unregistered wrapper with 1 member -> Return inner member
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
                    
                    // 1. Check for Implicit Teams/Lists FIRST (Split by & or ,)
                    // This fixes the "Team A (...) & Team B (...)" issue
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

                    // 2. Resolve Single Entity / Structured Team
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
        }
    } finally {
        window.close();
    }

    return matches;
  }
}

module.exports = ScraperManager;