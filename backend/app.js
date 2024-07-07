const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const dataFilePath = path.join(__dirname, 'data.json');

// Read data from JSON file on server start
let data = [];
try {
  const rawData = fs.readFileSync(dataFilePath);
  data = JSON.parse(rawData);
} catch (err) {
  console.error("Error reading data file:", err);
}

// Function to save data to JSON file
const saveDataToFile = () => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

app.get('/data', (req, res) => {
  res.json(data);
});

app.post('/data', (req, res) => {
  const newData = req.body;
  data.push(newData);
  saveDataToFile();
  res.status(201).json(newData);
});

app.put('/data/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const updatedData = req.body;
  data = data.map(item => item.id === id ? {...item, ...updatedData} : item);
  saveDataToFile();
  res.json(updatedData);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
