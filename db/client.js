const MongoClient = require('mongodb').MongoClient;
const config = require('lazy-config')


const { url: dbUrl } = config.db;
let client;

const fetchMongoClient = async () => {
  if (!client) {
    const _client = new MongoClient(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    client = await client.connect();
  }

  return client;
};

module.exports = fetchMongoClient;
