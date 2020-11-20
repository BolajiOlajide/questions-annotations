const csv = require('csv-parser');
const fs = require('fs');

const results = [];

fs.createReadStream('./dataset/questions.csv')
  .pipe(csv())
  .on('data', (data) => results.push({
    'Question number': data['Question number'],
    'Annotation 1': data['Annotation 1'],
    'Annotation 2': data['Annotation 2'],
    'Annotation 3': data['Annotation 3'],
    'Annotation 4': data['Annotation 4'],
    'Annotation 5': data['Annotation 5']
  }))
  .on('data', data => results.push(data))
  .on('end', () => {
    console.log(results)
    console.log('Question Seed Successful');
  });
