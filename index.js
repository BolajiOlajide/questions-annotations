const express = require('express');
const config = require('lazy-config');

const { port } = config.app

const app = express();

app.get('/', (req, res) => {
  const { q } = req.query

  if (q) {
    return res.json({ status: 'success', q });
  }

  return res.status(400).json({
    status: 'error',
    message: 'Query string wasn\'t provided'
  });
})

app.listen(port, err => {
  const message = err ? `Error starting the app: ${err.message}` : `App started on port ${port}`;
  console.log(message);
})
