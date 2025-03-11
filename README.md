# Cagematch Scraper

The Cagematch Scraper is a Node.js project designed to scrape data from the Cagematch website and convert it into JSON format.

## Overview

The `CagematchScraper` class is responsible for scraping match data from the Cagematch website. It uses the `RequestManager` to fetch match data and the `ScraperManager` to extract match details from the HTML. 

## JSON Structure Examples

### Singles Matches
```json
{
    "date": "01.03.2025",
    "promotions": [
        "World Wrestling Entertainment"
    ],
    "eventType": "Premium Live Event",
    "event": "WWE Elimination Chamber 2025 - Toronto",
    "location": "Rogers Centre in Toronto, Ontario, Canada",
    "matchType": "Unsanctioned",
    "titles": [],
    "isTitleChange": false,
    "duration": "27:35",
    "isDraw": false,
    "isTeam": false,
    "entities": [
        {
            "type": "wrestler",
            "id": "1499",
            "isMainEntity": true,
            "name": "Kevin Owens"
        },
        {
            "type": "wrestler",
            "id": "1523",
            "isMainEntity": true,
            "name": "Sami Zayn"
        }
    ],
    "winners": [
        {
            "type": "wrestler",
            "id": "1499",
            "isMainEntity": true,
            "name": "Kevin Owens"
        }
    ],
    "losers": [
        {
            "type": "wrestler",
            "id": "1523",
            "isMainEntity": true,
            "name": "Sami Zayn"
        }
    ]
}
```

### Tag Team Matches
```json
{
    "date": "01.03.2025",
    "promotions": [
        "All Elite Wrestling"
    ],
    "eventType": "TV-Show",
    "event": "AEW Collision #82",
    "location": "Oakland Arena in Oakland, California, USA",
    "matchType": "",
    "titles": [],
    "isTitleChange": false,
    "duration": "15:23",
    "isDraw": false,
    "isTeam": true,
    "entities": [
        {
            "type": "stable",
            "id": "3877",
            "name": "The Undisputed Kingdom",
            "isMainEntity": true,
            "members": [
                {
                    "type": "wrestler",
                    "id": "4006",
                    "name": "Kyle O'Reilly"
                },
                {
                    "type": "wrestler",
                    "id": "31",
                    "name": "Roderick Strong"
                }
            ]
        },
        {
            "type": "wrestler",
            "id": "4006",
            "name": "Kyle O'Reilly"
        },
        {
            "type": "wrestler",
            "id": "31",
            "name": "Roderick Strong"
        },
        {
            "type": "team",
            "id": "5470",
            "name": "FTR",
            "isMainEntity": true,
            "members": [
                {
                    "type": "wrestler",
                    "id": "7159",
                    "name": "Cash Wheeler"
                },
                {
                    "type": "wrestler",
                    "id": "12068",
                    "name": "Dax Harwood"
                }
            ]
        },
        {
            "type": "wrestler",
            "id": "7159",
            "name": "Cash Wheeler"
        },
        {
            "type": "wrestler",
            "id": "12068",
            "name": "Dax Harwood"
        }
    ],
    "winners": [
        {
            "type": "stable",
            "id": "3877",
            "name": "The Undisputed Kingdom",
            "isMainEntity": true,
            "members": [
                {
                    "type": "wrestler",
                    "id": "4006",
                    "name": "Kyle O'Reilly"
                },
                {
                    "type": "wrestler",
                    "id": "31",
                    "name": "Roderick Strong"
                }
            ]
        }
    ],
    "losers": [
        {
            "type": "team",
            "id": "5470",
            "name": "FTR",
            "isMainEntity": true,
            "members": [
                {
                    "type": "wrestler",
                    "id": "7159",
                    "name": "Cash Wheeler"
                },
                {
                    "type": "wrestler",
                    "id": "12068",
                    "name": "Dax Harwood"
                }
            ]
        }
    ]
}
```
## Logging

All classes include a `setIsVerbose` method that enables log visualization for the requesting and scraping processes. Alternatively, you can set the `NODE_DEBUG` environment variable to `CAGEMATCH-SCRAPER*` to view all logs.

## Generating Matches File for a Specific Date

To generate the matches file for a specific date, use the `generateMatchesFile` command:

```sh
npm run generateMatchesFile [day] [month] [year] [optional: verbose (true|false)]
```

For example, to generate the matches file for March 15, 2023, run:

```sh
npm run generateMatchesFile 15 3 2023
```
Once executed, it will generate a `result.json` file in your folder.

