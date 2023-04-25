const mysql = require('mysql');

// Establishing connection with the cloud database
const connection = mysql.createConnection({
  host: 'sql8.freesqldatabase.com',
  user: 'sql8606055',
  password: 'dQvqXIEDCY',
  database: 'sql8606055'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to the database and MySQL server!');
});

module.exports = connection;
