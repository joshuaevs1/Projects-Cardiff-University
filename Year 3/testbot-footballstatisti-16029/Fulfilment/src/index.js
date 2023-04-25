'use strict';
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
const mysql = require('mysql');


process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
//Needed functions
//Configuration to database
  function connectToDatabase(){
    const connection = mysql.createConnection({
      host:'sql8.freesqldatabase.com',
      user: 'sql8606055',
      password: 'dQvqXIEDCY',
      database: 'sql8606055'
    });
    
    return new Promise((resolve, reject) => {
      connection.connect();
      resolve(connection);
    });
  }
  
  //Query for League standings
  function queryDatabaseLeagueStanding(connection){
  	return new Promise((resolve, reject) => {
    	connection.query("SELECT L.LeagueName, T.Team, SUM(F.TotalWins) AS Wins, SUM(F.TotalDraws) AS Draws, SUM(F.TotalLosses) AS Losses, SUM(F.TotalWins)*3 + SUM(F.TotalDraws) AS Points FROM Teams T JOIN League L ON T.LeagueID = L.LeagueID JOIN FixtureRecord F ON T.ID = F.TeamId GROUP BY L.LeagueName, T.Team ORDER BY L.LeagueName, Points DESC;", (error, results, fields) => {
       	  resolve(results);
        });
    });
  }
  
  //Query for all Predictions
  function queryDatabaseForPredictions(connection){
  	return new Promise((resolve, reject)=> {
      connection.query("SELECT p.PredictionID, t1.Team AS HomeTeam, t2.Team AS AwayTeam, f.Date, p.Winner, p.Comment, p.WinOrDraw, p.UnderOver, p.GoalsHome, p.GoalsAway, p.Advice FROM Predictions p INNER JOIN Fixtures f ON p.FixtureID = f.FixturesID INNER JOIN Teams t1 ON f.HomeTeamID = t1.ID INNER JOIN Teams t2 ON f.AwayTeamID = t2.ID WHERE f.Status = 'Not Started';",(error, results, fields) => {
          resolve(results);
      });
    });
  }
  
  
 //Query for all Past fixture results 
  function queryDatabasePastResults(connection){
  	return new Promise((resolve, reject) => {
      connection.query("SELECT f.Date, h.Team AS HomeTeam, a.Team AS AwayTeam, f.GoalsHome, f.GoalsAway, f.Status FROM Fixtures f JOIN Teams h ON f.HomeTeamID = h.ID JOIN Teams a ON f.AwayTeamID = a.ID WHERE f.Status = 'Match Finished';",(error, results, fields) => {
        resolve(results);
      });
    });
  }
  
  //Query for all Future Fixtures
  function queryDatabaseFutureFixtures(connection){
    return new Promise((resolve, reject) => {
      connection.query("SELECT f.FixturesID, home.Team AS HomeTeam, away.Team AS AwayTeam, f.Date, f.VenueName, f.City, f.Status FROM Fixtures f JOIN Teams home ON f.HomeTeamID = home.ID JOIN Teams away ON f.AwayTeamID = away.ID WHERE f.Status = 'Not Started';",(error, results, fields) => {
		resolve(results);
      });
    });
  }
  
  //Query for specifc Players
function queryDatabasePlayers(connection, name) {
  const sql = `SELECT * FROM Players WHERE CONCAT(FirstName, ' ', SecondName) LIKE '%${name}%' OR name LIKE '%${name}%'`;
  return new Promise((resolve, reject) => {
    connection.query(sql, (error, results, fields) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}




  //Query database for specific team from goals table 
function queryDatabaseGoals(connection, teamName) {
  return new Promise((resolve, reject) => {
    const query = `SELECT Teams.Team, G.TotalFor, G.TotalAgainst, G.TotalHome, G.TotalAway, G.AvgHome, G.AvgAway, G.AgainstHome, G.AgainstAway, G.AvgAgainstHome, G.AvgAgainstAway FROM Teams JOIN Goals G ON Teams.ID = G.TeamID WHERE Teams.Team LIKE '%${teamName}%'`;

    connection.query(query, (error, results, fields) => {
      if (error) reject(error);
      resolve(results);
    });
  });
}

  
  //Query for Players in league
  function queryPlayersLeague(connection, league){
    return new Promise((resolve, reject) =>{
    connection.query(`SELECT p.* FROM Players p JOIN Teams t ON p.TeamID = t.ID JOIN League l ON t.LeagueID = l.LeagueID WHERE l.LeagueName = '${league}';`,(error, results, fields) => {
		resolve(results);
      });
  });
}
  //Query for Players in Team 
  function queryPlayerTeam(connection, team){
  	return new Promise((resolve, reject) =>{                    
      connection.query(`SELECT Players.* FROM Players INNER JOIN Teams ON Players.TeamID = Teams.ID WHERE Teams.Team = '${team}';`, (error, results, fields) => {
  		resolve(results);
      });
  });
}
  
  
// Query for specific team's Fixture Record
function queryDatabaseFixtureRecord(connection, teamName) {
return new Promise((resolve, reject) => {
connection.query(`SELECT Teams.Team, FixtureRecord.Total, FixtureRecord.Home, FixtureRecord.Away, FixtureRecord.TotalWins, FixtureRecord.TotalLosses, FixtureRecord.TotalDraws, FixtureRecord.WinsHome, FixtureRecord.WinsAway, FixtureRecord.LossesHome, FixtureRecord.LossesAway, FixtureRecord.DrawsHome, FixtureRecord.DrawsAway FROM Teams INNER JOIN FixtureRecord ON Teams.ID = FixtureRecord.TeamId WHERE Teams.Team = '${teamName}';`, (error, results, fields) => {
if (error) {
		reject(error);
	} else {
	resolve(results[0]);
			}
		});
	});
}

  
// Query for specific team's Record
function queryDatabaseRecord(connection, teamName) {
return new Promise((resolve, reject) => {
connection.query(`SELECT t.Team, r.TotalCleanSheets, r.CleanSheetsAtHome, r.CleanSheetsAtAway, r.FailedToScore, r.FailedToScoreAtHome, r.FailedToScoreAtAway, r.TotalPenalties, r.PercentagePenaltyRate, r.MissedPenalties, r.PercentageOfMissedPenalties FROM Teams t JOIN Records r ON t.ID = r.TeamID WHERE t.Team = '${teamName}';`, (error, results, fields) => {
	if (error) {
		reject(error);
	} else {
		resolve(results[0]);
					}
			});
		});
	}

// Query for specific team's biggest stats
function queryDatabaseBiggest(connection, teamName) {
return new Promise((resolve, reject) => {
connection.query(`SELECT Teams.Team, Biggest.StreakWins, Biggest.StreakLosses, Biggest.StreakDraws, Biggest.WinAtHome, Biggest.WinAtAway, Biggest.LossAtHome, Biggest.LossAtAway, Biggest.GoalsForHome, Biggest.GoalsForAway, Biggest.GoalsAgainstHome, Biggest.GoalsAgainstAway FROM Teams LEFT JOIN Biggest ON Teams.ID = Biggest.TeamID WHERE Teams.Team = '${teamName}';`, (error, results, fields) => {
	if (error) {
		reject(error);
	} else {
		resolve(results[0]);
					}
			});
		});
	}
  
  
  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }


  

    
  
//Function for removing whitespace to query entity in database
function WhitespaceRemove(statistic) {
  return new Promise((resolve, reject) => {
    try {
      const statisticString = JSON.stringify(statistic);
      const statisticWithoutSpaces = statisticString.replace(/\s/g, '');
      const statisticParsed = JSON.parse(statisticWithoutSpaces);
      resolve(statisticParsed);
    } catch (error) {
      reject(error);
    }
  });
}

  //Handling read for specfic player statistics 
async function handleReadForPlayerStats(agent) {
  // Obtain parameters
  const player_name = agent.parameters.person.name;
  const statistic1 = agent.parameters.statistic1;
  let cleanStatistic = '';

  try {
    // Get rid of the whitespaces so that it can be identified within the database
    cleanStatistic = await WhitespaceRemove(statistic1);

    // Connect to the database and perform the query
    const connection = await connectToDatabase();
    const result = await queryDatabasePlayers(connection, player_name);
    connection.end();

    // Check if a player was found and return the result
    if (result.length > 0) {
      const foundPlayer = result[0];
      const value = foundPlayer[cleanStatistic];
      if (value !== undefined) {
        agent.add(
          `${foundPlayer.name} has had ${value} ${statistic1} so far this season.`
        );
      } else {
        agent.add(`${foundPlayer.name} does not have a ${statistic1} statistic.`);
      }
    } else {
      agent.add(`Could not find player ${player_name}.`);
    }
  } catch (error) {
    console.error(error);
    agent.add('Sorry, there was an error while querying the database.');
  }
}



async function handleReadFromTeamGoals(agent) {
  const team_name = agent.parameters.team;
  const statistic = agent.parameters.statistic;
  let cleanStatistic = '';

  try {
    cleanStatistic = await WhitespaceRemove(statistic);
    const connection = await connectToDatabase();
    const result = await queryDatabaseGoals(connection, team_name);
    connection.end();

    if (result.length > 0) {
      const value = result[0][cleanStatistic];
      agent.add(`${team_name} have ${value} ${statistic} goals in the season so far.`);
    } else {
      agent.add(`Sorry, ${team_name} could not be found in the database.`);
    }
  } catch (error) {
    console.error(error);
    agent.add('Sorry, there was an error while querying the database.');
  }
}


  
//Handle queries for Teams Fixture Record
async function handleReadFromTeamFixtureRecord(agent) {
  const team_name = agent.parameters.team;
  const statistic = agent.parameters.statistic;
  let cleanStatistic = '';

  try {
    cleanStatistic = await WhitespaceRemove(statistic);
    const connection = await connectToDatabase();
    const result = await queryDatabaseFixtureRecord(connection, team_name);
    connection.end();
    if (result) {
      const value = result[cleanStatistic];
      agent.add(`${team_name} have ${value} ${statistic} in the season so far.`);
    } else {
      agent.add(`Sorry, could not find any statistics for ${team_name} in the database.`);
    }
  } catch (error) {
    console.error(error);
    agent.add('Sorry, there was an error while querying the database.');
  }
}

//Handle queries for Teams Record
async function handleReadFromTeamRecord(agent) {
  const team_name = agent.parameters.team;
  const statistic = agent.parameters.teamsrecord;
  let cleanStatistic = '';

  try {
    cleanStatistic = await WhitespaceRemove(statistic);
    const connection = await connectToDatabase();
    const result = await queryDatabaseRecord(connection, team_name);
    connection.end();
    if (result) {
      const value = result[cleanStatistic];
      agent.add(`${team_name} have ${value} ${statistic} in the season so far.`);
    } else {
      agent.add(`Sorry, could not find any statistics for ${team_name} in the database.`);
    }
  } catch (error) {
    console.error(error);
    agent.add('Sorry, there was an error while querying the database.');
  }
}

//Handle queries for Teams Biggest
async function handleReadFromTeamBiggest(agent) {
  const team_name = agent.parameters.team;
  const statistic = agent.parameters.teamsbiggest;
  let cleanStatistic = '';

  try {
    cleanStatistic = await WhitespaceRemove(statistic);
    const connection = await connectToDatabase();
    const result = await queryDatabaseBiggest(connection, team_name);
    connection.end();
    if (result) {
      const value = result[cleanStatistic];
      agent.add(`${team_name} have ${value} ${statistic} in the season so far.`);
    } else {
      agent.add(`Sorry, could not find any statistics for ${team_name} in the database.`);
    }
  } catch (error) {
    console.error(error);
    agent.add('Sorry, there was an error while querying the database.');
  }
}


  
async function handleReadForQueryLeaguePlayers(agent) {
  const league = agent.parameters.Leagues;
  const statistic = agent.parameters.quantifiersPlayer;
  const team = agent.parameters.team;
  const number = agent.parameters.number;
  const quantifier = agent.parameters.tablequantifiers;
  
  let queryResult;
  
  try {
    const connection = await connectToDatabase();
    
    if (league) {
      queryResult = await queryPlayersLeague(connection, league);
    } else if (team) {
      queryResult = await queryPlayerTeam(connection, team);
    } else {
      agent.add('Please specify either a league or a team to query players from.');
      return;
    }
    
    if (statistic) {
      const columnName = await WhitespaceRemove(statistic.replace('most', ''));
      console.log(columnName);
		if (queryResult.length === 0 || queryResult.every(player => !player[columnName])) {
 			agent.add(`Sorry, no player has been found with the '${statistic}' statistic.`);
  			return;
		}

      const sortedPlayers = queryResult.sort((a, b) => b[columnName] - a[columnName]);
      
      if (quantifier && number) {
        const topPlayers = sortedPlayers.slice(0, number);
        response =`Here are the ${quantifier} ${number} players in the ${(league ? league : (team ? team : ''))} by ${statistic}:`;
        for (let i = 0; i < number; i++) {
      	response += `\n${i+1}. ${topPlayers[i].name} with ${topPlayers[i][columnName]} ${columnName}`;
    	}
		agent.add(response);

      } else if (number) {
        const player = sortedPlayers[number - 1];
        agent.add(`${player.name} is the ${number}${number === 1 ? 'st' : number === 2 ? 'nd' : number === 3 ? 'rd' : 'th'} best player in the ${league || team} by ${statistic} (${player[columnName]})`);
      } else {
        const player = sortedPlayers[0];
        agent.add(`${player.name} has the ${statistic} with ${player[columnName]} in ${league || team}`);
      }
    } else {
      agent.add('Please specify a statistic to query players by.');
    }
  } catch (error) {
    console.log(error);
    agent.add('Sorry, there was an error while querying the database.');
  }
}

//Handler for Future Fixtures
async function handleReadForFutureFixtures(agent) {
  const team1 = agent.parameters.team;
  const team2 = agent.parameters.team1;

  try {
    const connection = await connectToDatabase();
    const result = await queryDatabaseFutureFixtures(connection);

    let teamFixtures;

    if (team2) {
      teamFixtures = result.filter(fixture => {
        const homeTeam = fixture.HomeTeam;
        const awayTeam = fixture.AwayTeam;
        return (homeTeam === team1 && awayTeam === team2) || (homeTeam === team2 && awayTeam === team1);
      });
    } else {
      teamFixtures = result.filter(fixture => {
        const homeTeam = fixture.HomeTeam;
        const awayTeam = fixture.AwayTeam;
        return homeTeam === team1 || awayTeam === team1;
      });
    }

    // Sort teamFixtures array in ascending order based on fixture date
    teamFixtures.sort((a, b) => new Date(a.Date) - new Date(b.Date));

    // Get the next fixture based on fixture date
    const nextFixture = teamFixtures[0];

    if (nextFixture) {
      if(team2){
        agent.add(`The next match between ${nextFixture.HomeTeam} and ${nextFixture.AwayTeam} will be held at ${nextFixture.VenueName}, ${nextFixture.City} with ${nextFixture.HomeTeam} at home on ${nextFixture.Date}`);
      } else{ 
      agent.add(`${team1}'s next match is on the ${nextFixture.Date}. Home: ${nextFixture.HomeTeam},  Away: ${nextFixture.AwayTeam} and will be held at ${nextFixture.VenueName}, ${nextFixture.City}.`);
      }
    } else {
      agent.add("No future fixture found for the team.");
    }
  } catch (error) {
    console.error(error);
    agent.add("An error occurred while processing your request.");
  }
}

  //Handler for past fixtuers 
async function handleReadForPastFixtures(agent) {
  const team1 = agent.parameters.team;
  const team2 = agent.parameters.team1;

  try {
    const connection = await connectToDatabase();
    const result = await queryDatabasePastResults(connection);
    
    let teamFixtures;
    
    if (team2) {
      teamFixtures = result.filter(fixture => {
        const homeTeam = fixture.HomeTeam;
        const awayTeam = fixture.AwayTeam;
        return (homeTeam === team1 && awayTeam === team2) || (homeTeam === team2 && awayTeam === team1);
      });
    } else {
      teamFixtures = result.filter(fixture => {
        const homeTeam = fixture.HomeTeam;
        const awayTeam = fixture.AwayTeam;
        return homeTeam === team1 || awayTeam === team1;
      });
    }
    
    // Sort teamFixtures array in descending order based on fixture date
    teamFixtures.sort((a, b) => new Date(b.Date) - new Date(a.Date));
    
    // Get the most recent fixture based on fixture date
    const mostRecentFixture = teamFixtures[0];
    
    if (mostRecentFixture) {
      const homeTeam = mostRecentFixture.HomeTeam;
      const awayTeam = mostRecentFixture.AwayTeam;
      const goalsHome = mostRecentFixture.GoalsHome;
      const goalsAway = mostRecentFixture.GoalsAway;
      agent.add(`The most recent match between ${homeTeam} and ${awayTeam} finished with ${homeTeam} - ${goalsHome}, and ${awayTeam} - ${goalsAway}`);
    } else {
      agent.add("No past fixture found for the team.");
    }
  } catch (error) {
    console.error(error);
    agent.add("An error occurred while processing your request.");
  }
}


  
async function handleReadForLeagueStandings(agent){
  const quantifier = agent.parameters.tablequantifiers;
  const league = agent.parameters.leagues;
  const number = agent.parameters.number;
  
  try {
    const connection = await connectToDatabase();
    const result = await queryDatabaseLeagueStanding(connection);

    let numTeams = number ? Math.min(number, result.length) : 1;
    let teams = '';
    let position = false;
    let response = ``;

    if (!quantifier) {
      if (!number) {
        agent.add("I'm sorry, I didn't understand your request. Please provide either a 'top' or 'bottom' quantifier, or a number to retrieve a specific team.");
        return;
      }
      const teamIndex = Math.min(number-1, result.length-1);
      teams = [result[teamIndex]];
      position = true;
      
    } else if (quantifier === 'top') {
      teams = result.slice(0, numTeams);
    } else if (quantifier === 'bottom') {
      teams = result.slice(-numTeams);
    } else {
      agent.add("I'm sorry, I didn't understand your quantifier. Please choose either 'top' or 'bottom'.");
      return;
    }
    if (position){
      response = `${teams[0].Team} are currently at position ${number} in the ${league} table`;
    } else{
     response = `The ${quantifier} ${numTeams} team${numTeams > 1 ? 's' : ''} in the ${league} are:`;
    for (let i = 0; i < numTeams; i++) {
      response += `\n${i+1}. ${teams[i].Team} with ${teams[i].Points} points`;
    }
    }
    agent.add(response);
  
  } catch (error) {
    console.error(error);
    agent.add("An error occurred while processing your request.");
  }
}

async function handleReadForPredictions(agent) {
  const teams = agent.parameters.team;
  try {
    const connection = await connectToDatabase();
    const results = await queryDatabaseForPredictions(connection);
    let winOrDraw = false;
    // Sort results by closest date
    results.sort((a, b) => new Date(a.Date) - new Date(b.Date));
    
    if (teams.length === 1) {
      // Find closest prediction for one team
      console.log(teams[0]);
      const closestPrediction = results.find(prediction => prediction.HomeTeam === teams[0] || prediction.AwayTeam === teams[0]);
      if (closestPrediction.WinOrDraw === 1){
      	 winOrDraw = true;
      }
      
      agent.add(`The closest prediction for ${teams[0]} is ${closestPrediction.HomeTeam} vs ${closestPrediction.AwayTeam} on ${closestPrediction.Date}, the advice for this match is Winner: ${closestPrediction.Winner}, Win or Draw: ${winOrDraw}, Advice: ${closestPrediction.Advice}`);
    } else if (Array.isArray(teams) && teams.length === 2) {
      // Find next prediction for two teams
      const nextPrediction = results.find(prediction => (prediction.HomeTeam === teams[0] && prediction.AwayTeam === teams[1]) || (prediction.HomeTeam === teams[1] && prediction.AwayTeam === teams[0]));
      if (nextPrediction.WinOrDraw === 1){
      	 winOrDraw = true;
      }
      agent.add(`The next prediction for ${teams[0]} vs ${teams[1]} is ${nextPrediction.HomeTeam} on ${nextPrediction.Date}, is winner ${nextPrediction.Winner}, Win or Draw: ${winOrDraw}, Advice: ${nextPrediction.Advice}`);
    } else {
      agent.add("Sorry I couldn't find any predictions for that specific team or teams");
    }
  } catch(error){
    console.error(error);
    agent.add("An error occurred while processing this request");
  }
}

  
  
  
  
  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('team goals', handleReadFromTeamGoals);
  intentMap.set('player statistics', handleReadForPlayerStats);
  intentMap.set('teams fixture record', handleReadFromTeamFixtureRecord);
  intentMap.set('teams record', handleReadFromTeamRecord);
  intentMap.set('team biggest', handleReadFromTeamBiggest);
  intentMap.set('league query players', handleReadForQueryLeaguePlayers);
  intentMap.set('recent fixture results', handleReadForPastFixtures);
  intentMap.set('league standings', handleReadForLeagueStandings);
  intentMap.set('get predictions', handleReadForPredictions);
  intentMap.set('query future fixtures', handleReadForFutureFixtures);
  agent.handleRequest(intentMap);
});
