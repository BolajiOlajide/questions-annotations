const MongoClient = require('mongodb').MongoClient;
const config = require('lazy-config')


const { url: dbUrl, name: dbName } = config.db;
let client;

const fetchMongoClient = async () => {
  if (!client) {
    const _client = new MongoClient(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    client = await _client.connect();
  }

  return client.db(dbName);
};

module.exports = fetchMongoClient;
