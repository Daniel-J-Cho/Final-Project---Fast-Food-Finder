require('dotenv/config');
const path = require('path');
const pg = require('pg');
const express = require('express');
const errorMiddleware = require('./error-middleware');

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const app = express();
const publicPath = path.join(__dirname, 'public');

if (process.env.NODE_ENV === 'development') {
  app.use(require('./dev-middleware')(publicPath));
}

app.use(express.static(publicPath));

app.get('/api/hello', (req, res) => {
  res.json({ hello: 'world' });
});

app.use(express.json());

app.get('/api/locations', (req, res, next) => {
  const query = req.query.query;
  const location = req.query.location;
  const radius = req.query.radius;
  fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&location=${location}&radius=${radius}&type=restaurant&key=${process.env.GOOGLE_MAPS_API_KEY}`)
    .then(fetchResponse => fetchResponse.json())
    .then(data => res.json(data))
    .catch(err => next(err));
});

app.get('/api/restLocs', (req, res, next) => {
  const sql = `
    select *
      from "locations"
     order by "locationId"
  `;
  db.query(sql)
    .then(result => {
      res.json(result.rows);
    })
    .catch(err => next(err));
});

app.post('/api/restLocs', (req, res) => {
  const { restName, restAddress, googlePlaceId } = req.body;
  if (!restName || !restAddress || !googlePlaceId) {
    res.status(400).json({
      error: 'restName(string), restAddress(string), and googlePlaceId(string from google) are required fields'
    });
    return;
  }
  const sql = `
    insert into "locations" ("restaurantName", "address", "googlePlaceId")
    values ($1, $2, $3)
    returning *
  `;
  const params = [restName, restAddress, googlePlaceId];
  db.query(sql, params)
    .then(result => {
      const [locationData] = result.rows;
      res.status(201).json(locationData);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'an unexpected error occurred'
      });
    });
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
