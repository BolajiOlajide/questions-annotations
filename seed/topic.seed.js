const csv = require('csv-parser');
const fs = require('fs');

const results = [];

fs.createReadStream('./dataset/topics.csv')
  .pipe(csv())
  .on('data', (data) => results.push({
    'Topic Level 1': data['Topic Level 1'],
    'Topic Level 2': data['Topic Level 2'],
    'Topic Level 3': data['Topic Level 3']
  }))
  .on('end', () => {
    console.log('Topic Seed Successful');
  });
