const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'reproductor_musica'
});

db.connect(err => {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + db.threadId);
});

app.get('/songs', (req, res) => {
  db.query('SELECT * FROM songs', (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

app.get('/search', (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).send('Query parameter is required');
  }

  const sqlQuery = `
    SELECT * FROM songs
    WHERE title LIKE ? OR artist LIKE ?
  `;
  const searchQuery = `%${query}%`;

  db.query(sqlQuery, [searchQuery, searchQuery], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
