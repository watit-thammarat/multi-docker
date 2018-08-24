const express = require('express');
const redis = require('redis');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');

const keys = require('./keys');

const PORT = process.env.PORT || 5000;
const app = express();
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort
});
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
});

pgClient.on('error', () => console.log('Lost PG connection'));

pgClient
  .query('create table if not exists values (number int)')
  .catch(err => console.log(err));

const redisPublisher = redisClient.duplicate();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send('Hi');
});

app.get('/values/all', async (req, res) => {
  const values = await pgClient.query('select * from values');
  res.json(values.rows);
});

app.get('/values/current', (req, res) => {
  redisClient.hgetall('values', (err, values) => {
    res.json(values);
  });
});

app.post('/values', async (req, res) => {
  const index = req.body.index;
  if (+index > 40) {
    return res.status(422).send('Index to high');
  }
  redisClient.hset('values', index, 'Nothing yet!');
  redisPublisher.publish('insert', index);
  await pgClient.query('insert into values(number) values ($1)', [index]);
  res.json({ working: true });
});

app.listen(PORT, () => console.log(`Listening at port ${PORT}`));
