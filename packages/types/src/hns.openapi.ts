export interface paths {
    "/api/live/team/{teamId}/teams": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Club Teams
         * @description List of teams underneath a specific club
         */
        get: operations["getClubTeams"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/live/team/{teamId}/matches/paginated/past/{utcOffset}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Team Matches Past and Today
         * @description List of matches of a specific club/team in the past, with all today's matches included. List is ordered by dateTimeUTC of the match descending. Attribute 'allowDetail' defines if the caller has permission to call match details endpoints for the match
         */
        get: operations["getPastTeamMatches"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/live/team/{teamId}/matches/paginated/future/{utcOffset}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Team Matches Future
         * @description List of matches of a specific club/team in the future, excluding all today's matches. List is ordered by dateTimeUTC of the match ascending.
         */
        get: operations["getNextTeamMatches"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/live/team/{teamId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Team Details
         * @description Single representation of a specific club/team
         */
        get: operations["getTeamDetails"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/live/team/search": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Endpoint used for searching the clubs/teams */
        get: operations["searchTeams"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/live/team/fifaId/{fifaId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Team Details by FIFA ID
         * @description Single representation of a specific club/team by FIFA ID
         */
        get: operations["getTeamDetailsByFIFAId"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/live/player/{personId}/stats": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Player Competition Statistics
         * @description Statistics of an individual player, grouped by competitions where the player had appearances. Attribute 'allowDetail' defines if the caller has permission to call competition details endpoints for the competition
         */
        get: operations["getPlayerStatistics"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/live/player/{personId}/stats/{teamId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Player Competition Statistics
         * @description Statistics of an individual player, grouped by competitions where the player had appearances. Attribute 'allowDetail' defines if the caller has permission to call competition details endpoints for the competition
         */
        get: operations["getPlayerStatistics_2"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/live/player/{personId}/matches/paginated/all": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Player Match Appearances
         * @description List of match appearances for a specific player. The list is ordered by dateTimeUTC of the match. Attribute 'allowDetail' defines if the caller has permission to call match details endpoints for the match
         */
        get: operations["getPlayerMatches"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/live/player/{personId}/matches/paginated/{teamId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Player Match Appearances
         * @description List of match appearances for a specific player. The list is ordered by dateTimeUTC of the match. Attribute 'allowDetail' defines if the caller has permission to call match details endpoints for the match
         */
        get: operations["getPlayerMatches_2"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/live/player/{personId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Player Details
         * @description Single representation of an individual player
         */
        get: operations["getPlayerDetails"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/live/player/search": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Endpoint used for searching the players */
        get: operations["searchPlayers"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/live/player/fifaId/{fifaId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Player Details by FIFA ID
         * @description Single representation of an individual player by FIFA ID
         */
        get: operations["getPlayerDetailsByFIFAID"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/live/newsSources/{newsSourceId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Reading news source and returning JSON representation
         * @description Returns list of news sources configured for given device
         */
        get: operations["readNewsSource"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/live/matchListLite/{date}/{utcOffset}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List of Matches on a Specific Day
         * @description List of matches on a specific day in a specific timezone. Matches are ordered by organization type, competition rank, age category, competition name, competition id, match date/time and match order number. Response is in lite format
         */
        get: operations["getMatchListLite"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/live/matchListLite/live": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List of Live Matches
         * @description List of matches currently being played and managed in live mode. Matches are ordered by organization type, competition rank, age category, competition name, competition id, match date/time and match order number
         */
        get: operations["getMatchListLite_2"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/live/matchList4Map/{date}/{utcOffset}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List of Matches on a Specific Day
         * @description List of matches on a specific day in a specific timezone. Matches are ordered by organization type, competition rank, age category, competition name, competition id, match date/time and match order number. Response includes geolocation of matches.
         */
        get: operations["getMatchList4Map"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/live/matchList/{date}/{utcOffset}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List of Matches on a Specific Day
         * @description List of matches on a specific day in a specific timezone. Matches are ordered by organization type, competition rank, age category, competition name, competition id, match date/time and match order number.
         */
        get: operations["getMatchList"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/live/matchList/live": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List of Live Matches
         * @description List of matches currently being played and managed in live mode. Matches are ordered by organization type, competition rank, age category, competition name, competition id, match date/time and match order number
         */
        get: operations["getMatchListLive"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/live/match/{matchId}/standings": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Match team standings
         * @description Team standings on the match's competition. It is the unofficial standings. If team is playing match at the moment in live mode, there will be a sign of how it's doing in the match (W/D/L). Both teams will have highlight set to true so that mobile app can highlight teams that are playing in this match.
         */
        get: operations["getMatchStandings"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/live/match/{matchId}/lineups": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Team Lineups
         * @description Lineups for both clubs/teams in a specific match. The player will have ID if the caller can call the player details endpoint
         */
        get: operations["getLineups"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/live/match/{matchId}/info": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Match Additional Details
         * @description Single representation of a specific match, with additional match details, such as team kits, referees and officials
         */
        get: operations["getMatchInfo"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/live/match/{matchId}/h2h/{utcOffset}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Head 2 head list of matches of two teams playing the match
         * @description Single representation of a specific match, with standard match information
         */
        get: operations["getHead2Head"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/live/match/{matchId}/events": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Match Events
         * @description List of match events for a sepcific match
         */
        get: operations["getMatchEvents"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/live/match/{matchId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Match Info
         * @description Single representation of a specific match, with standard match information
         */
        get: operations["getMatchDetails"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/live/mapOverlay/{styleName}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Map Overlay Endpoint */
        get: operations["searchPlayers_2"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/live/kits/{kit}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Match Additional Details
         * @description Single representation of a specific match, with additional match details, such as team kits, referees and officials
         */
        get: operations["getKit"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/live/images/{uuid}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Image File
         * @description Returns an image by a specific uuid. First time, the image is retrieved from COMET, and afterwards it is returned from locally stored version
         */
        get: operations["exportImages"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/live/formation/match/{matchId}/matchClub/{homeOrAway}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Team Formation
         * @description Formation for both clubs/teams in a specific match.
         */
        get: operations["getMatchClubFormation"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/live/competition/{competitionId}/teams": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Competition teams
         * @description List of teams participating in the competition. Used for filtering statistics
         */
        get: operations["getCompetitionTeams"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/live/competition/{competitionId}/table/unofficial": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Unofficial Competition Table
         * @description Unofficial table of clubs/teams for a specific competition, including matches that are not officialised, i.e. set to PLAYED status. If team is playing match at the moment in live mode, there will be a sign of how it's doing in the match (W/D/L)
         */
        get: operations["getUnofficialTable"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/live/competition/{competitionId}/table/official": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Official Competition Table
         * @description Official table of clubs/teams for a specific competition. Only officialized (set to PLAYED status) matches are considered. Field 'allowDetail' defines if caller is allowed to call team details endpoints (team details, team matches events...). Value of the field depends on tenant/organizationIdFilter/teamIdFilter
         */
        get: operations["getOfficialTable"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/live/competition/{competitionId}/stats/yellowCards": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Competition Yellow Cards
         * @description Yellow cards in a specific competition, grouped by player. Can be filtered by team
         */
        get: operations["getYellowCards"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/live/competition/{competitionId}/stats/yellowCards/{teamId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Competition Yellow Cards
         * @description Yellow cards in a specific competition, grouped by player. Can be filtered by team
         */
        get: operations["getYellowCards_2"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/live/competition/{competitionId}/stats/sinBins": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Competition Sin Bins
         * @description Sin bins in a specific competition, grouped by player. Can be filtered by team
         */
        get: operations["getSinBins"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/live/competition/{competitionId}/stats/sinBins/{teamId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Competition Sin Bins
         * @description Sin bins in a specific competition, grouped by player. Can be filtered by team
         */
        get: operations["getSinBins_2"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/live/competition/{competitionId}/stats/redCards": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Competition Red Cards
         * @description Red cards in a specific competition, grouped by player. Can be filtered by team
         */
        get: operations["getRedCards"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/live/competition/{competitionId}/stats/redCards/{teamId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Competition Red Cards
         * @description Red cards in a specific competition, grouped by player. Can be filtered by team
         */
        get: operations["getRedCards_2"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/live/competition/{competitionId}/stats/ownGoals": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Competition Own Goals
         * @description Own goals in a specific competition, grouped by player. Can be filtered by team
         */
        get: operations["getOwnScorers"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/live/competition/{competitionId}/stats/ownGoals/{teamId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Competition Own Goals
         * @description Own goals in a specific competition, grouped by player. Can be filtered by team
         */
        get: operations["getOwnScorers_2"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/live/competition/{competitionId}/stats/goals": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Competition Goals
         * @description Goals in a specific competition, grouped by player, including goals and penalty goals, and excluding penalty shootout goals. Can be filtered by team
         */
        get: operations["getTopScorers"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/live/competition/{competitionId}/stats/goals/{teamId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Competition Goals
         * @description Goals in a specific competition, grouped by player, including goals and penalty goals, and excluding penalty shootout goals. Can be filtered by team
         */
        get: operations["getTopScorers_2"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/live/competition/{competitionId}/stats/assists": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Competition Assists
         * @description Assists in a specific competition, grouped by player. Can be filtered by team
         */
        get: operations["getAssists"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/live/competition/{competitionId}/stats/assists/{teamId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Competition Assists
         * @description Assists in a specific competition, grouped by player. Can be filtered by team
         */
        get: operations["getAssists_2"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/live/competition/{competitionId}/matches/paginated/past/{utcOffset}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Competition Matches Past and Today
         * @description List of matches of a specific competition in the past, with all today's matches included. List is ordered by dateTimeUTC of the match descending.
         */
        get: operations["getPastCompetitionMatches"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/live/competition/{competitionId}/matches/paginated/past/{utcOffset}/{teamId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Competition Matches Past and Today
         * @description List of matches of a specific competition in the past, with all today's matches included. List is ordered by dateTimeUTC of the match descending.
         */
        get: operations["getPastCompetitionMatches_2"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/live/competition/{competitionId}/matches/paginated/future/{utcOffset}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Competition Matches Future
         * @description List of matches of a specific competition in the future, excluding all today's matches. List is ordered by dateTimeUTC of the match ascending.
         */
        get: operations["getNextCompetitionMatches"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/live/competition/{competitionId}/matches/paginated/future/{utcOffset}/{teamId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Competition Matches Future
         * @description List of matches of a specific competition in the future, excluding all today's matches. List is ordered by dateTimeUTC of the match ascending.
         */
        get: operations["getNextCompetitionMatches_2"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/live/competition/{competitionId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Competition Details
         * @description Competition details including competition elements if there are any, ordered by competition order number and competition id.
         */
        get: operations["getCompetitionDetails"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/live/competition/search": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Endpoint used for searching the competitions. It returns only parent competitions and never child competitions. */
        get: operations["searchCompetitions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/live/competition/list/{status}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List of competitions
         * @description List of competitions filtered by given parameters (team and status)
         */
        get: operations["getCompetitions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/live/competition/list/{status}/{teamId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List of competitions
         * @description List of competitions filtered by given parameters (team and status)
         */
        get: operations["getCompetitions_2"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/sendRssNotification": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Sends push notification about RSS news */
        get: operations["sendRssNotification"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        /** @description Error message model */
        ErrorMessage: {
            /**
             * @description Description of the error in human readable language
             * @example Error getting data
             */
            message: string;
            /**
             * @description Severity of the error. i.e. info/warn/error
             * @example error
             * @enum {string}
             */
            severity: "info" | "warn" | "error";
            /**
             * Format: int64
             * @description Numerical representation of type of the error for some of the special error cases. i.e. 1 - Refresh, 2 - deactivated, 100 - Duplicate Device ID etc.
             * @example 1
             */
            type?: number;
            /**
             * @description Additional information from backend that the client can use to improve it's behaviour. i.e. if the error is duplicate notification id, the backend can send the old device id in this field.
             * @example {
             *       "oldDeviceId": "kuuhdf87shdfiu7h43iuwehfis7dfio"
             *     }
             */
            additionalInfo?: {
                [key: string]: Record<string, never>;
            };
        };
        /** @description Generic model for presenting error messages when request resulted in 4XX status code. */
        ExceptionViewModel: {
            /** @description List of error messages. */
            messages?: components["schemas"]["ErrorMessage"][];
            /**
             * @deprecated
             * @description Error message. Deprecated, use messages instead.
             */
            message?: string;
        };
        Facility: {
            /**
             * Format: int64
             * @example 68517
             */
            id?: number;
            /** @example 105JR3M */
            fifaId?: string;
            /** @example Gradski Stadion Poljud */
            name?: string;
            /**
             * @description street address of the stadium
             * @example 8. Mediteranskih Igara 2, 21000 Split, Croatia
             */
            address?: string;
            /**
             * @description town or place in which the facility is situated
             * @example Split
             */
            place?: string;
            /**
             * Format: double
             * @example 43.51974511745912
             */
            latitude?: number;
            /**
             * Format: double
             * @example 16.43180842454585
             */
            longitude?: number;
            field?: components["schemas"]["FacilityField"];
        };
        FacilityField: {
            /**
             * Format: int64
             * @example 68517
             */
            id?: number;
            /** @example Field 1 */
            name?: string;
        };
        Team: {
            /**
             * Format: int64
             * @example 69335
             */
            id?: number;
            /** @example A1F348B */
            fifaId?: string;
            /** @example Hajduk Split */
            name?: string;
            /** @example fe195b59-6d02-449c-9cad-0fc837c35bb6 */
            picture?: string;
            /** @example Croatia */
            country?: string;
            /** @example Пинский */
            place?: string;
            /** @example http://www.hajduk.hr/ */
            website?: string;
            /** @example info@hajduk.hr */
            email?: string;
            /** @example +385 21 542345 */
            phone?: string;
            /** @example +385 99 443322 */
            mobilePhone?: string;
            /** @example hajduk */
            facebook?: string;
            /** @example hajduk1911 */
            twitter?: string;
            /** @example hnkhajduk */
            instagram?: string;
            /** @example hnkhajduk */
            vkontakte?: string;
            /** @example hnkhajduk */
            youtube?: string;
            /** @example hnkhajduk */
            linkedIn?: string;
            /** @example hnkhajduk */
            tikTok?: string;
            /** @example hnkhajduk */
            snapchat?: string;
            /** @example 8. Mediteranskih Igara 2, 21000 Split */
            address?: string;
            /**
             * Format: double
             * @example 53.9348057
             */
            latitude?: number;
            /**
             * Format: double
             * @example 27.503433
             */
            longitude?: number;
            /**
             * @description Indicates if there are child teams and should tab on club details with list of teams be shown
             * @example true
             */
            hasTeams?: boolean;
            /**
             * @description defines if caller is allowed to call team details endpoints (team details, team matches events...) Value of the field depends on tenant/organizationIdFilter/teamIdFilter
             * @example true
             */
            allowDetail?: boolean;
            parent?: components["schemas"]["Team"];
            facility?: components["schemas"]["Facility"];
        };
        Competition: {
            /**
             * Format: int64
             * @example 148731
             */
            id?: number;
            /** @example National Cup 2020/2021 Knockout Stage */
            name?: string;
            /**
             * Format: int64
             * @example 130164
             */
            parentId?: number;
            /** @example National Cup 2020/2021 */
            parentName?: string;
            /**
             * @description logo of the competition
             * @example fe195b59-6d02-449c-9cad-0fc837c35bb6
             */
            picture?: string;
            /**
             * @description defines if the competition has standings and should the user be able to see it
             * @example false
             */
            showStandings?: boolean;
            /**
             * @description defines should the user be able to see goal difference
             * @example false
             */
            showGoalDifference?: boolean;
            /**
             * @description defines if the user should see stats tab or the privacy setting is prohibiting it
             * @example false
             */
            showStats?: boolean;
            /**
             * @description defines if the competition has child competitions
             * @example false
             */
            hasChildren?: boolean;
            /**
             * @description defines if the competition is active or inactive
             * @example true
             */
            active?: boolean;
            competitionElements?: components["schemas"]["Competition"][];
        };
        Match: {
            /**
             * Format: int64
             * @example 89942
             */
            id?: number;
            homeTeam?: components["schemas"]["Team"];
            awayTeam?: components["schemas"]["Team"];
            homeTeamResult?: components["schemas"]["Result"];
            awayTeamResult?: components["schemas"]["Result"];
            /**
             * Format: int32
             * @description number of red cards home team received. returned only if match is live
             * @example 1
             */
            homeTeamRedCards?: number;
            /**
             * Format: int32
             * @description number of red cards away team received. returned only if match is live
             * @example 2
             */
            awayTeamRedCards?: number;
            /**
             * @description specifies if the match will be covered with live updates and what is the status if yes. NULL for no live coverage or SCHEDULED, CANCELED, POSTPONED, RUNNING or PLAYED
             * @example RUNNING
             * @enum {string}
             */
            liveStatus?: "SCHEDULED" | "CANCELED" | "POSTPONED" | "RUNNING" | "PLAYED";
            /**
             * Format: int64
             * @description current minute in the match
             * @example 48
             */
            minute?: number;
            /**
             * Format: int64
             * @description UTC date time of the start of the match
             */
            dateTimeUTC?: number;
            /**
             * Format: int64
             * @description competition round - numeric representation
             * @example 3
             */
            matchDay?: number;
            /**
             * Format: int64
             * @description match order number within a round
             * @example 7
             */
            matchOrderNumber?: number;
            /**
             * @description competition round string representation
             * @example 3
             */
            round?: string;
            /**
             * Format: int32
             * @description competition round numeric number to use when ordering matches
             * @example 3
             */
            roundOrder?: number;
            /**
             * Format: int32
             * @description order number of the match within a competition
             * @example 3
             */
            matchNumber?: number;
            /**
             * @description description of the match day
             * @example Third place game
             */
            matchDayDesc?: string;
            /**
             * @description status of the match
             * @example SCHEDULED
             */
            status?: string;
            /**
             * @description description of the status. This could be a reason for postponing a match
             * @example Scheduled
             */
            statusDescription?: string;
            /** @example Walkover */
            resultSupplement?: string;
            /** @example 45+3 */
            currentMinute?: string;
            /** @example AET (PEN 3:1) */
            resultString?: string;
            currentMatchPhase?: components["schemas"]["MatchPhase"];
            competition?: components["schemas"]["Competition"];
            facility?: components["schemas"]["Facility"];
            /**
             * @description Used for player/club matches to identify result of the match for the player's team (Win, Draw or Lost)
             * @example W
             * @enum {string}
             */
            result?: "W" | "D" | "L";
            /**
             * @description Used for player/club matches to identify what side is the given player/team (Home or Away)
             * @example H
             * @enum {string}
             */
            team?: "H" | "A";
            playerMatchStats?: components["schemas"]["PlayerMatchStats"];
            /**
             * Format: int32
             * @description Number of spectators that were on the stadium watching the game
             * @example 2500
             */
            attendance?: number;
            /**
             * @description defines if the user should see events or the privacy setting is prohibiting it
             * @example false
             */
            showEvents?: boolean;
            /**
             * @description defines if caller is allowed to call match details endpoints (match details, match events, lineups, match info...)
             * @example true
             */
            allowDetail?: boolean;
        };
        MatchPhase: {
            /**
             * Format: int64
             * @example 37
             */
            phaseTypeId?: number;
            /** @example First Halftime */
            name?: string;
            /**
             * @example FIRST_HALF
             * @enum {string}
             */
            fcdName?: "FIRST_HALF" | "SECOND_HALF" | "SECOND_ET" | "PEN" | "PER_1" | "PER_2" | "PER_3" | "FIRST_ET" | "BEFORE_THE_MATCH" | "DURING_THE_BREAK" | "AFTER_THE_MATCH";
        };
        PaginatedResults: {
            /** @description List of objects */
            result?: components["schemas"]["Match"][];
            /**
             * Format: int64
             * @description Number of objects in the list
             * @example 17
             */
            size?: number;
        };
        PlayerMatchStats: {
            /**
             * Format: int32
             * @example 79
             */
            minutesPlayed?: number;
            /**
             * Format: int32
             * @description Includes goals from penalties
             * @example 2
             */
            goals?: number;
            /**
             * Format: int32
             * @example 1
             */
            assists?: number;
            /**
             * Format: int32
             * @example 0
             */
            ownGoals?: number;
            /**
             * Format: int32
             * @description Goals scored from penalty kick during the match. Penalty shootout does not count here.
             * @example 1
             */
            penalties?: number;
            /**
             * @description True if player received single yellow card
             * @example true
             */
            singleYellow?: boolean;
            /**
             * @description True if player received single sin bin
             * @example true
             */
            singleSinBin?: boolean;
            /**
             * @description True if player received direct red card on the match
             * @example false
             */
            red?: boolean;
            /**
             * @description True if player received second yellow card
             * @example false
             */
            secondYellow?: boolean;
            /**
             * @description True if player received second sin bin
             * @example false
             */
            secondSinBin?: boolean;
        };
        Result: {
            /**
             * Format: int32
             * @description current result of the match. If the match is not yet started it can be null and not 0
             * @example 2
             */
            current?: number;
            /**
             * Format: int32
             * @description result of the match after regular time
             * @example 2
             */
            regular?: number;
            /**
             * Format: int32
             * @description result of the match after first half
             * @example 1
             */
            half?: number;
            /**
             * Format: int32
             * @description result of the match after extra time
             * @example 2
             */
            extra?: number;
            /**
             * Format: int32
             * @description result of the match after penalty shootout
             * @example 6
             */
            penalties?: number;
            /**
             * @description indicates if the team won on penalty
             * @example true
             */
            penaltyWin?: boolean;
        };
        PaginatedResultsMatch: {
            /** @description List of objects */
            result?: components["schemas"]["Match"][];
            /**
             * Format: int64
             * @description Number of objects in the list
             * @example 17
             */
            size?: number;
        };
        PaginatedResultsTeam: {
            /** @description List of objects */
            result?: components["schemas"]["Team"][];
            /**
             * Format: int64
             * @description Number of objects in the list
             * @example 17
             */
            size?: number;
        };
        PlayerCompetitionStats: {
            /**
             * Format: int32
             * @description Aggregated number of minutes played
             * @example 604
             */
            minutesPlayed?: number;
            /**
             * Format: int32
             * @example 11
             */
            matchesPlayed?: number;
            /**
             * Format: int32
             * @description Number of matches played from the start to the end
             * @example 4
             */
            fullMatchesPlayed?: number;
            /**
             * Format: int32
             * @description Includes goals scored from penalties during the match
             * @example 20
             */
            goals?: number;
            /**
             * Format: int32
             * @example 1
             */
            assists?: number;
            /**
             * Format: int32
             * @example 5
             */
            penalties?: number;
            /**
             * Format: int32
             * @description Number of goals scored from penalty kicks during the match. Penalty shootout goals excluded
             * @example 2
             */
            ownGoals?: number;
            /**
             * Format: int32
             * @description Number of yellow cards received
             * @example 1
             */
            yellowCards?: number;
            /**
             * Format: int32
             * @description Number of red cards received
             * @example 0
             */
            redCards?: number;
            /**
             * Format: int32
             * @description Number of times the player was the captain of the team
             * @example 1
             */
            captain?: number;
            competition?: components["schemas"]["Competition"];
            /**
             * @description Defines if caller is allowed to call competition details endpoints
             * @example true
             */
            allowDetail?: boolean;
        };
        /** @description Contains basic information about Match Officials and/or Team officials. */
        MatchAndTeamOfficial: {
            /**
             * Format: int64
             * @example 204330
             */
            roleId?: number;
            /**
             * Format: int64
             * @example 3435
             */
            personId?: number;
            /** @example 13HI3Q1 */
            fifaId?: string;
            /** @example Igor TUDOR */
            name?: string;
            /** @example I.TUDOR */
            shortName?: string;
            /** @example Head Coach */
            role?: string;
            /** @example fe195b59-6d02-449c-9cad-0fc837c35bb6 */
            picture?: string;
            /** @example ae191b59-6d02-449c-9cad-0fc837c35bb6 */
            flag?: string;
            /**
             * Format: int32
             * @example 1
             */
            orderNumber?: number;
        };
        MatchEvent: {
            /**
             * Format: int64
             * @example 204441
             */
            eventId?: number;
            eventType?: components["schemas"]["MatchEventType"];
            matchPhase?: components["schemas"]["MatchPhase"];
            /**
             * Format: int32
             * @description minute of the eveant in the match phase
             * @example 45
             */
            minute?: number;
            /**
             * Format: int32
             * @description full minute of the event in the match
             * @example 90
             */
            minuteFull?: number;
            /**
             * Format: int32
             * @description stoppage time, if applicable, of the event
             * @example 3
             */
            stoppageTime?: number;
            /**
             * @description String representation of the minute, with stoppage time if applicable, and seconds if applicable
             * @example 90+3'
             */
            displayMinute?: string;
            player?: components["schemas"]["TeamPlayer"];
            player2?: components["schemas"]["TeamPlayer"];
            teamOfficial?: components["schemas"]["MatchAndTeamOfficial"];
            club?: components["schemas"]["Team"];
            /** @example true */
            homeTeam?: boolean;
            /**
             * Format: int32
             * @example 2
             */
            orderNumber?: number;
            commentary?: string;
            image?: string;
            link?: string;
        };
        MatchEventType: {
            /**
             * Format: int64
             * @example 1
             */
            eventTypeId?: number;
            /** @example Goal */
            name?: string;
            /** @example GOAL, OWN_GOAL, PENALTY, YELLOW, SECOND_YELLOW, RED, SUBSTITUTION, TIME_OUT, ACCUMULATED_FOUL, SIX_METERS, TEN_METERS, EXPULSION, PENALTY_FAILED, PENALTY_SAVED, PENALTY_GOAL */
            fcdName?: string;
        };
        TeamPlayer: {
            /**
             * Format: int64
             * @example 204308
             */
            roleId?: number;
            /**
             * Format: int64
             * @example 449122
             */
            personId?: number;
            /** @example 13HFQG7 */
            fifaId?: string;
            /** @example Dante STIPICA */
            name?: string;
            /** @example D.STIPICA */
            shortName?: string;
            /** @example D.STIPICA */
            formationShortName?: string;
            /**
             * Format: int32
             * @example 1
             */
            shirtNumber?: number;
            /** @example true */
            starting?: boolean;
            /** @example true */
            captain?: boolean;
            /**
             * @description in lineups it shows G for goalkeeper, and in player details it shows his position of play in domestic language.
             * @example G
             */
            position?: string;
            /**
             * Format: int64
             * @description Identifier of the formation position.
             * @example 1
             */
            formationPositionId?: number;
            /**
             * @description Display name of the formation position.
             * @example LB
             */
            formationPositionDisplayName?: string;
            /** @example fe195b59-6d02-449c-9cad-0fc837c35bb6 */
            picture?: string;
            /**
             * Format: int32
             * @example 1
             */
            orderNumber?: number;
            /** @example Croatia */
            countryOfBirth?: string;
            /** @example Croatia */
            nationality?: string;
            /** @example Male */
            gender?: string;
            /**
             * Format: int32
             * @description Age of the player on today's date
             * @example 27
             */
            age?: number;
            /** @example ae191b59-6d02-449c-9cad-0fc837c35bb6 */
            flag?: string;
            club?: components["schemas"]["Team"];
            events?: components["schemas"]["MatchEvent"][];
            /**
             * @description Indicates whether player profile should be hidden, based on player privacy setting in COMET
             * @example false
             */
            hideProfile?: boolean;
        };
        PaginatedResultsTeamPlayer: {
            /** @description List of objects */
            result?: components["schemas"]["TeamPlayer"][];
            /**
             * Format: int64
             * @description Number of objects in the list
             * @example 17
             */
            size?: number;
        };
        NewsItem: {
            guid?: string;
            title?: string;
            description?: string;
            pictureUrl?: string;
            link?: string;
            /** Format: date-time */
            pubDate?: string;
            /** Format: int64 */
            newsSourceId?: number;
        };
        PastMatch: {
            /**
             * Format: int64
             * @example 69335
             */
            matchId?: number;
            /** @example W */
            result?: string;
        };
        /** @description Competition standings of teams (list) */
        TeamRanking: {
            team?: components["schemas"]["Team"];
            /**
             * Format: int32
             * @example 4
             */
            played?: number;
            /**
             * Format: int32
             * @example 1
             */
            wins?: number;
            /**
             * Format: int32
             * @example 3
             */
            draws?: number;
            /**
             * Format: int32
             * @example 0
             */
            losses?: number;
            /**
             * Format: int32
             * @example 3
             */
            winsAET?: number;
            /**
             * Format: int32
             * @example 3
             */
            winsAP?: number;
            /**
             * Format: int32
             * @example 0
             */
            lossesAP?: number;
            /**
             * Format: int32
             * @example 3
             */
            goalsFor?: number;
            /**
             * Format: int32
             * @example 2
             */
            goalsAgainst?: number;
            /**
             * Format: int32
             * @example 6
             */
            points?: number;
            /**
             * Format: int32
             * @example 1
             */
            negativePoints?: number;
            /**
             * Format: int32
             * @example 7
             */
            position?: number;
            /**
             * @description If the team is playing live match, this is the sign if it's winning, loosing or draw
             * @example W
             * @enum {string}
             */
            liveResult?: "W" | "D" | "L";
            /**
             * @description If team should be highlighted. When showing table on match, teams that play are highlighted. This will be true only on Match standings for the teams playing the match.
             * @example true
             */
            highlight?: boolean;
            m1?: components["schemas"]["PastMatch"];
            m2?: components["schemas"]["PastMatch"];
            m3?: components["schemas"]["PastMatch"];
            m4?: components["schemas"]["PastMatch"];
            m5?: components["schemas"]["PastMatch"];
        };
        Lineups: {
            home?: components["schemas"]["TeamLineup"];
            away?: components["schemas"]["TeamLineup"];
        };
        TeamLineup: {
            /**
             * @description Team formation in format: D-M-F, where D is number of defenders, M is number of midfielders and F is number of forwards
             * @example 4-3-3
             */
            formation?: string;
            /**
             * @description Player shirt kit color
             * @example #FFFFFF
             */
            playerKitColor?: string;
            /**
             * @description Player shirt kit contrast color
             * @example #000000
             */
            playerKitContrastColor?: string;
            /**
             * @description Goal keeper shirt kit color
             * @example #FFFFFF
             */
            goalKeeperKitColor?: string;
            /**
             * @description Goal keeper shirt kit contrast color
             * @example #000000
             */
            goalKeeperKitContrastColor?: string;
            /** @description List of players in the team lineup */
            players?: components["schemas"]["TeamPlayer"][];
            /** @description List of team officials in the team lineup */
            officials?: components["schemas"]["MatchAndTeamOfficial"][];
        };
        /** @description Additional match info like team / match official kits and list of match officials */
        MatchInfo: {
            /** @example <svg style=\"width: 160px;height: 160px\" viewBox=\"0 0 41 66\" ><polygon points=\"1,16 10,1 17,1 20,4 21,4 24,1 31,1 40,16 33,22 31,19 31,32 10,32 10,19 8,22\" style=\"fill:#FFFFFF;stroke:gray;stroke-linejoin:bevel\" /><polygon points=\"10,32 31,32 35,53 22,53 21,44 20,44 19,53 6,53\" style=\"fill:#FFFFFF;stroke:gray;stroke-linejoin:bevel\" /><polygon points=\"9,53 16,53 16,65 10,65\" style=\"fill:#FFFFFF;stroke:gray;stroke-linejoin:bevel\" /><polygon points=\"25,53 32,53 31,65 25,65\" style=\"fill:#FFFFFF;stroke:gray;stroke-linejoin:bevel\" /></svg> */
            refereeKit?: string;
            /** @example kit-1187364-referee */
            refereeKitPng?: string;
            /** @example <svg style=\"width: 160px;height: 160px\" viewBox=\"0 0 41 66\" ><polygon points=\"1,16 10,1 17,1 20,4 21,4 24,1 31,1 40,16 33,22 31,19 31,32 10,32 10,19 8,22\" style=\"fill:#FFFFFF;stroke:gray;stroke-linejoin:bevel\" /><polygon points=\"10,32 31,32 35,53 22,53 21,44 20,44 19,53 6,53\" style=\"fill:#FFFFFF;stroke:gray;stroke-linejoin:bevel\" /><polygon points=\"9,53 16,53 16,65 10,65\" style=\"fill:#FFFFFF;stroke:gray;stroke-linejoin:bevel\" /><polygon points=\"25,53 32,53 31,65 25,65\" style=\"fill:#FFFFFF;stroke:gray;stroke-linejoin:bevel\" /></svg> */
            homeKit?: string;
            /** @example kit-1187364-home */
            homeKitPng?: string;
            /** @example <svg style=\"width: 160px;height: 160px\" viewBox=\"0 0 41 66\" ><polygon points=\"1,16 10,1 17,1 20,4 21,4 24,1 31,1 40,16 33,22 31,19 31,32 10,32 10,19 8,22\" style=\"fill:#FFFFFF;stroke:gray;stroke-linejoin:bevel\" /><polygon points=\"10,32 31,32 35,53 22,53 21,44 20,44 19,53 6,53\" style=\"fill:#FFFFFF;stroke:gray;stroke-linejoin:bevel\" /><polygon points=\"9,53 16,53 16,65 10,65\" style=\"fill:#FFFFFF;stroke:gray;stroke-linejoin:bevel\" /><polygon points=\"25,53 32,53 31,65 25,65\" style=\"fill:#FFFFFF;stroke:gray;stroke-linejoin:bevel\" /></svg> */
            homeGKKit?: string;
            /** @example kit-1187364-homeGK */
            homeGKKitPng?: string;
            /** @example <svg style=\"width: 160px;height: 160px\" viewBox=\"0 0 41 66\" ><polygon points=\"1,16 10,1 17,1 20,4 21,4 24,1 31,1 40,16 33,22 31,19 31,32 10,32 10,19 8,22\" style=\"fill:#FFFFFF;stroke:gray;stroke-linejoin:bevel\" /><polygon points=\"10,32 31,32 35,53 22,53 21,44 20,44 19,53 6,53\" style=\"fill:#FFFFFF;stroke:gray;stroke-linejoin:bevel\" /><polygon points=\"9,53 16,53 16,65 10,65\" style=\"fill:#FFFFFF;stroke:gray;stroke-linejoin:bevel\" /><polygon points=\"25,53 32,53 31,65 25,65\" style=\"fill:#FFFFFF;stroke:gray;stroke-linejoin:bevel\" /></svg> */
            homeSubstituteBib?: string;
            /** @example kit-1187364-homeSubstituteBib */
            homeSubstituteBibPng?: string;
            /** @example <svg style=\"width: 160px;height: 160px\" viewBox=\"0 0 41 66\" ><polygon points=\"1,16 10,1 17,1 20,4 21,4 24,1 31,1 40,16 33,22 31,19 31,32 10,32 10,19 8,22\" style=\"fill:#FFFFFF;stroke:gray;stroke-linejoin:bevel\" /><polygon points=\"10,32 31,32 35,53 22,53 21,44 20,44 19,53 6,53\" style=\"fill:#FFFFFF;stroke:gray;stroke-linejoin:bevel\" /><polygon points=\"9,53 16,53 16,65 10,65\" style=\"fill:#FFFFFF;stroke:gray;stroke-linejoin:bevel\" /><polygon points=\"25,53 32,53 31,65 25,65\" style=\"fill:#FFFFFF;stroke:gray;stroke-linejoin:bevel\" /></svg> */
            awayKit?: string;
            /** @example kit-1187364-away */
            awayKitPng?: string;
            /** @example <svg style=\"width: 160px;height: 160px\" viewBox=\"0 0 41 66\" ><polygon points=\"1,16 10,1 17,1 20,4 21,4 24,1 31,1 40,16 33,22 31,19 31,32 10,32 10,19 8,22\" style=\"fill:#FFFFFF;stroke:gray;stroke-linejoin:bevel\" /><polygon points=\"10,32 31,32 35,53 22,53 21,44 20,44 19,53 6,53\" style=\"fill:#FFFFFF;stroke:gray;stroke-linejoin:bevel\" /><polygon points=\"9,53 16,53 16,65 10,65\" style=\"fill:#FFFFFF;stroke:gray;stroke-linejoin:bevel\" /><polygon points=\"25,53 32,53 31,65 25,65\" style=\"fill:#FFFFFF;stroke:gray;stroke-linejoin:bevel\" /></svg> */
            awayGKKit?: string;
            /** @example kit-1187364-awayGK */
            awayGKKitPng?: string;
            /** @example <svg style=\"width: 160px;height: 160px\" viewBox=\"0 0 41 66\" ><polygon points=\"1,16 10,1 17,1 20,4 21,4 24,1 31,1 40,16 33,22 31,19 31,32 10,32 10,19 8,22\" style=\"fill:#FFFFFF;stroke:gray;stroke-linejoin:bevel\" /><polygon points=\"10,32 31,32 35,53 22,53 21,44 20,44 19,53 6,53\" style=\"fill:#FFFFFF;stroke:gray;stroke-linejoin:bevel\" /><polygon points=\"9,53 16,53 16,65 10,65\" style=\"fill:#FFFFFF;stroke:gray;stroke-linejoin:bevel\" /><polygon points=\"25,53 32,53 31,65 25,65\" style=\"fill:#FFFFFF;stroke:gray;stroke-linejoin:bevel\" /></svg> */
            awaySubstituteBib?: string;
            /** @example kit-1187364-awaySubstituteBib */
            awaySubstituteBibPng?: string;
            /**
             * @example [
             *       {
             *         "id": 176094,
             *         "personId": 517,
             *         "fifaId": "13HJC79",
             *         "name": "TUDOR Igor",
             *         "shortName": "TUDOR I.",
             *         "internationalName": "TUDOR Igor",
             *         "internationalShortName": "TUDOR I.",
             *         "role": "Sudac",
             *         "internationalRole": "Referee",
             *         "picture": "83c38cb2-aa14-463d-9fed-24450a362e04",
             *         "orderNumber": 1
             *       }
             *     ]
             */
            matchOfficials?: components["schemas"]["MatchAndTeamOfficial"][];
        };
        Picture: {
            /** @example image/jpeg */
            contentType?: string;
            /** @example /Person/1789311_1362020456723 */
            pictureLink?: string;
            /** @example /9j/4AAQSkZJRgABAgAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5... */
            value?: string;
        };
        /** @description Model for view of a formation position. */
        ApiFormationPositionViewModel: {
            /**
             * Format: int64
             * @description Identifier of the formation position.
             * @example 1
             */
            id?: number;
            /**
             * @description Label of the formation position.
             * @example RCM
             */
            displayName?: string;
            /**
             * @description Long label of the formation position.
             * @example Right Center Midfielder
             */
            displayNameLong?: string;
        };
        /** @description Model for view of a formation. */
        ApiFormationViewModel: {
            /**
             * Format: int64
             * @description Order of the formation in frontend selector.
             * @example 1
             */
            order?: number;
            /**
             * Format: int64
             * @description Number of players in the discipline.
             * @example 11
             */
            numberOfPlayers?: number;
            /**
             * @description Formation tactical code.
             * @example 4-1-2-1-2
             */
            code?: string;
            /**
             * @description Label of the formation.
             * @example 4-4-2 Diamond
             */
            displayName?: string;
            /** @description List of view models for formation positions. */
            formationPositions?: components["schemas"]["ApiFormationPositionViewModel"][];
        };
        CompetitionTable: {
            /** @example false */
            showDraws?: boolean;
            /** @example false */
            showWinsAET?: boolean;
            /** @example false */
            showWinsAP?: boolean;
            /** @example false */
            showLossesAP?: boolean;
            /** @example Team awarded 3 points... */
            tableNotes?: string;
            /** @description Competition standings of teams (list) */
            standings?: components["schemas"]["TeamRanking"][];
        };
        PlayerStats: {
            player?: components["schemas"]["TeamPlayer"];
            /**
             * Format: int32
             * @example 10
             */
            value?: number;
            team?: components["schemas"]["Team"];
        };
        PaginatedResultsCompetition: {
            /** @description List of objects */
            result?: components["schemas"]["Competition"][];
            /**
             * Format: int64
             * @description Number of objects in the list
             * @example 17
             */
            size?: number;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type ErrorMessage = components['schemas']['ErrorMessage'];
export type ExceptionViewModel = components['schemas']['ExceptionViewModel'];
export type Facility = components['schemas']['Facility'];
export type FacilityField = components['schemas']['FacilityField'];
export type Team = components['schemas']['Team'];
export type Competition = components['schemas']['Competition'];
export type Match = components['schemas']['Match'];
export type MatchPhase = components['schemas']['MatchPhase'];
export type PaginatedResults = components['schemas']['PaginatedResults'];
export type PlayerMatchStats = components['schemas']['PlayerMatchStats'];
export type Result = components['schemas']['Result'];
export type PaginatedResultsMatch = components['schemas']['PaginatedResultsMatch'];
export type PaginatedResultsTeam = components['schemas']['PaginatedResultsTeam'];
export type PlayerCompetitionStats = components['schemas']['PlayerCompetitionStats'];
export type MatchAndTeamOfficial = components['schemas']['MatchAndTeamOfficial'];
export type MatchEvent = components['schemas']['MatchEvent'];
export type MatchEventType = components['schemas']['MatchEventType'];
export type TeamPlayer = components['schemas']['TeamPlayer'];
export type PaginatedResultsTeamPlayer = components['schemas']['PaginatedResultsTeamPlayer'];
export type NewsItem = components['schemas']['NewsItem'];
export type PastMatch = components['schemas']['PastMatch'];
export type TeamRanking = components['schemas']['TeamRanking'];
export type Lineups = components['schemas']['Lineups'];
export type TeamLineup = components['schemas']['TeamLineup'];
export type MatchInfo = components['schemas']['MatchInfo'];
export type Picture = components['schemas']['Picture'];
export type ApiFormationPositionViewModel = components['schemas']['ApiFormationPositionViewModel'];
export type ApiFormationViewModel = components['schemas']['ApiFormationViewModel'];
export type CompetitionTable = components['schemas']['CompetitionTable'];
export type PlayerStats = components['schemas']['PlayerStats'];
export type PaginatedResultsCompetition = components['schemas']['PaginatedResultsCompetition'];
export type $defs = Record<string, never>;
export interface operations {
    getClubTeams: {
        parameters: {
            query?: {
                /** @description Organization ID for filtering data. It is required if API_KEY is restricted by organization ID. It returns the data if the team belongs to organization's hierarchy or it participates in the competition organized by the organization. */
                organizationIdFilter?: number;
                /** @description Team ID for filtering data. It is required if API_KEY is restricted by team ID. It returns the data if the team belongs to the team's hierarchy. */
                teamIdFilter?: number;
            };
            header: {
                /** @description Authorization access token */
                API_KEY: string;
                /** @description Language of the response used for translation of dynamic data like registration types, match phases etc.  <br /><br />Use the header on /api/live/{tenant}/preferences to check if the language is supported. It will return it in the response if it's supported otherwise the fallback language is returned in the response. <br />If the header is left blank (not included in the request) then the default language will be used. */
                "Accept-Language"?: string;
            };
            path: {
                /** @description COMET ID of the club/team, e.g. 823567 */
                teamId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Team"][];
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["Team"][];
                };
            };
            /** @description Item not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Server error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["Team"][];
                };
            };
            /** @description Bad Gateway */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
        };
    };
    getPastTeamMatches: {
        parameters: {
            query: {
                /** @description page to retrieve (starts from 1) */
                page: number;
                /** @description size of the page */
                pageSize: number;
                /** @description Organization ID for filtering data. It is required if API_KEY is restricted by organization ID. It will return the data only if the team belongs to organization's hierarchy or it participates in the competition organized by the organization. */
                organizationIdFilter?: number;
                /** @description Team ID for filtering data. It is required if API_KEY is restricted by team ID. It will return the data only if the team belongs to the team's hierarchy. */
                teamIdFilter?: number;
            };
            header: {
                /** @description Authorization access token */
                API_KEY: string;
                /** @description Language of the response used for translation of dynamic data like registration types, match phases etc.  <br /><br />Use the header on /api/live/{tenant}/preferences to check if the language is supported. It will return it in the response if it's supported otherwise the fallback language is returned in the response. <br />If the header is left blank (not included in the request) then the default language will be used. */
                "Accept-Language"?: string;
            };
            path: {
                /** @description COMET ID of the club/team, e.g. 823567 */
                teamId: number;
                /** @description Offset from UTC in hours e.g. 2 or -7 */
                utcOffset: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaginatedResults"];
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["PaginatedResultsMatch"];
                };
            };
            /** @description Item not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Server error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["PaginatedResultsMatch"];
                };
            };
            /** @description Bad Gateway */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
        };
    };
    getNextTeamMatches: {
        parameters: {
            query: {
                /** @description page to retrieve (starts from 1) */
                page: number;
                /** @description size of the page */
                pageSize: number;
                /** @description Organization ID for filtering data. It is required if API_KEY is restricted by organization ID. It will return the data only if the team belongs to organization's hierarchy or it participates in the competition organized by the organization. */
                organizationIdFilter?: number;
                /** @description Team ID for filtering data. It is required if API_KEY is restricted by team ID. It will return the data only if the team belongs to the team's hierarchy. */
                teamIdFilter?: number;
            };
            header: {
                /** @description Authorization access token */
                API_KEY: string;
                /** @description Language of the response used for translation of dynamic data like registration types, match phases etc.  <br /><br />Use the header on /api/live/{tenant}/preferences to check if the language is supported. It will return it in the response if it's supported otherwise the fallback language is returned in the response. <br />If the header is left blank (not included in the request) then the default language will be used. */
                "Accept-Language"?: string;
            };
            path: {
                /** @description COMET ID of the club/team, e.g. 823567 */
                teamId: number;
                /** @description Offset from UTC in hours e.g. 2 or -7 */
                utcOffset: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaginatedResults"];
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["PaginatedResultsMatch"];
                };
            };
            /** @description Item not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Server error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["PaginatedResultsMatch"];
                };
            };
            /** @description Bad Gateway */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
        };
    };
    getTeamDetails: {
        parameters: {
            query?: {
                /** @description Organization ID for filtering data. It is required if API_KEY is restricted by organization ID. It returns the data if the team belongs to organization's hierarchy or it participates in the competition organized by the organization. */
                organizationIdFilter?: number;
                /** @description Team ID for filtering data. It is required if API_KEY is restricted by team ID. It returns the data if the team belongs to the team's hierarchy. */
                teamIdFilter?: number;
            };
            header: {
                /** @description Authorization access token */
                API_KEY: string;
                /** @description Language of the response used for translation of dynamic data like registration types, match phases etc.  <br /><br />Use the header on /api/live/{tenant}/preferences to check if the language is supported. It will return it in the response if it's supported otherwise the fallback language is returned in the response. <br />If the header is left blank (not included in the request) then the default language will be used. */
                "Accept-Language"?: string;
            };
            path: {
                /** @description COMET ID of the club/team, e.g. 823567 */
                teamId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Team"];
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["Team"];
                };
            };
            /** @description Item not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Server error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["Team"];
                };
            };
            /** @description Bad Gateway */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
        };
    };
    searchTeams: {
        parameters: {
            query: {
                /** @description search string */
                keyword: string;
                /** @description page to retrieve */
                page: number;
                /** @description size of the page */
                pageSize: number;
                /** @description Organization for filtering data. It is required if API_KEY is restricted by organization. It will filter only teams that belong to the organization or participate in their competitions. */
                organizationIdFilter?: number;
                /** @description Team ID for filtering data. It is required if API_KEY is restricted by team ID. */
                teamIdFilter?: number;
            };
            header: {
                /** @description Authorization access token */
                API_KEY: string;
                /** @description Language of the response used for translation of dynamic data like registration types, match phases etc.  <br /><br />Use the header on /api/live/{tenant}/preferences to check if the language is supported. It will return it in the response if it's supported otherwise the fallback language is returned in the response. <br />If the header is left blank (not included in the request) then the default language will be used. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *         "result": [
                     *             {
                     *                 "id": 41001,
                     *                 "fifaId": "105KJ8A",
                     *                 "name": "OMONOIA FC",
                     *                 "picture": "f4998a88-dc14-4914-b756-68c687a28518",
                     *                 "country": "Cyprus",
                     *                 "place": "LEFKOSIA",
                     *                 "address": "Leoforos Lemesou 241
                     *     Nisou, 2571 LEFKOSIA",
                     *                 "latitude": 35.1855659,
                     *                 "longitude": 33.38227639999999,
                     *                 "hasTeams": true
                     *             },
                     *             {
                     *                 "id": 41138,
                     *                 "fifaId": "105KGFC",
                     *                 "name": "OMONOIA ARADIPPOU",
                     *                 "picture": "51ae8878-85e1-47b6-b497-e0c85db73405",
                     *                 "country": "Cyprus",
                     *                 "place": "LARNAKA",
                     *                 "address": "ARADIPPOU\LARNAKA,  LARNAKA",
                     *                 "latitude": 34.9663094,
                     *                 "longitude": 33.5839983,
                     *                 "hasTeams": false
                     *             }
                     *         ],
                     *         "size": 21
                     *     }
                     */
                    "application/json": components["schemas"]["PaginatedResults"];
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["PaginatedResultsTeam"];
                };
            };
            /** @description Item not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Server error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["PaginatedResultsTeam"];
                };
            };
            /** @description Bad Gateway */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
        };
    };
    getTeamDetailsByFIFAId: {
        parameters: {
            query?: {
                /** @description Organization ID for filtering data. It is required if API_KEY is restricted by organization ID. It returns the data if the team belongs to organization's hierarchy or it participates in the competition organized by the organization. */
                organizationIdFilter?: number;
                /** @description Team ID for filtering data. It is required if API_KEY is restricted by team ID. It returns the data if the team belongs to the team's hierarchy. */
                teamIdFilter?: number;
            };
            header: {
                /** @description Authorization access token */
                API_KEY: string;
                /** @description Language of the response used for translation of dynamic data like registration types, match phases etc.  <br /><br />Use the header on /api/live/{tenant}/preferences to check if the language is supported. It will return it in the response if it's supported otherwise the fallback language is returned in the response. <br />If the header is left blank (not included in the request) then the default language will be used. */
                "Accept-Language"?: string;
            };
            path: {
                /** @description FIFA ID of the club/team, e.g. 8A4XYE7 */
                fifaId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Team"];
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["Team"];
                };
            };
            /** @description Item not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Server error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["Team"];
                };
            };
            /** @description Bad Gateway */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
        };
    };
    getPlayerStatistics: {
        parameters: {
            query?: {
                /** @description Organization ID for filtering data. It is required if API_KEY is restricted by organization ID */
                organizationIdFilter?: number;
                /** @description Team ID for filtering data. It is required if API_KEY is restricted by team ID */
                teamIdFilter?: number;
            };
            header: {
                /** @description Authorization access token */
                API_KEY: string;
                /** @description Language of the response used for translation of dynamic data like registration types, match phases etc.  <br /><br />Use the header on /api/live/{tenant}/preferences to check if the language is supported. It will return it in the response if it's supported otherwise the fallback language is returned in the response. <br />If the header is left blank (not included in the request) then the default language will be used. */
                "Accept-Language"?: string;
            };
            path: {
                /** @description COMET ID of the player, e.g. 443275 */
                personId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PlayerCompetitionStats"][];
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["PlayerCompetitionStats"][];
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Item not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Server error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["PlayerCompetitionStats"][];
                };
            };
            /** @description Bad Gateway */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
        };
    };
    getPlayerStatistics_2: {
        parameters: {
            query?: {
                /** @description Organization ID for filtering data. It is required if API_KEY is restricted by organization ID */
                organizationIdFilter?: number;
                /** @description Team ID for filtering data. It is required if API_KEY is restricted by team ID */
                teamIdFilter?: number;
            };
            header: {
                /** @description Authorization access token */
                API_KEY: string;
                /** @description Language of the response used for translation of dynamic data like registration types, match phases etc.  <br /><br />Use the header on /api/live/{tenant}/preferences to check if the language is supported. It will return it in the response if it's supported otherwise the fallback language is returned in the response. <br />If the header is left blank (not included in the request) then the default language will be used. */
                "Accept-Language"?: string;
            };
            path: {
                /** @description COMET ID of the player, e.g. 443275 */
                personId: number;
                /** @description COMET ID of the club/team to filter matches for stats, e.g. 823567 */
                teamId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PlayerCompetitionStats"][];
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["PlayerCompetitionStats"][];
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Item not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Server error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["PlayerCompetitionStats"][];
                };
            };
            /** @description Bad Gateway */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
        };
    };
    getPlayerMatches: {
        parameters: {
            query: {
                /** @description page to retrieve (starts from 1) */
                page: number;
                /** @description size of the page */
                pageSize: number;
                /** @description Organization ID for filtering data. It is required if API_KEY is restricted by organization ID */
                organizationIdFilter?: number;
                /** @description Team ID for filtering data. It is required if API_KEY is restricted by team ID. It filters matches and shows only the ones where the player played for the team. */
                teamIdFilter?: number;
            };
            header: {
                /** @description Authorization access token */
                API_KEY: string;
                /** @description Language of the response used for translation of dynamic data like registration types, match phases etc.  <br /><br />Use the header on /api/live/{tenant}/preferences to check if the language is supported. It will return it in the response if it's supported otherwise the fallback language is returned in the response. <br />If the header is left blank (not included in the request) then the default language will be used. */
                "Accept-Language"?: string;
            };
            path: {
                /** @description COMET ID of the player, e.g. 443275 */
                personId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaginatedResults"];
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["PaginatedResultsMatch"];
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Item not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Server error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["PaginatedResultsMatch"];
                };
            };
            /** @description Bad Gateway */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
        };
    };
    getPlayerMatches_2: {
        parameters: {
            query: {
                /** @description page to retrieve (starts from 1) */
                page: number;
                /** @description size of the page */
                pageSize: number;
                /** @description Organization ID for filtering data. It is required if API_KEY is restricted by organization ID */
                organizationIdFilter?: number;
                /** @description Team ID for filtering data. It is required if API_KEY is restricted by team ID. It filters matches and shows only the ones where the player played for the team. */
                teamIdFilter?: number;
            };
            header: {
                /** @description Authorization access token */
                API_KEY: string;
                /** @description Language of the response used for translation of dynamic data like registration types, match phases etc.  <br /><br />Use the header on /api/live/{tenant}/preferences to check if the language is supported. It will return it in the response if it's supported otherwise the fallback language is returned in the response. <br />If the header is left blank (not included in the request) then the default language will be used. */
                "Accept-Language"?: string;
            };
            path: {
                /** @description COMET ID of the player, e.g. 443275 */
                personId: number;
                /** @description COMET ID of the team to filter the matches, e.g. 112233 */
                teamId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaginatedResults"];
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["PaginatedResultsMatch"];
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Item not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Server error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["PaginatedResultsMatch"];
                };
            };
            /** @description Bad Gateway */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
        };
    };
    getPlayerDetails: {
        parameters: {
            query?: {
                /** @description Organization ID for filtering data. It is required if API_KEY is restricted by organization ID. It will return the data if the player has any (active or inactive) registration to a team of the organization or has any appearance on the competition organized by organization. */
                organizationIdFilter?: number;
                /** @description Team ID for filtering data. It is required if API_KEY is restricted by team ID. It will return the data only if the player has a registration for the team (active or inactive) */
                teamIdFilter?: number;
            };
            header: {
                /** @description Authorization access token */
                API_KEY: string;
                /** @description Language of the response used for translation of dynamic data like registration types, match phases etc.  <br /><br />Use the header on /api/live/{tenant}/preferences to check if the language is supported. It will return it in the response if it's supported otherwise the fallback language is returned in the response. <br />If the header is left blank (not included in the request) then the default language will be used. */
                "Accept-Language"?: string;
            };
            path: {
                /** @description COMET ID of the player, e.g. 443275 */
                personId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TeamPlayer"];
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["TeamPlayer"];
                };
            };
            /** @description Item not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Server error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["TeamPlayer"];
                };
            };
            /** @description Bad Gateway */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
        };
    };
    searchPlayers: {
        parameters: {
            query: {
                /** @description search string */
                keyword: string;
                /** @description page to retrieve */
                page: number;
                /** @description size of the page */
                pageSize: number;
                /** @description Organization for filtering data. It is required if API_KEY is restricted by organization. It will filter players that had any registration for a club below the organization or he participated in at least one match organized by the organization. */
                organizationIdFilter?: number;
                /** @description Team ID for filtering data. It is required if API_KEY is restricted by team ID. It will filter players that had any registration for a club at any point in his career. */
                teamIdFilter?: number;
            };
            header: {
                /** @description Authorization access token */
                API_KEY: string;
                /** @description Language of the response used for translation of dynamic data like registration types, match phases etc.  <br /><br />Use the header on /api/live/{tenant}/preferences to check if the language is supported. It will return it in the response if it's supported otherwise the fallback language is returned in the response. <br />If the header is left blank (not included in the request) then the default language will be used. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "result": [
                     *         {
                     *           "personId": 11111,
                     *           "name": "JOHN Fred John",
                     *           "shortName": "JOHN F.",
                     *           "countryOfBirth": "Wales",
                     *           "nationality": "Wales",
                     *           "gender": "Male",
                     *           "age": 22,
                     *           "flag": "065f8e8d-3cfc-9f3f-b4cb-3e0b19dfb385",
                     *           "hideProfile": false
                     *         },
                     *         {
                     *           "personId": 22222,
                     *           "name": "JOHN William John",
                     *           "shortName": "JOHN W.",
                     *           "countryOfBirth": "Wales",
                     *           "nationality": "Wales",
                     *           "gender": "Male",
                     *           "age": 30,
                     *           "flag": "065f8e8d-3cfc-1f3f-b4cb-3e0b19dfb385",
                     *           "hideProfile": false
                     *         }
                     *       ],
                     *       "size": 35177
                     *     }
                     */
                    "application/json": components["schemas"]["PaginatedResults"];
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["PaginatedResultsTeamPlayer"];
                };
            };
            /** @description Item not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Server error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["PaginatedResultsTeamPlayer"];
                };
            };
            /** @description Bad Gateway */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
        };
    };
    getPlayerDetailsByFIFAID: {
        parameters: {
            query?: {
                /** @description Organization ID for filtering data. It is required if API_KEY is restricted by organization ID. It will return the data if the player has any (active or inactive) registration to a team of the organization or has any appearance on the competition organized by organization. */
                organizationIdFilter?: number;
                /** @description Team ID for filtering data. It is required if API_KEY is restricted by team ID. It will return the data only if the player has a registration for the team (active or inactive) */
                teamIdFilter?: number;
            };
            header: {
                /** @description Authorization access token */
                API_KEY: string;
                /** @description Language of the response used for translation of dynamic data like registration types, match phases etc.  <br /><br />Use the header on /api/live/{tenant}/preferences to check if the language is supported. It will return it in the response if it's supported otherwise the fallback language is returned in the response. <br />If the header is left blank (not included in the request) then the default language will be used. */
                "Accept-Language"?: string;
            };
            path: {
                /** @description FIFA ID of the player, e.g. 12HENE7 */
                fifaId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TeamPlayer"];
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["TeamPlayer"];
                };
            };
            /** @description Item not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Server error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["TeamPlayer"];
                };
            };
            /** @description Bad Gateway */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
        };
    };
    readNewsSource: {
        parameters: {
            query?: never;
            header: {
                /** @description Authorization access token */
                API_KEY: string;
                /** @description Language of the response used for translation of dynamic data like registration types, match phases etc.  <br /><br />Use the header on /api/live/{tenant}/preferences to check if the language is supported. It will return it in the response if it's supported otherwise the fallback language is returned in the response. <br />If the header is left blank (not included in the request) then the default language will be used. */
                "Accept-Language"?: string;
            };
            path: {
                /** @description ID of the news source. This is the ID of the news source found in endpoint /device/{deviceId}/newsSources */
                newsSourceId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NewsItem"];
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json;charset=UTF-8": string;
                };
            };
            /** @description Item not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Server error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json;charset=UTF-8": string;
                };
            };
            /** @description Bad Gateway */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
        };
    };
    getMatchListLite: {
        parameters: {
            query?: {
                /** @description Organization for filtering data. It is required if API_KEY is restricted by organization. It will filter matches from the competitions that are organized by given organization or organizations below. */
                organizationIdFilter?: number;
                /** @description Team ID for filtering data. It is required if API_KEY is restricted by team ID. It will filter matches of the given team/club or teams below. */
                teamIdFilter?: number;
            };
            header: {
                /** @description Authorization access token */
                API_KEY: string;
                /** @description Language of the response used for translation of dynamic data like registration types, match phases etc.  <br /><br />Use the header on /api/live/{tenant}/preferences to check if the language is supported. It will return it in the response if it's supported otherwise the fallback language is returned in the response. <br />If the header is left blank (not included in the request) then the default language will be used. */
                "Accept-Language"?: string;
            };
            path: {
                /** @description Start date of the match in yyyyMMdd format, e.g. 20210712 */
                date: string;
                /** @description Offset from UTC in hours e.g. 2 or -7 */
                utcOffset: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Match"][];
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json;charset=UTF-8": string;
                };
            };
            /** @description Item not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Server error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json;charset=UTF-8": string;
                };
            };
            /** @description Bad Gateway */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
        };
    };
    getMatchListLite_2: {
        parameters: {
            query?: {
                /** @description Organization ID for filtering data. It is required if API_KEY is restricted by organization ID. It will filter matches from the competitions that are organized by given organization or organizations below. */
                organizationIdFilter?: number;
                /** @description Team ID for filtering data. It is required if API_KEY is restricted by team ID. It will filter matches of the given team/club or teams below. */
                teamIdFilter?: number;
            };
            header: {
                /** @description Authorization access token */
                API_KEY: string;
                /** @description Language of the response used for translation of dynamic data like registration types, match phases etc.  <br /><br />Use the header on /api/live/{tenant}/preferences to check if the language is supported. It will return it in the response if it's supported otherwise the fallback language is returned in the response. <br />If the header is left blank (not included in the request) then the default language will be used. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Match"][];
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json;charset=UTF-8": string;
                };
            };
            /** @description Item not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Server error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json;charset=UTF-8": string;
                };
            };
            /** @description Bad Gateway */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
        };
    };
    getMatchList4Map: {
        parameters: {
            query?: {
                /** @description Organization ID for filtering data. It is required if API_KEY is restricted by organization ID. It will filter matches from the competitions that are organized by given organization or organizations below. */
                organizationIdFilter?: number;
                /** @description Team ID for filtering data. It is required if API_KEY is restricted by team ID It will filter matches of the given team/club or teams below. */
                teamIdFilter?: number;
            };
            header: {
                /** @description Authorization access token */
                API_KEY: string;
                /** @description Language of the response used for translation of dynamic data like registration types, match phases etc.  <br /><br />Use the header on /api/live/{tenant}/preferences to check if the language is supported. It will return it in the response if it's supported otherwise the fallback language is returned in the response. <br />If the header is left blank (not included in the request) then the default language will be used. */
                "Accept-Language"?: string;
            };
            path: {
                /** @description Start date of the match in yyyyMMdd format, e.g. 20210712 */
                date: string;
                /** @description Offset from UTC in hours e.g. 2 or -7 */
                utcOffset: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Match"][];
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json;charset=UTF-8": string;
                };
            };
            /** @description Item not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Server error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json;charset=UTF-8": string;
                };
            };
            /** @description Bad Gateway */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
        };
    };
    getMatchList: {
        parameters: {
            query?: {
                /** @description Organization for filtering data. It is required if API_KEY is restricted by organization. It will filter matches from the competitions that are organized by given organization or organizations below. */
                organizationIdFilter?: number;
                /** @description Team ID for filtering data. It is required if API_KEY is restricted by team ID. It will filter matches of the given team/club or teams below. */
                teamIdFilter?: number;
            };
            header: {
                /** @description Authorization access token */
                API_KEY: string;
                /** @description Language of the response used for translation of dynamic data like registration types, match phases etc.  <br /><br />Use the header on /api/live/{tenant}/preferences to check if the language is supported. It will return it in the response if it's supported otherwise the fallback language is returned in the response. <br />If the header is left blank (not included in the request) then the default language will be used. */
                "Accept-Language"?: string;
            };
            path: {
                /** @description Start date of the match in yyyyMMdd format, e.g. 20210712 */
                date: string;
                /** @description Offset from UTC in hours e.g. 2 or -7 */
                utcOffset: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Match"][];
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json;charset=UTF-8": string;
                };
            };
            /** @description Item not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Server error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json;charset=UTF-8": string;
                };
            };
            /** @description Bad Gateway */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
        };
    };
    getMatchListLive: {
        parameters: {
            query?: {
                /** @description Organization ID for filtering data. It is required if API_KEY is restricted by organization ID. It will filter matches from the competitions that are organized by given organization or organizations below. */
                organizationIdFilter?: number;
                /** @description Team ID for filtering data. It is required if API_KEY is restricted by team ID. It will filter matches of the given team/club or teams below. */
                teamIdFilter?: number;
            };
            header: {
                /** @description Authorization access token */
                API_KEY: string;
                /** @description Language of the response used for translation of dynamic data like registration types, match phases etc.  <br /><br />Use the header on /api/live/{tenant}/preferences to check if the language is supported. It will return it in the response if it's supported otherwise the fallback language is returned in the response. <br />If the header is left blank (not included in the request) then the default language will be used. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Match"][];
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json;charset=UTF-8": string;
                };
            };
            /** @description Item not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Server error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json;charset=UTF-8": string;
                };
            };
            /** @description Bad Gateway */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
        };
    };
    getMatchStandings: {
        parameters: {
            query?: {
                /** @description Organization ID for filtering data. It is required if API_KEY is restricted by organization ID. It will return the data only if the competition is organized by the given organization or organizations below. */
                organizationIdFilter?: number;
                /** @description Team ID for filtering data. It is required if API_KEY is restricted by team ID. It will return the data only if the team is participating in the match. */
                teamIdFilter?: number;
            };
            header: {
                /** @description Authorization access token */
                API_KEY: string;
                /** @description Language of the response used for translation of dynamic data like registration types, match phases etc.  <br /><br />Use the header on /api/live/{tenant}/preferences to check if the language is supported. It will return it in the response if it's supported otherwise the fallback language is returned in the response. <br />If the header is left blank (not included in the request) then the default language will be used. */
                "Accept-Language"?: string;
            };
            path: {
                /** @description COMET ID of the match, e.g. 443251 */
                matchId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TeamRanking"][];
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["TeamRanking"][];
                };
            };
            /** @description Item not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Server error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["TeamRanking"][];
                };
            };
            /** @description Bad Gateway */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
        };
    };
    getLineups: {
        parameters: {
            query?: {
                /** @description Organization ID for filtering data. It is required if API_KEY is restricted by organization ID. It will return the data only if the competition is organized by the given organization or organizations below. */
                organizationIdFilter?: number;
                /** @description Team ID for filtering data. It is required if API_KEY is restricted by team ID. It will return the data only if the team is participating in the match. */
                teamIdFilter?: number;
                showSubstitutionsOutAsEvent?: boolean;
            };
            header: {
                /** @description Authorization access token */
                API_KEY: string;
                /** @description Language of the response used for translation of dynamic data like registration types, match phases etc.  <br /><br />Use the header on /api/live/{tenant}/preferences to check if the language is supported. It will return it in the response if it's supported otherwise the fallback language is returned in the response. <br />If the header is left blank (not included in the request) then the default language will be used. */
                "Accept-Language"?: string;
            };
            path: {
                /** @description COMET ID of the match, e.g. 443251 */
                matchId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Lineups"];
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["Lineups"];
                };
            };
            /** @description Item not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Server error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["Lineups"];
                };
            };
            /** @description Bad Gateway */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
        };
    };
    getMatchInfo: {
        parameters: {
            query?: {
                /** @description Organization ID for filtering data. It is required if API_KEY is restricted by organization ID. It will return the data only if the competition is organized by the given organization or organizations below. */
                organizationIdFilter?: number;
                /** @description Team ID for filtering data. It is required if API_KEY is restricted by team ID. It will return the data only if the team is participating in the match. */
                teamIdFilter?: number;
            };
            header: {
                /** @description Authorization access token */
                API_KEY: string;
                /** @description Language of the response used for translation of dynamic data like registration types, match phases etc.  <br /><br />Use the header on /api/live/{tenant}/preferences to check if the language is supported. It will return it in the response if it's supported otherwise the fallback language is returned in the response. <br />If the header is left blank (not included in the request) then the default language will be used. */
                "Accept-Language"?: string;
            };
            path: {
                /** @description COMET ID of the match, e.g. 443251 */
                matchId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MatchInfo"];
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["MatchInfo"];
                };
            };
            /** @description Item not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Server error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["MatchInfo"];
                };
            };
            /** @description Bad Gateway */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
        };
    };
    getHead2Head: {
        parameters: {
            query: {
                /** @description page to retrieve (starts from 1) */
                page: number;
                /** @description size of the page */
                pageSize: number;
                /** @description Organization ID for filtering data. It is required if API_KEY is restricted by organization ID. It will return the data only if the competition is organized by the given organization or organizations below. */
                organizationIdFilter?: number;
                /** @description Team ID for filtering data. It is required if API_KEY is restricted by team ID. It will return the data only if the team is participating in the match. */
                teamIdFilter?: number;
            };
            header: {
                /** @description Authorization access token */
                API_KEY: string;
                /** @description Language of the response used for translation of dynamic data like registration types, match phases etc.  <br /><br />Use the header on /api/live/{tenant}/preferences to check if the language is supported. It will return it in the response if it's supported otherwise the fallback language is returned in the response. <br />If the header is left blank (not included in the request) then the default language will be used. */
                "Accept-Language"?: string;
            };
            path: {
                /** @description COMET ID of the match, e.g. 443251 */
                matchId: number;
                /** @description Offset from UTC in hours e.g. 2 or -7 */
                utcOffset: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaginatedResults"];
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["PaginatedResultsMatch"];
                };
            };
            /** @description Item not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Server error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["PaginatedResultsMatch"];
                };
            };
            /** @description Bad Gateway */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
        };
    };
    getMatchEvents: {
        parameters: {
            query?: {
                /** @description Organization ID for filtering data. It is required if API_KEY is restricted by organization ID. It will return the data only if the competition is organized by the given organization or organizations below. */
                organizationIdFilter?: number;
                /** @description Team ID for filtering data. It is required if API_KEY is restricted by team ID. It will return the data only if the team is participating in the match. */
                teamIdFilter?: number;
                showComments?: boolean;
            };
            header: {
                /** @description Authorization access token */
                API_KEY: string;
                /** @description Language of the response used for translation of dynamic data like registration types, match phases etc.  <br /><br />Use the header on /api/live/{tenant}/preferences to check if the language is supported. It will return it in the response if it's supported otherwise the fallback language is returned in the response. <br />If the header is left blank (not included in the request) then the default language will be used. */
                "Accept-Language"?: string;
            };
            path: {
                /** @description COMET ID of the match, e.g. 443251 */
                matchId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MatchEvent"][];
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["MatchEvent"][];
                };
            };
            /** @description Item not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Server error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["MatchEvent"][];
                };
            };
            /** @description Bad Gateway */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
        };
    };
    getMatchDetails: {
        parameters: {
            query?: {
                /** @description Organization ID for filtering data. It is required if API_KEY is restricted by organization ID. It will return the match if the competition is organized by the given organization or organizations below. */
                organizationIdFilter?: number;
                /** @description Team ID for filtering data. It is required if API_KEY is restricted by team ID. It will return the match if the team or it's child is participating in the match. */
                teamIdFilter?: number;
            };
            header: {
                /** @description Authorization access token */
                API_KEY: string;
                /** @description Language of the response used for translation of dynamic data like registration types, match phases etc.  <br /><br />Use the header on /api/live/{tenant}/preferences to check if the language is supported. It will return it in the response if it's supported otherwise the fallback language is returned in the response. <br />If the header is left blank (not included in the request) then the default language will be used. */
                "Accept-Language"?: string;
            };
            path: {
                /** @description COMET ID of the match, e.g. 443251 */
                matchId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Match"];
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["Match"];
                };
            };
            /** @description Item not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Server error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["Match"];
                };
            };
            /** @description Bad Gateway */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
        };
    };
    searchPlayers_2: {
        parameters: {
            query?: never;
            header: {
                /** @description Authorization access token */
                API_KEY: string;
                /** @description Language of the response used for translation of dynamic data like registration types, match phases etc.  <br /><br />Use the header on /api/live/{tenant}/preferences to check if the language is supported. It will return it in the response if it's supported otherwise the fallback language is returned in the response. <br />If the header is left blank (not included in the request) then the default language will be used. */
                "Accept-Language"?: string;
            };
            path: {
                /** @description Name of the map overlay style */
                styleName: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaginatedResults"];
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": string;
                };
            };
            /** @description Item not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Server error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": string;
                };
            };
            /** @description Bad Gateway */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
        };
    };
    getKit: {
        parameters: {
            query?: {
                /** @description Organization ID for filtering data. It is required if API_KEY is restricted by organization ID */
                organizationIdFilter?: number;
                /** @description Team ID for filtering data. It is required if API_KEY is restricted by team ID */
                teamIdFilter?: number;
            };
            header: {
                /** @description Authorization access token */
                API_KEY: string;
                /** @description Language of the response used for translation of dynamic data like registration types, match phases etc.  <br /><br />Use the header on /api/live/{tenant}/preferences to check if the language is supported. It will return it in the response if it's supported otherwise the fallback language is returned in the response. <br />If the header is left blank (not included in the request) then the default language will be used. */
                "Accept-Language"?: string;
            };
            path: {
                /**
                 * @description Type of kit
                 * @example referee/home/homeGK/away/awayGK
                 */
                kit: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MatchInfo"];
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json;charset=UTF-8": string;
                };
            };
            /** @description Item not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Server error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json;charset=UTF-8": string;
                };
            };
            /** @description Bad Gateway */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
        };
    };
    exportImages: {
        parameters: {
            query?: {
                /** @description Organization ID for filtering data. It is required if API_KEY is restricted by organization ID */
                organizationIdFilter?: number;
                /** @description Team ID for filtering data. It is required if API_KEY is restricted by team ID */
                teamIdFilter?: number;
            };
            header: {
                /** @description Authorization access token */
                API_KEY: string;
                /** @description Language of the response used for translation of dynamic data like registration types, match phases etc.  <br /><br />Use the header on /api/live/{tenant}/preferences to check if the language is supported. It will return it in the response if it's supported otherwise the fallback language is returned in the response. <br />If the header is left blank (not included in the request) then the default language will be used. */
                "Accept-Language"?: string;
            };
            path: {
                /** @description uuid of the file. e.g. e73a46a5-5918-2a92-8a48-fc730718725a */
                uuid: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Picture"];
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json;charset=UTF-8": string;
                };
            };
            /** @description Item not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Server error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json;charset=UTF-8": string;
                };
            };
            /** @description Bad Gateway */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
        };
    };
    getMatchClubFormation: {
        parameters: {
            query?: {
                /** @description Organization ID for filtering data. It is required if API_KEY is restricted by organization ID. It will return the data only if the competition is organized by the given organization or organizations below. */
                organizationIdFilter?: number;
                /** @description Team ID for filtering data. It is required if API_KEY is restricted by team ID. It will return the data only if the team is participating in the match. */
                teamIdFilter?: number;
            };
            header: {
                /** @description Authorization access token */
                API_KEY: string;
                /** @description Language of the response used for translation of dynamic data like registration types, match phases etc.  <br /><br />Use the header on /api/live/{tenant}/preferences to check if the language is supported. It will return it in the response if it's supported otherwise the fallback language is returned in the response. <br />If the header is left blank (not included in the request) then the default language will be used. */
                "Accept-Language"?: string;
            };
            path: {
                /** @description COMET ID of the match, e.g. 443251 */
                matchId: number;
                homeOrAway: "home" | "away";
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiFormationViewModel"];
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiFormationViewModel"];
                };
            };
            /** @description Item not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Server error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiFormationViewModel"];
                };
            };
            /** @description Bad Gateway */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
        };
    };
    getCompetitionTeams: {
        parameters: {
            query?: {
                /** @description Organization ID for filtering data. It is required if API_KEY is restricted by organization ID. It will return the data only if the competition is organized by the given organization or organizations below. */
                organizationIdFilter?: number;
                /** @description Team ID for filtering data. It is required if API_KEY is restricted by team ID. It will return the data only if the team is participating in the competition or it's elements. */
                teamIdFilter?: number;
            };
            header: {
                /** @description Authorization access token */
                API_KEY: string;
                /** @description Language of the response used for translation of dynamic data like registration types, match phases etc.  <br /><br />Use the header on /api/live/{tenant}/preferences to check if the language is supported. It will return it in the response if it's supported otherwise the fallback language is returned in the response. <br />If the header is left blank (not included in the request) then the default language will be used. */
                "Accept-Language"?: string;
            };
            path: {
                /** @description COMET ID of the competition, e.g. 325433 */
                competitionId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Team"][];
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["Team"][];
                };
            };
            /** @description Item not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Server error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["Team"][];
                };
            };
            /** @description Bad Gateway */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
        };
    };
    getUnofficialTable: {
        parameters: {
            query?: {
                /** @description Organization ID for filtering data. It is required if API_KEY is restricted by organization ID. It will return the data only if the competition is organized by the given organization or organizations below. Attribute allowDetail tells the client if it can call team details endpoints (team details, team matches events...). Value of the field depends on tenant/organizationIdFilter/teamIdFilter */
                organizationIdFilter?: number;
                /** @description Team ID for filtering data. It is required if API_KEY is restricted by team ID. It will return the data only if the team is participating in the competition or it's elements. Attribute allowDetail tells the client if it can call team details endpoints (team details, team matches events...). Value of the field depends on tenant/organizationIdFilter/teamIdFilter */
                teamIdFilter?: number;
            };
            header: {
                /** @description Authorization access token */
                API_KEY: string;
                /** @description Language of the response used for translation of dynamic data like registration types, match phases etc.  <br /><br />Use the header on /api/live/{tenant}/preferences to check if the language is supported. It will return it in the response if it's supported otherwise the fallback language is returned in the response. <br />If the header is left blank (not included in the request) then the default language will be used. */
                "Accept-Language"?: string;
            };
            path: {
                /** @description COMET ID of the competition, e.g. 325433 */
                competitionId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CompetitionTable"];
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["CompetitionTable"];
                };
            };
            /** @description Item not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Server error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["CompetitionTable"];
                };
            };
            /** @description Bad Gateway */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
        };
    };
    getOfficialTable: {
        parameters: {
            query?: {
                /** @description Organization ID for filtering data. It is required if API_KEY is restricted by organization ID. It will return the data only if the competition is organized by the given organization or organizations below. */
                organizationIdFilter?: number;
                /** @description Team ID for filtering data. It is required if API_KEY is restricted by team ID. It will return the data only if the team is participating in the competition or it's elements. */
                teamIdFilter?: number;
            };
            header: {
                /** @description Authorization access token */
                API_KEY: string;
                /** @description Language of the response used for translation of dynamic data like registration types, match phases etc.  <br /><br />Use the header on /api/live/{tenant}/preferences to check if the language is supported. It will return it in the response if it's supported otherwise the fallback language is returned in the response. <br />If the header is left blank (not included in the request) then the default language will be used. */
                "Accept-Language"?: string;
            };
            path: {
                /** @description COMET ID of the competition, e.g. 325433 */
                competitionId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CompetitionTable"];
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["CompetitionTable"];
                };
            };
            /** @description Item not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Server error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["CompetitionTable"];
                };
            };
            /** @description Bad Gateway */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
        };
    };
    getYellowCards: {
        parameters: {
            query?: {
                /** @description Organization ID for filtering data. It is required if API_KEY is restricted by organization ID. */
                organizationIdFilter?: number;
                /** @description Team ID for filtering data. It is required if API_KEY is restricted by team ID. It will filter the data to return only players from the team or teams below. */
                teamIdFilter?: number;
            };
            header: {
                /** @description Authorization access token */
                API_KEY: string;
                /** @description Language of the response used for translation of dynamic data like registration types, match phases etc.  <br /><br />Use the header on /api/live/{tenant}/preferences to check if the language is supported. It will return it in the response if it's supported otherwise the fallback language is returned in the response. <br />If the header is left blank (not included in the request) then the default language will be used. */
                "Accept-Language"?: string;
            };
            path: {
                /** @description COMET ID of the competition, e.g. 325433 */
                competitionId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PlayerStats"][];
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json;charset=UTF-8": string;
                };
            };
            /** @description Item not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Server error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json;charset=UTF-8": string;
                };
            };
            /** @description Bad Gateway */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
        };
    };
    getYellowCards_2: {
        parameters: {
            query?: {
                /** @description Organization ID for filtering data. It is required if API_KEY is restricted by organization ID. */
                organizationIdFilter?: number;
                /** @description Team ID for filtering data. It is required if API_KEY is restricted by team ID. It will filter the data to return only players from the team or teams below. */
                teamIdFilter?: number;
            };
            header: {
                /** @description Authorization access token */
                API_KEY: string;
                /** @description Language of the response used for translation of dynamic data like registration types, match phases etc.  <br /><br />Use the header on /api/live/{tenant}/preferences to check if the language is supported. It will return it in the response if it's supported otherwise the fallback language is returned in the response. <br />If the header is left blank (not included in the request) then the default language will be used. */
                "Accept-Language"?: string;
            };
            path: {
                /** @description COMET ID of the competition, e.g. 325433 */
                competitionId: number;
                /** @description COMET ID of the team to filter statistics, e.g. 1032 */
                teamId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PlayerStats"][];
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json;charset=UTF-8": string;
                };
            };
            /** @description Item not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Server error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json;charset=UTF-8": string;
                };
            };
            /** @description Bad Gateway */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
        };
    };
    getSinBins: {
        parameters: {
            query?: {
                /** @description Organization ID for filtering data. It is required if API_KEY is restricted by organization ID. */
                organizationIdFilter?: number;
                /** @description Team ID for filtering data. It is required if API_KEY is restricted by team ID. It will filter the data to return only players from the team or teams below. */
                teamIdFilter?: number;
            };
            header: {
                /** @description Authorization access token */
                API_KEY: string;
                /** @description Language of the response used for translation of dynamic data like registration types, match phases etc.  <br /><br />Use the header on /api/live/{tenant}/preferences to check if the language is supported. It will return it in the response if it's supported otherwise the fallback language is returned in the response. <br />If the header is left blank (not included in the request) then the default language will be used. */
                "Accept-Language"?: string;
            };
            path: {
                /** @description COMET ID of the competition, e.g. 325433 */
                competitionId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PlayerStats"][];
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json;charset=UTF-8": string;
                };
            };
            /** @description Item not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Server error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json;charset=UTF-8": string;
                };
            };
            /** @description Bad Gateway */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
        };
    };
    getSinBins_2: {
        parameters: {
            query?: {
                /** @description Organization ID for filtering data. It is required if API_KEY is restricted by organization ID. */
                organizationIdFilter?: number;
                /** @description Team ID for filtering data. It is required if API_KEY is restricted by team ID. It will filter the data to return only players from the team or teams below. */
                teamIdFilter?: number;
            };
            header: {
                /** @description Authorization access token */
                API_KEY: string;
                /** @description Language of the response used for translation of dynamic data like registration types, match phases etc.  <br /><br />Use the header on /api/live/{tenant}/preferences to check if the language is supported. It will return it in the response if it's supported otherwise the fallback language is returned in the response. <br />If the header is left blank (not included in the request) then the default language will be used. */
                "Accept-Language"?: string;
            };
            path: {
                /** @description COMET ID of the competition, e.g. 325433 */
                competitionId: number;
                /** @description COMET ID of the team to filter statistics, e.g. 1032 */
                teamId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PlayerStats"][];
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json;charset=UTF-8": string;
                };
            };
            /** @description Item not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Server error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json;charset=UTF-8": string;
                };
            };
            /** @description Bad Gateway */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
        };
    };
    getRedCards: {
        parameters: {
            query?: {
                /** @description Organization ID for filtering data. It is required if API_KEY is restricted by organization ID. */
                organizationIdFilter?: number;
                /** @description Team ID for filtering data. It is required if API_KEY is restricted by team ID. It will filter the data to return only players from the team or teams below. */
                teamIdFilter?: number;
            };
            header: {
                /** @description Authorization access token */
                API_KEY: string;
                /** @description Language of the response used for translation of dynamic data like registration types, match phases etc.  <br /><br />Use the header on /api/live/{tenant}/preferences to check if the language is supported. It will return it in the response if it's supported otherwise the fallback language is returned in the response. <br />If the header is left blank (not included in the request) then the default language will be used. */
                "Accept-Language"?: string;
            };
            path: {
                /** @description COMET ID of the competition, e.g. 325433 */
                competitionId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PlayerStats"][];
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json;charset=UTF-8": string;
                };
            };
            /** @description Item not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Server error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json;charset=UTF-8": string;
                };
            };
            /** @description Bad Gateway */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
        };
    };
    getRedCards_2: {
        parameters: {
            query?: {
                /** @description Organization ID for filtering data. It is required if API_KEY is restricted by organization ID. */
                organizationIdFilter?: number;
                /** @description Team ID for filtering data. It is required if API_KEY is restricted by team ID. It will filter the data to return only players from the team or teams below. */
                teamIdFilter?: number;
            };
            header: {
                /** @description Authorization access token */
                API_KEY: string;
                /** @description Language of the response used for translation of dynamic data like registration types, match phases etc.  <br /><br />Use the header on /api/live/{tenant}/preferences to check if the language is supported. It will return it in the response if it's supported otherwise the fallback language is returned in the response. <br />If the header is left blank (not included in the request) then the default language will be used. */
                "Accept-Language"?: string;
            };
            path: {
                /** @description COMET ID of the competition, e.g. 325433 */
                competitionId: number;
                /** @description COMET ID of the team to filter statistics, e.g. 1032 */
                teamId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PlayerStats"][];
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json;charset=UTF-8": string;
                };
            };
            /** @description Item not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Server error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json;charset=UTF-8": string;
                };
            };
            /** @description Bad Gateway */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
        };
    };
    getOwnScorers: {
        parameters: {
            query?: {
                /** @description Organization ID for filtering data. It is required if API_KEY is restricted by organization ID. */
                organizationIdFilter?: number;
                /** @description Team ID for filtering data. It is required if API_KEY is restricted by team ID. It will filter the data to return only players from the team or teams below. */
                teamIdFilter?: number;
            };
            header: {
                /** @description Authorization access token */
                API_KEY: string;
                /** @description Language of the response used for translation of dynamic data like registration types, match phases etc.  <br /><br />Use the header on /api/live/{tenant}/preferences to check if the language is supported. It will return it in the response if it's supported otherwise the fallback language is returned in the response. <br />If the header is left blank (not included in the request) then the default language will be used. */
                "Accept-Language"?: string;
            };
            path: {
                /** @description COMET ID of the competition, e.g. 325433 */
                competitionId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PlayerStats"][];
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json;charset=UTF-8": string;
                };
            };
            /** @description Item not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Server error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json;charset=UTF-8": string;
                };
            };
            /** @description Bad Gateway */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
        };
    };
    getOwnScorers_2: {
        parameters: {
            query?: {
                /** @description Organization ID for filtering data. It is required if API_KEY is restricted by organization ID. */
                organizationIdFilter?: number;
                /** @description Team ID for filtering data. It is required if API_KEY is restricted by team ID. It will filter the data to return only players from the team or teams below. */
                teamIdFilter?: number;
            };
            header: {
                /** @description Authorization access token */
                API_KEY: string;
                /** @description Language of the response used for translation of dynamic data like registration types, match phases etc.  <br /><br />Use the header on /api/live/{tenant}/preferences to check if the language is supported. It will return it in the response if it's supported otherwise the fallback language is returned in the response. <br />If the header is left blank (not included in the request) then the default language will be used. */
                "Accept-Language"?: string;
            };
            path: {
                /** @description COMET ID of the competition, e.g. 325433 */
                competitionId: number;
                /** @description COMET ID of the team to filter statistics, e.g. 1032 */
                teamId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PlayerStats"][];
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json;charset=UTF-8": string;
                };
            };
            /** @description Item not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Server error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json;charset=UTF-8": string;
                };
            };
            /** @description Bad Gateway */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
        };
    };
    getTopScorers: {
        parameters: {
            query?: {
                /** @description Organization ID for filtering data. It is required if API_KEY is restricted by organization ID. */
                organizationIdFilter?: number;
                /** @description Team ID for filtering data. It is required if API_KEY is restricted by team ID. It will filter the data to return only players from the team or teams below. */
                teamIdFilter?: number;
            };
            header: {
                /** @description Authorization access token */
                API_KEY: string;
                /** @description Language of the response used for translation of dynamic data like registration types, match phases etc.  <br /><br />Use the header on /api/live/{tenant}/preferences to check if the language is supported. It will return it in the response if it's supported otherwise the fallback language is returned in the response. <br />If the header is left blank (not included in the request) then the default language will be used. */
                "Accept-Language"?: string;
            };
            path: {
                /** @description COMET ID of the competition, e.g. 325433 */
                competitionId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PlayerStats"][];
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json;charset=UTF-8": string;
                };
            };
            /** @description Item not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Server error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json;charset=UTF-8": string;
                };
            };
            /** @description Bad Gateway */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
        };
    };
    getTopScorers_2: {
        parameters: {
            query?: {
                /** @description Organization ID for filtering data. It is required if API_KEY is restricted by organization ID. */
                organizationIdFilter?: number;
                /** @description Team ID for filtering data. It is required if API_KEY is restricted by team ID. It will filter the data to return only players from the team or teams below. */
                teamIdFilter?: number;
            };
            header: {
                /** @description Authorization access token */
                API_KEY: string;
                /** @description Language of the response used for translation of dynamic data like registration types, match phases etc.  <br /><br />Use the header on /api/live/{tenant}/preferences to check if the language is supported. It will return it in the response if it's supported otherwise the fallback language is returned in the response. <br />If the header is left blank (not included in the request) then the default language will be used. */
                "Accept-Language"?: string;
            };
            path: {
                /** @description COMET ID of the competition, e.g. 325433 */
                competitionId: number;
                /** @description COMET ID of the team to filter statistics, e.g. 1032 */
                teamId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PlayerStats"][];
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json;charset=UTF-8": string;
                };
            };
            /** @description Item not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Server error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json;charset=UTF-8": string;
                };
            };
            /** @description Bad Gateway */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
        };
    };
    getAssists: {
        parameters: {
            query?: {
                /** @description Organization ID for filtering data. It is required if API_KEY is restricted by organization ID. */
                organizationIdFilter?: number;
                /** @description Team ID for filtering data. It is required if API_KEY is restricted by team ID. It will filter the data to return only players from the team or teams below. */
                teamIdFilter?: number;
            };
            header: {
                /** @description Authorization access token */
                API_KEY: string;
                /** @description Language of the response used for translation of dynamic data like registration types, match phases etc.  <br /><br />Use the header on /api/live/{tenant}/preferences to check if the language is supported. It will return it in the response if it's supported otherwise the fallback language is returned in the response. <br />If the header is left blank (not included in the request) then the default language will be used. */
                "Accept-Language"?: string;
            };
            path: {
                /** @description COMET ID of the competition, e.g. 325433 */
                competitionId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PlayerStats"][];
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json;charset=UTF-8": string;
                };
            };
            /** @description Item not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Server error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json;charset=UTF-8": string;
                };
            };
            /** @description Bad Gateway */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
        };
    };
    getAssists_2: {
        parameters: {
            query?: {
                /** @description Organization ID for filtering data. It is required if API_KEY is restricted by organization ID. */
                organizationIdFilter?: number;
                /** @description Team ID for filtering data. It is required if API_KEY is restricted by team ID. It will filter the data to return only players from the team or teams below. */
                teamIdFilter?: number;
            };
            header: {
                /** @description Authorization access token */
                API_KEY: string;
                /** @description Language of the response used for translation of dynamic data like registration types, match phases etc.  <br /><br />Use the header on /api/live/{tenant}/preferences to check if the language is supported. It will return it in the response if it's supported otherwise the fallback language is returned in the response. <br />If the header is left blank (not included in the request) then the default language will be used. */
                "Accept-Language"?: string;
            };
            path: {
                /** @description COMET ID of the competition, e.g. 325433 */
                competitionId: number;
                /** @description COMET ID of the team to filter statistics, e.g. 1032 */
                teamId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PlayerStats"][];
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json;charset=UTF-8": string;
                };
            };
            /** @description Item not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Server error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json;charset=UTF-8": string;
                };
            };
            /** @description Bad Gateway */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
        };
    };
    getPastCompetitionMatches: {
        parameters: {
            query: {
                /** @description page to retrieve (starts from 1) */
                page: number;
                /** @description size of the page */
                pageSize: number;
                /** @description Organization ID for filtering data. It is required if API_KEY is restricted by organization ID. It will return the data only if the competition is organized by the given organization or organizations below. */
                organizationIdFilter?: number;
                /** @description Team ID for filtering data. It is required if API_KEY is restricted by team ID. It will return the data only if the team is participating in the competition. */
                teamIdFilter?: number;
            };
            header: {
                /** @description Authorization access token */
                API_KEY: string;
                /** @description Language of the response used for translation of dynamic data like registration types, match phases etc.  <br /><br />Use the header on /api/live/{tenant}/preferences to check if the language is supported. It will return it in the response if it's supported otherwise the fallback language is returned in the response. <br />If the header is left blank (not included in the request) then the default language will be used. */
                "Accept-Language"?: string;
            };
            path: {
                /** @description COMET ID of the competition, e.g. 325433 */
                competitionId: number;
                /** @description Offset from UTC in hours e.g. 2 or -7 */
                utcOffset: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaginatedResults"];
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["PaginatedResultsMatch"];
                };
            };
            /** @description Item not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Server error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["PaginatedResultsMatch"];
                };
            };
            /** @description Bad Gateway */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
        };
    };
    getPastCompetitionMatches_2: {
        parameters: {
            query: {
                /** @description page to retrieve (starts from 1) */
                page: number;
                /** @description size of the page */
                pageSize: number;
                /** @description Organization ID for filtering data. It is required if API_KEY is restricted by organization ID. It will return the data only if the competition is organized by the given organization or organizations below. */
                organizationIdFilter?: number;
                /** @description Team ID for filtering data. It is required if API_KEY is restricted by team ID. It will return the data only if the team is participating in the competition. */
                teamIdFilter?: number;
            };
            header: {
                /** @description Authorization access token */
                API_KEY: string;
                /** @description Language of the response used for translation of dynamic data like registration types, match phases etc.  <br /><br />Use the header on /api/live/{tenant}/preferences to check if the language is supported. It will return it in the response if it's supported otherwise the fallback language is returned in the response. <br />If the header is left blank (not included in the request) then the default language will be used. */
                "Accept-Language"?: string;
            };
            path: {
                /** @description COMET ID of the competition, e.g. 325433 */
                competitionId: number;
                /** @description COMET ID of the team to filter the matches, e.g. 12677 */
                teamId: number;
                /** @description Offset from UTC in hours e.g. 2 or -7 */
                utcOffset: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaginatedResults"];
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["PaginatedResultsMatch"];
                };
            };
            /** @description Item not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Server error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["PaginatedResultsMatch"];
                };
            };
            /** @description Bad Gateway */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
        };
    };
    getNextCompetitionMatches: {
        parameters: {
            query: {
                /** @description page to retrieve (starts from 1) */
                page: number;
                /** @description size of the page */
                pageSize: number;
                /** @description Organization ID for filtering data. It is required if API_KEY is restricted by organization ID. It will return the data only if the competition is organized by the given organization or organizations below. */
                organizationIdFilter?: number;
                /** @description Team ID for filtering data. It is required if API_KEY is restricted by team ID. It will return the data only if the team is participating in the competition. */
                teamIdFilter?: number;
            };
            header: {
                /** @description Authorization access token */
                API_KEY: string;
                /** @description Language of the response used for translation of dynamic data like registration types, match phases etc.  <br /><br />Use the header on /api/live/{tenant}/preferences to check if the language is supported. It will return it in the response if it's supported otherwise the fallback language is returned in the response. <br />If the header is left blank (not included in the request) then the default language will be used. */
                "Accept-Language"?: string;
            };
            path: {
                /** @description COMET ID of the competition, e.g. 325433 */
                competitionId: number;
                /** @description Offset from UTC in hours e.g. 2 or -7 */
                utcOffset: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaginatedResults"];
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["PaginatedResultsMatch"];
                };
            };
            /** @description Item not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Server error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["PaginatedResultsMatch"];
                };
            };
            /** @description Bad Gateway */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
        };
    };
    getNextCompetitionMatches_2: {
        parameters: {
            query: {
                /** @description page to retrieve (starts from 1) */
                page: number;
                /** @description size of the page */
                pageSize: number;
                /** @description Organization ID for filtering data. It is required if API_KEY is restricted by organization ID. It will return the data only if the competition is organized by the given organization or organizations below. */
                organizationIdFilter?: number;
                /** @description Team ID for filtering data. It is required if API_KEY is restricted by team ID. It will return the data only if the team is participating in the competition. */
                teamIdFilter?: number;
            };
            header: {
                /** @description Authorization access token */
                API_KEY: string;
                /** @description Language of the response used for translation of dynamic data like registration types, match phases etc.  <br /><br />Use the header on /api/live/{tenant}/preferences to check if the language is supported. It will return it in the response if it's supported otherwise the fallback language is returned in the response. <br />If the header is left blank (not included in the request) then the default language will be used. */
                "Accept-Language"?: string;
            };
            path: {
                /** @description COMET ID of the competition, e.g. 325433 */
                competitionId: number;
                /** @description COMET ID of the team to filter the matches, e.g. 12677 */
                teamId: number;
                /** @description Offset from UTC in hours e.g. 2 or -7 */
                utcOffset: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaginatedResults"];
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["PaginatedResultsMatch"];
                };
            };
            /** @description Item not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Server error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["PaginatedResultsMatch"];
                };
            };
            /** @description Bad Gateway */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
        };
    };
    getCompetitionDetails: {
        parameters: {
            query?: {
                /** @description Organization ID for filtering data. It is required if API_KEY is restricted by organization ID. It will show detail only if the competition is organized by the given organization or organizations below. */
                organizationIdFilter?: number;
                /** @description Team ID for filtering data. It is required if API_KEY is restricted by team ID. It will show detail only if the team is participating in the competition or it's elements. */
                teamIdFilter?: number;
            };
            header: {
                /** @description Authorization access token */
                API_KEY: string;
                /** @description Language of the response used for translation of dynamic data like registration types, match phases etc.  <br /><br />Use the header on /api/live/{tenant}/preferences to check if the language is supported. It will return it in the response if it's supported otherwise the fallback language is returned in the response. <br />If the header is left blank (not included in the request) then the default language will be used. */
                "Accept-Language"?: string;
            };
            path: {
                /** @description COMET ID of the competition, e.g. 325433 */
                competitionId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Competition"];
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["Competition"];
                };
            };
            /** @description Item not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Server error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["Competition"];
                };
            };
            /** @description Bad Gateway */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
        };
    };
    searchCompetitions: {
        parameters: {
            query: {
                /** @description search string */
                keyword: string;
                /** @description page to retrieve */
                page: number;
                /** @description size of the page */
                pageSize: number;
                /** @description Organization for filtering data. It is required if API_KEY is restricted by organization. It will filter and return only competitions organized by the organization hierarchy. */
                organizationIdFilter?: number;
                /** @description Team ID for filtering data. It is required if API_KEY is restricted by team ID. It will filter and return only competitions where team is participating */
                teamIdFilter?: number;
            };
            header: {
                /** @description Authorization access token */
                API_KEY: string;
                /** @description Language of the response used for translation of dynamic data like registration types, match phases etc.  <br /><br />Use the header on /api/live/{tenant}/preferences to check if the language is supported. It will return it in the response if it's supported otherwise the fallback language is returned in the response. <br />If the header is left blank (not included in the request) then the default language will be used. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "result": [
                     *         {
                     *           "id": 88712926,
                     *           "name": "SuperSport Hrvatska nogometna liga 2024/2025.",
                     *           "picture": "df859e06-6498-41af-8f29-8ebd7a8da534",
                     *           "showStandings": true,
                     *           "showStats": true
                     *         },
                     *         {
                     *           "id": 78093806,
                     *           "name": "SuperSport Hrvatska nogometna liga 2023/2024",
                     *           "picture": "81db474b-cf27-475a-8597-ca51b00b4d15",
                     *           "showStandings": true,
                     *           "showStats": true
                     *         }
                     *       ],
                     *       "size": 281
                     *     }
                     */
                    "application/json": components["schemas"]["PaginatedResults"];
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["PaginatedResultsCompetition"];
                };
            };
            /** @description Item not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Server error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["PaginatedResultsCompetition"];
                };
            };
            /** @description Bad Gateway */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
        };
    };
    getCompetitions: {
        parameters: {
            query?: {
                /** @description Organization ID for filtering data. It is required if API_KEY is restricted by organization ID. It will filter the data and show only competitions organized by the given organization or organizations below. */
                organizationIdFilter?: number;
                /** @description Team ID for filtering data. It is required if API_KEY is restricted by team ID. It will filter the data and show only competitions where the team is participating. */
                teamIdFilter?: number;
            };
            header: {
                /** @description Authorization access token */
                API_KEY: string;
                /** @description Language of the response used for translation of dynamic data like registration types, match phases etc.  <br /><br />Use the header on /api/live/{tenant}/preferences to check if the language is supported. It will return it in the response if it's supported otherwise the fallback language is returned in the response. <br />If the header is left blank (not included in the request) then the default language will be used. */
                "Accept-Language"?: string;
            };
            path: {
                /** @description Status of competition, e.g. active */
                status: "active" | "all";
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Competition"][];
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json;charset=UTF-8": string;
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Item not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Server error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json;charset=UTF-8": string;
                };
            };
            /** @description Bad Gateway */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
        };
    };
    getCompetitions_2: {
        parameters: {
            query?: {
                /** @description Organization ID for filtering data. It is required if API_KEY is restricted by organization ID. It will filter the data and show only competitions organized by the given organization or organizations below. */
                organizationIdFilter?: number;
                /** @description Team ID for filtering data. It is required if API_KEY is restricted by team ID. It will filter the data and show only competitions where the team is participating. */
                teamIdFilter?: number;
            };
            header: {
                /** @description Authorization access token */
                API_KEY: string;
                /** @description Language of the response used for translation of dynamic data like registration types, match phases etc.  <br /><br />Use the header on /api/live/{tenant}/preferences to check if the language is supported. It will return it in the response if it's supported otherwise the fallback language is returned in the response. <br />If the header is left blank (not included in the request) then the default language will be used. */
                "Accept-Language"?: string;
            };
            path: {
                /** @description Status of competition, e.g. active */
                status: "active" | "all";
                /** @description COMET ID of the team to filter statistics, e.g. 1032 */
                teamId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Competition"][];
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json;charset=UTF-8": string;
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Item not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Server error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json;charset=UTF-8": string;
                };
            };
            /** @description Bad Gateway */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
        };
    };
    sendRssNotification: {
        parameters: {
            query: {
                /** @description ID of the RSS news source */
                newsSourceId: number;
                /** @description GUID of the news item (usually it's some kind of URL */
                newsGuid: string;
            };
            header: {
                /** @description Authorization access token */
                API_KEY: string;
                /** @description Language of the response used for translation of dynamic data like registration types, match phases etc.  <br /><br />Use the header on /api/live/{tenant}/preferences to check if the language is supported. It will return it in the response if it's supported otherwise the fallback language is returned in the response. <br />If the header is left blank (not included in the request) then the default language will be used. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain;charset=UTF-8": string;
                };
            };
            /** @description Item not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
            /** @description Server error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain;charset=UTF-8": string;
                };
            };
            /** @description Bad Gateway */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ExceptionViewModel"];
                };
            };
        };
    };
}
