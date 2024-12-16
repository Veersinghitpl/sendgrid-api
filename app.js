const express = require('express');
const bodyParser = require('body-parser');
const emailRoutes = require('./routes/campaignRoutes');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Routes
app.use('/api', emailRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
