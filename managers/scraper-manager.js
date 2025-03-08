const { JSDOM } = require('jsdom');
const { splitWithParenthesisHandling } = require('../utility/utility-functions');

class ScraperManager {
  constructor() {
  }




  /**
  * Extracts wrestling match data from HTML content
  * @param {string} html - The HTML content to parse
  * @return {Array} - Array of match objects with structured data
  */
  extractMatches(html) {
    // Use JSDOM to parse the HTML

    const dom = new JSDOM(html);
    const document = dom.window.document;

    // Find all match cards
    const matchCards = document.querySelectorAll("span.MatchCard");
    const matches = [];

    /**
    * @param {string} text 
    * @returns {string}
    */
    const cleanMatchesText = function (text) {
      return text.replace(" (c)", "") // Example A vs B (c)
        .replace(/\(\d{1,2}:\d{2}\)/g, "") // Example A vs B (10:00)
        .replace(/\s-\s.*$/g, "") // Example A vs B - Double Count Out
        .replace(/\sby\s.*$/g, "") // Example A vs B by DQ
        .replace(/\s*\[\d{1,2}:\d{1,2}\]\s*/g, "") // Example A vs B [2:1]
        .replace(/\s*\[[^\]]*?\]/g, "") // Example A [1] vs B [2]
        .trim();
    }

    /**
     * 
     * @param {string} text 
     * @param {any[]} entities 
     * @returns 
     */
    const createWrestlerFromText = function (text, entities) {
      const wrestlerName = text.trim();
      if (!entities.some(e => e.name === wrestlerName && e.type === "wrestler")) {
        const wrestler = {
          id: null,
          type: "wrestler",
          name: wrestlerName
        };
        return wrestler;
      } else {
        const wrestler = entities.find(e => e.name === wrestlerName && e.type === "wrestler");
        return Object.assign(wrestler, {});
      }
    }
    /**
     * 
     * @param {string} text 
     * @param {any[]} entities 
     * @returns 
     */
    const createTeamFromText = function (text, entities) {
      if (!text.trim().match(/^[^,&]*\(.*\)$/)) {
        return null;
      }
      const teamName = text.substring(0, text.lastIndexOf("(")).trim();
      const membersMatch = text.match(/\(([^)]+)\)/);
      if (!entities.some(e => e.name === teamName && (e.type === "team" || e.type === "stable"))) {
        const members = [];
        if (membersMatch) {
          const membersString = membersMatch[1];
          // Split by & and extract members
          const memberNames = membersString.split(/&|,/);

          for (let k = 0; k < memberNames.length; k++) {
            const memberName = memberNames[k].trim();
            const member = createWrestlerFromText(memberName, entities);
            members.push(member);
          }
        }
        return {
          type: "team",
          id: null,
          name: teamName,
          members: members
        };
      }
      return entities.find(e => e.name === teamName && (e.type === "team" || e.type === "stable"));
    }
    // Process each match card using a for loop
    for (let i = 0; i < matchCards.length; i++) {
      const matchCard = matchCards[i];

      // Get the parent row to access date information
      const row = matchCard.closest("tr");
      const dateCell = row ? row.querySelector("td.TCol.TColSeparator") : null;
      const date = dateCell ? dateCell.textContent : "";
      const promotionImages = row ? row.querySelectorAll("img.ImagePromotionLogoMini.ImagePromotionLogo_mini") : null;
      const promotions = [];
      if(promotionImages && promotionImages.length > 0){
        for (let j = 0; j < promotionImages.length; j++) {
          const promotionImage = promotionImages.item(j);
          const promotion = promotionImage ? promotionImage.getAttribute("alt") : "";
          promotions.push(promotion);
        }
      }

      // Get the match event line for additional context
      const eventLine = matchCard.nextElementSibling;
      let eventName = "";
      let eventLocation = "";
      let eventType = "";

      if (eventLine) {
        const eventLink = eventLine.querySelector("a");
        eventName = eventLink ? eventLink.textContent : "";
        eventLocation = eventLine.textContent.split("@")[1] ? eventLine.textContent.split("@")[1].trim() : "";
        eventType = eventLine.textContent.split("@")[0] ?
          eventLine.textContent.split("@")[0].split(" - ").slice(-1)[0].trim()
          : "";
      }

      // Extract match duration if available
      const matchText = matchCard.textContent;
      if (!matchText.includes(" defeats ") && !matchText.includes(" defeat ") && !matchText.includes(" vs. ")) {
        console.log("Error Scrapping Match:" + matchText);
        continue;
      }
      const durationMatch = matchText.match(/\((\d+:\d+)\)/);
      const duration = durationMatch ? durationMatch[1] : "";
      const isDraw = !matchText.includes(" defeat") && matchText.includes(" vs. ");
      const isTeam = matchText.includes(" & ");
      const titleChangeCell = row ? row.querySelector("span.MatchTitleChange") : null;
      const isTitleChange = titleChangeCell ? true : false;
      const matchTypeCell = row ? row.querySelector("span.MatchType") : null;
      let matchType = matchTypeCell ? matchTypeCell.textContent : "";
      matchType = matchType.replace(":", "");
      const titlesLink = matchTypeCell ? matchTypeCell.querySelectorAll("a") : [];
      const titles = [];
      for (let j = 0; j < titlesLink.length; j++) {
        const titleLink = titlesLink[j];
        const href = titleLink.getAttribute("href") || "";
        const params = new URLSearchParams(href.substring(1));
        const id = params.get("id");
        const nr = params.get("nr");
        const name = titleLink.textContent.trim();
        matchType = matchType.replace(name, "");
        if (id === "5" && (matchText.includes("(c)") || isTitleChange)) {
          titles.push({
            id: nr,
            name: name
          });
        }
      }

      matchType = matchType.replace(" / ", "").trim();
      // Parse wrestlers and teams
      const entities = [];
      const links = matchCard.querySelectorAll("a");
      // Extract all wrestlers and teams with for loop
      for (let j = 0; j < links.length; j++) {
        const link = links[j];
        const href = link.getAttribute("href") || "";
        const params = new URLSearchParams(href.substring(1));
        const id = params.get("id");
        const nr = params.get("nr");
        const name = link.textContent.trim();

        // Check if this is a wrestler (id=2), team (id=28) or faction (id=29)
        if (id === "2") {
          entities.push({
            type: "wrestler",
            id: nr,
            name: name
          });
        } else if (id === "28" || id === "29") {
          // Extract team members if available
          const membersText = matchText.substring(
            matchText.indexOf(name) + name.length
          );
          const membersMatch = membersText.match(/\(([^)]+)\)/);
          let members = [];

          if (membersMatch) {
            const membersString = membersMatch[1];
            // Split by & and extract members
            const memberNames = membersString.split(/&|,/);

            for (let k = 0; k < memberNames.length; k++) {
              const memberName = memberNames[k].trim();
              let memberId = null;

              // Find the wrestler object that matches this name
              for (let l = 0; l < links.length; l++) {
                if (links[l].textContent.trim() === memberName) {
                  const memberHref = links[l].getAttribute("href") || "";
                  const memberParams = new URLSearchParams(memberHref.substring(1));
                  memberId = memberParams.get("nr");
                  break;
                }
              }

              if (memberId) {
                members.push({
                  type: "wrestler",
                  id: memberId,
                  name: memberName
                });
              } else {
                members.push({
                  type: "wrestler",
                  id: null,
                  name: memberName
                });
              }
            }
          }

          entities.push({
            type: id == 28 ? "team" : "stable",
            id: nr,
            name: name,
            members: members
          });
        }
      }
      if (!isTeam && !isDraw) {
        const separator = matchText.includes(" defeats ") ? " defeats " : " defeat ";
        if (matchText.split(" defeats ").length < 2) {
          console.log(matchText);
        }
        const winnerText = cleanMatchesText(matchText.split(" defeats ")[0]);
        const loserText = cleanMatchesText(matchText.split(" defeats ")[1]);
        if (!entities.some(e => e.name === winnerText)) {
          entities.push({
            id: null,
            type: "wrestler",
            name: winnerText
          });
        }
        const losersNames = loserText.split(" and ").map(l => l.trim());
        for (let j = 0; j < losersNames.length; j++) {
          if (!entities.some(e => e.name === losersNames[j])) {
            entities.push({
              id: null,
              type: "wrestler",
              name: losersNames[j]
            });
          }
        }
      }
      if (isTeam && !isDraw) {
        const separator = matchText.includes(" defeat ") ? " defeat " : " defeats ";
        const winnerText = cleanMatchesText(matchText.split(separator)[0]);
        const loserText = cleanMatchesText(matchText.split(separator)[1]);

        const winners = splitWithParenthesisHandling(winnerText);
        if (winners.length == 1 && winnerText.match(/^[^,&]*\(.*\)$/)) {
          const team = createTeamFromText(winnerText, entities);
          if (team && team.id === null) {
            entities.push(team);
          }
        } else if (winners.length == 1 && !winnerText.match(/^[^,&]*\(.*\)$/)) {
          const wrestler = createWrestlerFromText(winnerText, entities);
          entities.push({
            id: null,
            type: "team",
            name: winnerText,
            members: [wrestler]
          });
        } else if (winners.length > 1) {
          const members = [];
          for (let j = 0; j < winners.length; j++) {
            const winner = winners[j];
            if (winner.match(/^[^,&]*\(.*\)$/)) {
              const team = createTeamFromText(winner, entities);
              if (team && team.id === null) {
                entities.push(team);
              }
              members.push(team);
            } else {
              const wrestler = createWrestlerFromText(winner, entities);
              members.push(wrestler);
              if(!entities.some(e => e.name === wrestler.name)){
                entities.push(wrestler);
              }
            }
          }
          entities.push({
            id: null,
            type: "team",
            name: winnerText,
            members: members
          });
        }

        const losersNames = loserText.split(" and ").map(l => l.trim());
        for (let j = 0; j < losersNames.length; j++) {
          const losers = splitWithParenthesisHandling(losersNames[j]);
          const losersName = losersNames[j];
          if (losers.length == 1 && losersName.match(/^[^,&]*\(.*\)$/)) {
            const team = createTeamFromText(losersName, entities);
            if (team && team.id === null) {
              entities.push(team);
            }
          } else if (losers.length == 1 && !losersName.match(/^[^,&]*\(.*\)$/)) {
            const wrestler = createWrestlerFromText(losersName, entities);
            entities.push({
              id: null,
              type: "team",
              name: losersName,
              members: [wrestler]
            });
          } else if (losers.length > 1) {
            const members = [];
            for (let j = 0; j < losers.length; j++) {
              const winner = losers[j];
              if (winner.match(/^[^,&]*\(.*\)$/)) {
                const team = createTeamFromText(winner, entities);
                if (team && team.id === null) {
                  entities.push(team);
                }
                members.push(team);
              } else {
                const wrestler = createWrestlerFromText(winner, entities);
                members.push(wrestler);
                if(!entities.some(e => e.name === wrestler.name)){
                  entities.push(wrestler);
                }
              }
            }
            entities.push({
              id: null,
              type: "team",
              name: losersName,
              members: members
            });
          }
        }
      }
      if (!isTeam && isDraw) {
        const fighters = cleanMatchesText(matchText).split(" vs. ");

        for (let j = 0; j < fighters.length; j++) {
          if (!entities.some(e => e.name === fighters[j].trim())) {
            entities.push({
              id: null,
              type: "wrestler",
              name: fighters[j].trim()
            });
          }
        }
      }
      // Determine winners and losers
      // The pattern is typically "[winners] defeat[s] [losers]"
      const matchPattern = /(.+?) defeats? (.+?)(\(\d+:\d+\)|$)/i;
      //const teamMatchPattern = /(.+?) defeat (.+?)(\(\d+:\d+\)|$)/i;

      let winners = [];
      let losers = [];


      // Check for singles match pattern first
      const singleMatchResult = cleanMatchesText(matchText).match(matchPattern);
      if (singleMatchResult && !isTeam) {
        const winnerName = singleMatchResult[1].trim();
        const loserName = singleMatchResult[2].trim();


        // Find winners
        for (let j = 0; j < entities.length; j++) {
          if (winnerName.includes(entities[j].name)) {
            winners.push(entities[j]);
          }
        }

        // Find losers
        for (let j = 0; j < entities.length; j++) {
          if (loserName.includes(entities[j].name)) {
            losers.push(entities[j]);
          }
        }
      } else {
        // Check for team match pattern
        const teamMatchResult = cleanMatchesText(matchText).match(matchPattern);
        if (teamMatchResult) {
          const winnersText = teamMatchResult[1].trim();
          const losersText = teamMatchResult[2].trim();
          if(winnersText.match(/^[^,&]*\(.*\)$/)){
            const team = createTeamFromText(winnersText, entities);
            if (team) {
              winners.push(team);
            }
          } else {
            const team = entities.find(e => e.name === winnersText && (e.type === "team" || e.type === "stable"));
            winners.push(team);
          }

          const loserTextList = losersText.split(" and ");
          for (let j = 0; j < loserTextList.length; j++) {
            const loserText = loserTextList[j];
            if(loserText.match(/^[^,&]*\(.*\)$/)){
              const team = createTeamFromText(loserText, entities);
              if (team) {
                losers.push(team);
              }
            } else {
              const team = entities.find(e => e.name === loserText && (e.type === "team" || e.type === "stable"));
              losers.push(team);
            }
          }
        }
      }

      // Create the match object
      const match = {
        date: date,
        promotions: promotions,
        eventType: eventType,
        event: eventName,
        location: eventLocation,
        matchType: matchType,
        titles: titles,
        isTitleChange: isTitleChange,
        duration: duration,
        isDraw: isDraw,
        isTeam: isTeam,
        entities: entities,
        winners: winners,
        losers: losers
      };

      matches.push(match);
    }

    return matches;
  }

}

module.exports = ScraperManager;