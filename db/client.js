const MongoClient = require('mongodb').MongoClient;
const config = require('lazy-config')


let client;

const { url: dbUrl } = config.db;

const fetchMongoClient = () => {
  if (!client) {
    client = new MongoClient(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    client.connect(err => {
      if (err) {
        console.log(`An error occurred while connecting to mongo. ${err.message}`);
      }
    });
  }

  return client;
};

module.exports = fetchMongoClient;
