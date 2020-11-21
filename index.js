const express = require('express');
const config = require('lazy-config');

const fetchMongoClient = require('./db/client');


const { port } = config.app;

const app = express();

app.get('/', (_, res) => res.json('It works!'));

app.get('/search', async (req, res) => {
  try {
    const mongoClient = await fetchMongoClient();

    const { q } = req.query;

    if (q) {
      const topic = await mongoClient.collection('topics').findOne({ name: q });
      const _subtopics = await mongoClient
        .collection('topics')
        .find({ left: { $gt: topic.left }, right: { $lt: topic.right } });

      const subtopics = (await _subtopics.toArray()).map(subtopic => subtopic.name);

      const questions = await mongoClient
        .collection('questions')
        .find({ annotations: { $in: subtopics } })
        .toArray();

      return res.json({ status: 'success', questions });
    }

    return res.status(400).json({
      status: 'error',
      message: 'Query string wasn\'t provided'
    });
  } catch (error) {
    return res.status(422).json({
      status: 'error',
      message: `There was an error searching for the topic. ${error.message}`
    });
  }
});

if (config.isDev) {
  app.use(require('koii'));
}

app.listen(port, err => {
  const message = err ? `Error starting the app: ${err.message}` : `App started on port ${port}`;
  console.log(message);
});
