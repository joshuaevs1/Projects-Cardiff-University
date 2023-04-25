const connection = require('./databaseconnection');
const request = require("request");

// Set up options for the first API request to get the full squad of team ID 
const options = {
  method: 'GET',
  url: 'https://api-football-v1.p.rapidapi.com/v3/players/squads',
  qs: {team: '45' },
  headers: {
    'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
    'x-rapidapi-key': '4b8ef03758mshc3aa072607431edp1b9954jsncd22e0a1f639'
  }
};

// Make the first API request to get the squad of team ID and add all player IDs to a list 'ids'
request(options, function (error, response, body) {
  if (error) throw new Error(error);
  const squad = JSON.parse(body);
  const ids = squad.response[0].players.map((player) => player.id);

  //2022 set to the current season 
  const seasonNum = 2022;

  // Loop through each player ID and retrieve their statistics, then insert into the Players table in the database
  ids.forEach((value, index) => {
    //Timer is set to gather Player statistics every 30 seconds
    setTimeout(() => {
      // Set up options for the API request to get the player statistics
      const options = {
        method: 'GET',
        url: 'https://api-football-v1.p.rapidapi.com/v3/players',
        qs: {id: value, season: seasonNum },
        headers: {
          'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
          'x-rapidapi-key': '4b8ef03758mshc3aa072607431edp1b9954jsncd22e0a1f639'
        }
      };

      // Gathering the relevant statistics and storing them in a variable
      request(options, function (error, response, body) {
        if (error) throw new Error(error);
        const playerStatistic = JSON.parse(body);
        const stats = playerStatistic.response[0]['statistics'];
        const playerStatistics = playerStatistic.response[0]['player'];
        console.log(playerStatistics);

        // Insert the player statistics into the Players table in the database
        const Players = () => {
          const query = 'INSERT INTO Players (TeamID, FirstName, SecondName, Age, Birth, Appearences, Lineups, Minutes, Position, SubstitutesIn, SubstitutesOut, Shots, ShotOnTarget, TotalGoals, Conceded, Assists, Saves, TotalPasses, KeyPasses, PassingAccuracy, TotalTackles, SuccessfulDribbles, FoulsDrawn, FoulsCommitted, YellowCards, RedCards, PenaltiesScored, PenaltiesSaved, name) VALUES (?)';
          const values = [stats[0].team.id, playerStatistics.firstname, playerStatistics.lastname, playerStatistics.age, playerStatistics.birth.date,
          stats[0].games.appearences, stats[0].games.lineups, stats[0].games.minutes, playerStatistics.position, stats[0].games.substitutes_in, 
          stats[0].games.substitutes_out, stats[0].shots.total, stats[0].shots.on, stats[0].goals.total, stats[0].goals.conceded, stats[0].goals.assists, 
          stats[0].goals.saves, stats[0].passes.total, stats[0].passes.key, stats[0].passes.accuracy, stats[0].tackles.total, stats[0].dribbles.success, 
          stats[0].fouls.drawn, stats[0].fouls.committed, stats[0].cards.yellow, stats[0].cards.red, stats[0].penalty.scored, stats[0].penalty.saved, 
          playerStatistics.firstname + ' ' + playerStatistics.lastname];
          connection.query(query, [values], (err, res) => {
            if (err) throw err;
            console.log(`Inserted player ${playerStatistics.firstname} ${playerStatistics.lastname} into the Players table`);
          });
        };
        Players();
      });
    }, index * 3000);
  });
});