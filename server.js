const express = require('express');
const { getTrends } = require('./scrape_trending');
require('dotenv').config();
const app = express();
const port = process.env.PORT;

app.use(express.static('public'));

app.get('/run-script', async (req, res) => {
  try {
    const result = await getTrends();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at ${process.env.SERVER_BASE}`);
});