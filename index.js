const express = require('express');
const config = require('lazy-config');

const fetchMongoClient = require('./db/client');


const { port } = config.app;

const app = express();

app.get('/', (_, res) => res.json('It works!'));

app.get('/search', async (req, res) => {
  const mongoClient = await fetchMongoClient();

  const { q } = req.query;

  if (q) {
    const topic = await mongoClient.collection('topics').findOne({ name: q });
    const _subtopics =  await mongoClient.collection('topics').find({
      left: { $gt: topic.left },
      right: { $lt: topic.right }
    });

    const subtopics = await _subtopics.toArray();
    return res.json({ status: 'success', q, subtopics });
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
