'use strict';

// Require the modules we need
const express = require('express');
const bodyParser = require('body-parser');
const path = require("path");
const url = require('url');
const routes = require('./routes');
require('dotenv').config();


// Set up express
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(routes);

// Processes homepage request
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// Respond not found to all the wrong routes
app.use((req, res, next) => {
  res.status(404);
  res.type('txt').send('Not found');
});

// Error Middleware
app.use((err, req, res, next) => {
  if(err) {
    res.status(err.status || 500)
      .type('txt')
      .send(err.message || 'SERVER ERROR');
  }  
});

//Listen for requests
const server = app.listen(process.env.PORT || 3000,  () => {
  const port = server.address().port;
  console.log('File Metadata Microservice app is listening on port ',  port);
});