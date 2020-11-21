const { nanoid } = require('nanoid');


const generateNestedSet = (nameOfSet, dataset) => {
  let counter = 1;
  const transformedDataSet = [];

  const rootNode = { name: nameOfSet, left: counter, parent: null, _id: nanoid(10) };
  counter += 1;
  transformedDataSet.push(rootNode);

  for (const node of dataset) {
    const currentLevelOneNode = { name: node.name, parent: rootNode._id, _id: nanoid(10), left: counter }
    counter += 1;

    for (const nodeLevelTwo of node.descendants) {
      const currentLevelTwoNode = { name: nodeLevelTwo.name, parent: currentLevelOneNode._id, _id: nanoid(10), left: counter }
      counter += 1;

      for (const nodeLevelThree of nodeLevelTwo.descendants) {
        const currentLevelThreeNode = { name: nodeLevelThree.name, parent: currentLevelTwoNode._id, _id: nanoid(10), left: counter }
        counter += 1;

        currentLevelThreeNode.right = counter;
        counter += 1;
        transformedDataSet.push(currentLevelThreeNode);
      }

      currentLevelTwoNode.right = counter;
      counter += 1;
      transformedDataSet.push(currentLevelTwoNode);
    }

    currentLevelOneNode.right = counter;
    counter += 1;
    transformedDataSet.push(currentLevelOneNode);
  }

  rootNode.right = counter;

  return transformedDataSet;
};

module.exports = generateNestedSet;
