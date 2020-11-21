const csv = require('csv-parser');
const fs = require('fs');

const generateNestedSet = require('../utils/generateNestedSet');


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
  .on('end', () => {
    const nestedDataSet = generateNestedSet('Topics', Object.values(results));
    console.log('Topic Seed Successful');
  });
