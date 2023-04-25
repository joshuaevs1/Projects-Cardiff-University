const connection = require('./databaseconnection');
var request = require("request")



//Each request supplies all the data needed to fill the Tables Team, Biggest, Goals, RecordFixtures and Records table
var options = {
  method: 'GET',
  url: 'https://api-football-v1.p.rapidapi.com/v3/teams/statistics',
  qs: {season: '2022', team: '33',  league: '39'},
 headers: {
    'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
    'X-RapidAPI-Key': '0ffaa83612mshbe33847a2033f3bp183e96jsnf707adcfd07f'
  }
};

//This is the inital request, and the response can supply all the below tables
request(options, function (error, response, body) {
  if(error) throw new Error(error);

	var teamStatistics = JSON.parse(body);
  //Inserting data into Teams Table
  const insertTeams = () => {
    const query = 'INSERT INTO Teams (ID, Team, League, LeagueID, SeasonID) VALUES ?';
    const values = [[teamStatistics.response.team.id, teamStatistics.response.team.name, teamStatistics.response.league.name,
       teamStatistics.response.league.id, teamStatistics.response.league.season]];
    connection.query(query, [values], (err, result) => {
      if (err) throw err;
      console.log('Inserted ' + result.affectedRows + ' rows into Teams table. ')
    });
  };


  
  //Inserting data into Biggest Table
  const insertBiggest = () => {
    const query = 'INSERT INTO Biggest (TeamID, StreakWins, StreakLosses, StreakDraws, WinAtHome, WinAtAway, LossAtHome, LossAtAway, GoalsForHome, GoalsForAway, GoalsAgainstHome, GoalsAgainstAway) VALUES ?';
    const values = [[teamStatistics.response.team.id, teamStatistics.response.biggest.streak.wins, teamStatistics.response.biggest.streak.loses, teamStatistics.response.biggest.streak.draws, 
      teamStatistics.response.biggest.wins.home, teamStatistics.response.biggest.wins.away, teamStatistics.response.biggest.loses.home, teamStatistics.response.biggest.loses.away, 
      teamStatistics.response.biggest.goals.for.home, teamStatistics.response.biggest.goals.for.away, teamStatistics.response.biggest.goals.against.home, 
      teamStatistics.response.biggest.goals.against.away]]
      connection.query(query, [values], (err, result) => {
        if (err) throw err;
        console.log('Inserted ' + result.affectedRows + ' rows into Biggest table ' )
      });
  }




  //Inserting data into Goals Table 
  const insertGoals = () => {
    const query = 'INSERT INTO Goals (TeamId, TotalFor, TotalAgainst, TotalHome, TotalAway, AvgHome, AvgAway, AgainstHome, AgainstAway, AvgAgainstHome, AvgAgainstAway) VALUES ?'
    const values = [[ teamStatistics.response.team.id, teamStatistics.response.goals.for.total.total, 
      teamStatistics.response.goals.against.total.total, teamStatistics.response.goals.for.total.home, teamStatistics.response.goals.for.total.away, 
      teamStatistics.response.goals.for.average.home, teamStatistics.response.goals.for.average.away, teamStatistics.response.goals.against.total.home, 
      teamStatistics.response.goals.against.total.away, teamStatistics.response.goals.against.average.home, teamStatistics.response.goals.against.average.away ]]
      connection.query(query, [values], (err, result) => {
        if (err) throw err;
        console.log('Inserted ' + result.affectedRows + ' rows into Goals table ' )
      });
    }




  //Inserting data into RecordFixtures Table 
  const insertRecordFixtures = () => {
    const query = 'INSERT INTO FixtureRecord ( TeamId, Total, Home, Away, TotalWins, TotalLosses, TotalDraws, WinsHome, WinsAway, LossesHome, LossesAway, DrawsHome, DrawsAway) VALUES ? '
    const values = [[ teamStatistics.response.team.id, teamStatistics.response.fixtures.played.total, teamStatistics.response.fixtures.played.home, 
      teamStatistics.response.fixtures.played.away, teamStatistics.response.fixtures.wins.total, teamStatistics.response.fixtures.loses.total, teamStatistics.response.fixtures.draws.total,
      teamStatistics.response.fixtures.wins.home, teamStatistics.response.fixtures.wins.away, teamStatistics.response.fixtures.loses.home, teamStatistics.response.fixtures.loses.home, 
      teamStatistics.response.fixtures.draws.home, teamStatistics.response.fixtures.draws.away  ]]
    connection.query(query, [values], (err, result) => {
    if (err) throw err;
    console.log('Inserted ' + result.affectedRows + ' rows into FixturesRecord table')
  })
  }




  //Inserting data into Records Table
  const insertRecords = () => {
    const query = 'INSERT INTO Records (TeamID, TotalClean_sheet, Clean_sheetHome, Clean_sheetAway, TotalFailed_to_score, Failed_to_scoreHome, Failed_to_scoreAway, TotalPenalty, PercentagePenalty, MissedPenalty, PercentageMissedPenalty) VALUES ?'
    const values = [[ teamStatistics.response.team.id, teamStatistics.response.clean_sheet.total, teamStatistics.response.clean_sheet.home, teamStatistics.response.clean_sheet.away, 
        teamStatistics.response.failed_to_score.total,
      teamStatistics.response.failed_to_score.home, teamStatistics.response.failed_to_score.away, teamStatistics.response.penalty.total,
       teamStatistics.response.penalty.scored.percentage, teamStatistics.response.penalty.missed.total, teamStatistics.response.penalty.missed.percentage  ]]
  connection.query(query, [values], (err, result) => {
    if (err) throw err;
    console.log('Inserted ' + result.affectedRows + ' rows into Records table' )
  })
}

  insertTeams()
  insertBiggest()
  insertGoals()
  insertRecords()
  insertRecordFixtures()

});


                         
