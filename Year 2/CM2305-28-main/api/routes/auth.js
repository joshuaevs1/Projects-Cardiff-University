const express = require('express');
const app = express();
const db = require('../inc/db.js');
const bcrypt = require('bcrypt');

// Register an account
app.post('/register', (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let confirm_password = req.body.confirm_password;
  if (password !== confirm_password) {
    return res.status(400).send({
      success: false,
      message: 'Passwords do not match',
    });
  }
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      return res.status(500).send({
        success: false,
        message: 'Error hashing password',
      });
    }
    // Store the password hash
    db.query('INSERT INTO Users (username, password) VALUES (?, ?)', [username, hash], (err) => {
      if (err) {
        return res.status(500).send({
          success: false,
          message: 'Error registering user',
        });
      }
      // Send the response
      return res.status(200).send({
        success: true,
        message: 'User registered',
      });
    });
  });
});

// Login to account
app.post('/login', (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  db.query('SELECT * FROM Users WHERE username = ?', [username], (err, result) => {
    if (err) {
      return res.status(500).send({
        success: false,
        message: 'Error logging in',
      });
    }
    if (result.length == 0) {
      return res.status(403).send({
        success: false,
        message: 'User does not exist',
      });
    }
    bcrypt.compare(password, result[0].password, (err, valid_password) => {
      if (err) {
        return res.status(500).send({
          success: false,
          message: 'Error checking hash.',
        });
      }
      if (!valid_password) {
        return res.status(401).send({
          success: false,
          message: 'Password is incorrect',
        });
      }
      // Send the response
      return res.status(200).send({
        success: true,
        message: 'Login successful',
      });
    });
  });
});

// Logout from account.
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.send('Successfully logged out.');
});

// Check if user is logged in.
app.get('/check_login', (req, res) => {
  if (req.session.user) {
    res.status(200).send(req.session.user);
  } else {
    res.status(401).send('false');
  }
});

module.exports = app;
