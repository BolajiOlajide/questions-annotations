const MongoClient = require('mongodb').MongoClient;
const config = require('lazy-config')


const { url: dbUrl } = config.db;

const fetchMongoClient = async () => {
  const client = new MongoClient(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  return client.connect();

};

module.exports = fetchMongoClient;
