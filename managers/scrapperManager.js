const { JSDOM } = require('jsdom');

class ScrapperManager {
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
        
        // Process each match card using a for loop
        for (let i = 0; i < matchCards.length; i++) {
          const matchCard = matchCards[i];
          
          // Get the parent row to access date information
          const row = matchCard.closest("tr");
          const dateCell = row ? row.querySelector("td.TCol.TColSeparator") : null;
          const date = dateCell ? dateCell.textContent : "";
          
          // Get the match event line for additional context
          const eventLine = matchCard.nextElementSibling;
          let eventName = "";
          let eventLocation = "";
          
          if (eventLine) {
            const eventLink = eventLine.querySelector("a");
            eventName = eventLink ? eventLink.textContent : "";
            eventLocation = eventLine.textContent.split("@")[1] ? eventLine.textContent.split("@")[1].trim() : "";
          }
          
          // Extract match duration if available
          const matchText = matchCard.textContent;
          const durationMatch = matchText.match(/\((\d+:\d+)\)/);
          const duration = durationMatch ? durationMatch[1] : "";
          
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
                const memberNames = membersString.split("&");
                
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
                      name: memberName
                    });
                  }
                }
              }
              
              entities.push({
                type: "team",
                id: nr,
                name: name,
                members: members
              });
            }
          }
          
          // Determine winners and losers
          // The pattern is typically "[winners] defeat[s] [losers]"
          const matchPattern = /(.+?) defeats? (.+?)(\(\d+:\d+\)|$)/i;
          const teamMatchPattern = /(.+?) defeat (.+?)(\(\d+:\d+\)|$)/i;
          
          let winners = [];
          let losers = [];

          const isDraw = !matchText.includes("defeat");
          
          // Check for singles match pattern first
          const singleMatchResult = matchText.match(matchPattern);
          if (singleMatchResult) {
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
            const teamMatchResult = matchText.match(teamMatchPattern);
            if (teamMatchResult) {
              const winnersText = teamMatchResult[1].trim();
              const losersText = teamMatchResult[2].trim();
              
              // Find winners
              for (let j = 0; j < entities.length; j++) {
                if (winnersText.includes(entities[j].name)) {
                  winners.push(entities[j]);
                }
              }
              
              // Find losers
              for (let j = 0; j < entities.length; j++) {
                if (losersText.includes(entities[j].name)) {
                  losers.push(entities[j]);
                }
              }
            }
          }
          
          // Create the match object
          const match = {
            date: date,
            event: eventName,
            location: eventLocation,
            duration: duration,
            isDraw: isDraw,
            entities: entities,
            winners: winners,
            losers: losers
          };
          
          matches.push(match);
        }
        
        return matches;
      }

}

module.exports = ScrapperManager;