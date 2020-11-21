const csv = require('csv-parser');
const fs = require('fs');
const config = require('lazy-config');

const generateNestedSet = require('../utils/generateNestedSet');
const getMongoClient = require('../db/client');


const results = {};

fs.createReadStream('./dataset/topics.csv')
  .pipe(csv())
  .on('data', (data) => {
    const topicLevelOne = data['Topic Level 1'];
    const topicLevelTwo = data['Topic Level 2'];
    const topicLevelThree = data['Topic Level 3'];

    let topLevelNode = results[topicLevelOne];

    if (!topLevelNode) {
      results[topicLevelOne] = { name: topicLevelOne, descendants: [] }
      topLevelNode = results[topicLevelOne]
    }

    if (topicLevelTwo) {
      let secondLevelNode;
      const filteredDescendant = topLevelNode.descendants.filter((item) => {
        if (item.name === topicLevelTwo) {
          secondLevelNode = item;
          return false;
        }
        return true;
      });

      if (!secondLevelNode) {
        secondLevelNode = { name: topicLevelTwo, descendants: [] };
      }

      if (topicLevelThree) {
        let thirdLevelNode;
        const filteredSecondDescendant = secondLevelNode.descendants.filter((item) => {
          if (item.name === topicLevelThree) {
            thirdLevelNode = item;
            return false;
          }
          return true;
        });

        if (!thirdLevelNode) {
          thirdLevelNode = { name: topicLevelThree, descendants: [] };
        }

        filteredSecondDescendant.push(thirdLevelNode);
        secondLevelNode = { ...secondLevelNode, descendants: filteredSecondDescendant };
      }

      filteredDescendant.push(secondLevelNode);
      topLevelNode = { ...topLevelNode, descendants: filteredDescendant };
      results[topicLevelOne] = topLevelNode;
    }
  })
  .on('end', async () => {
    const mongoClient = await getMongoClient();
    const nestedDataSet = generateNestedSet('Topics', Object.values(results));

    await mongoClient.collection('topics').insertMany(nestedDataSet);

    // create indexes
    await mongoClient.createIndex('topics', 'name', { unique: true });
    await mongoClient.createIndex('topics', 'left', { unique: true });
    await mongoClient.createIndex('topics', 'right', { unique: true });

    console.log('Topics Seeded Successful');
    process.exit(0);
  });
