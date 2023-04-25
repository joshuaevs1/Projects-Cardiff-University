const connection = require('./databaseconnection');
const request = require("request");

const options = {
  method: 'GET',
  url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures',
  qs: { season: '2022', league: '39' },
  headers: {
    'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
    'X-RapidAPI-Key': '0ffaa83612mshbe33847a2033f3bp183e96jsnf707adcfd07f'
  }
};

//Request from API gatheres all fixtures in one request 
request(options, function (error, response, body) {
  if (error) throw new Error(error);
  const fixtures = JSON.parse(body).response;
  const manUFixtureIds = []; // initialize empty list to hold fixture ids for Manchester United

  //For each fixture with Manchester United playing, add Fixture ID to list
  fixtures.forEach(fixtureData => {
    if (fixtureData.teams.home.name === 'Manchester United' || fixtureData.teams.away.name === 'Manchester United') {
      manUFixtureIds.push(fixtureData.fixture.id); // add fixture id to list
    }
    const insertFixtures = () => {
      const query = 'INSERT INTO Fixtures (FixturesID, HomeTeamID, AwayTeamID, Referee, Date, VenueName, City, Status, GoalsHome, GoalsAway, LeagueID ) VALUES ?';
      const values = [[fixtureData.fixture.id, fixtureData.teams.home.id, fixtureData.teams.away.id, fixtureData.fixture.referee, fixtureData.fixture.date, 
        fixtureData.fixture.venue.name, fixtureData.fixture.venue.city, fixtureData.fixture.status.long, 
        fixtureData.goals.home, fixtureData.goals.away, fixtureData.league.id]];
      connection.query(query, [values], (err, result) => {
        if (err) throw err;
        console.log('Inserted ' + result.affectedRows + ' rows into fixtures table. ');
      });
    };
    insertFixtures();
  });

  manUFixtureIds.forEach((fixtureM, index) => {
    //30 second timer is set to request for each prediction of fixture
    setTimeout(() => {
      const options = {
        method: 'GET',
        url: 'https://api-football-v1.p.rapidapi.com/v3/predictions',
        qs: { fixture: fixtureM },
        headers: {
          'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
          'X-RapidAPI-Key': '0ffaa83612mshbe33847a2033f3bp183e96jsnf707adcfd07f'
        }
      }
      request(options, function (error, response, body) {
        if (error) throw new Error(error);
        const prediction = JSON.parse(body).response;
        const insertPredictions = () => {
          const query = 'INSERT INTO Predictions (FixtureID, HomeTeamID, AwayTeamID, Winner, Comment, WinOrDraw, UnderOver, GoalsHome, GoalsAway, Advice) VALUES ?';
          const values = [[fixtureM, prediction[0].teams.home.id, prediction[0].teams.away.id, prediction[0].predictions.winner.name, prediction[0].predictions.winner.comment,
           prediction[0].predictions.win_or_draw, prediction[0].predictions.under_over, 
           prediction[0].predictions.goals.home, prediction[0].predictions.goals.away, prediction[0].predictions.advice]];
          console.log(values);
          connection.query(query, [values], (err, result) => {
          if (err) throw err;
            console.log('Inserted ' + result.affectedRows + ' rows into predictions table. ');
        });
      };
      insertPredictions();
    });
  }, index * 30000); // delay 30 seconds between each request to avoid exceeding API rate limit
 });
});
