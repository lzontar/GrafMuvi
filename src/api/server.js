// Author: @lzontar

const express = require('express');

const server = express();
const port = 3000;
server.use(express.json());

server.get('/api/id/:imdbId', function(req, res) {
  res.status(200).json({
    "1" : "Godfather",
    "2" : "Training day",
    "3" : "Black mass"
  });
});
server.get('/api/title/:title/:year', (req, res) => {
  return res.status(200).json({
    "1" : "Godfather",
    "2" : "Training day",
    "3" : "Black mass"
  });
});
server.post('/api/id', (req, res) => {
  return res.status(200).json({
    "id1" : "tt0765429",
    "id2" : "tt0353496",
    "promotions": 101,
  });
});
server.post('/api/title', (req, res) => {
  return res.status(200).json({
    "id1" : "tt0765429",
    "id2" : "tt0353496",
    "promotions": 99,
  });
});

server.listen(port, () => console.log(`Server listening at port ${port}`));

module.exports = server;
