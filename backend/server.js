const express = require('express');
const cors = require('cors');
const fs = require('fs');
const readline = require('readline');

const app = express();
app.use(cors());

let cities = [];

// load cities data
function loadCities(filePath) {
  const readInterface = readline.createInterface({
    input: fs.createReadStream(filePath),
    output: process.stdout,
    console: false
  });

  readInterface.on('line', function(line) {
    cities.push(line);
  });

  readInterface.on('close', () => {
    console.log('Cities data loaded.');
  });
}

// search cities
function searchCities(query) {
  return cities.filter(city => city.toLowerCase().includes(query.toLowerCase())).slice(0, 10);
}

// set up API endpoints
app.get('/cities', (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.json([]);
  }
  const results = searchCities(query);
  console.log('Search results:', results);
  res.json(results);
});

// luanch server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  
  // load cities data
  loadCities('world-cities.txt');
});
