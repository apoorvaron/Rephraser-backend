const app = require('./express');
const db = require('./db');

app.get('/config/healthcheck', (req, res) => {
  db.query('SELECT 1')
    .then(() => res.status(200).send('Database is connected'))
    .catch(err => res.status(500).send('Database connection error'));
});

module.exports = app;