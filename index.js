const express = require('express');
const config = require('lazy-config');

const fetchMongoClient = require('./db/client');


const { port } = config.app

const app = express();

app.get('/', (req, res) => {
  const mongoClient = fetchMongoClient();
  const { q } = req.query

  if (q) {
    return res.json({ status: 'success', q });
  }

  return res.status(400).json({
    status: 'error',
    message: 'Query string wasn\'t provided'
  });
});

if (config.isDev) {
  app.use(require('koii'));
}

app.listen(port, err => {
  const message = err ? `Error starting the app: ${err.message}` : `App started on port ${port}`;
  console.log(message);
});
