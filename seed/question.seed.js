const csv = require('csv-parser');
const fs = require('fs');

const getMongoClient = require('../db/client');


const results = [];

fs.createReadStream('./dataset/questions.csv')
  .pipe(csv())
  .on('data', (data) => {
    const questionNumber = data['Question number'];
    const annotations = [
      data['Annotation 1'],
      data['Annotation 2'],
      data['Annotation 3'],
      data['Annotation 4'],
      data['Annotation 5']
    ];

    results.push({ questionNumber, annotations });
  })
  .on('end', async () => {
    const mongoClient = await getMongoClient();

    await mongoClient.collection('questions').insertMany(results);

    // create indexes
    await mongoClient.createIndex('questions', 'questionNumber', { unique: true });
    await mongoClient.createIndex('questions', 'annotations');

    console.log('Questions Seeded Successful');
    process.exit(0);
  });
