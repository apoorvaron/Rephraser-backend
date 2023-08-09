const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(cors());

// Routes
// const apiRoutes = require('./routes/apiRoutes');
// app.use('/api', apiRoutes);

app.get('/', (req, res)=>{
    console.log("Home Page");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;