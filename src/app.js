const express = require('express');
const server = express();

const hostname = '0.0.0.0';
const port = 3000;

server.get('/', (req, res) => {
  res.type('html');
  res.status(200);
  res.end("Home");
})

server.get('/posts', (req, res) => {
  res.type('html');
  res.status(200);
  res.end("Liste des articles");
})

server.post('/posts', (req, res) => {
  res.type('html');
  res.status(201);
  res.end("Article crée");
})

server.listen(port, hostname);
