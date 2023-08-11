import app from './express.js';
import db from './db.js';

app.get('/config/healthcheck', (req, res) => {
  db.query('SELECT 1')
    .then(() => res.status(200).send('Database is connected'))
    .catch(err => res.status(500).send('Database connection error'));
}); 


export default app;