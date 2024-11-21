const tf = require('@tensorflow/tfjs');
const fs = require('fs');
const csv = require('csv-parser');

// Load and preprocess the dataset
async function loadCSV(filePath) {
  const data = [];
  return new Promise((resolve) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        data.push({
          inputs: [parseFloat(row.Age), parseFloat(row.Income), parseFloat(row.LoanAmount)],
          output: parseFloat(row.Approved),
        });
      })
      .on('end', () => resolve(data));
  });
}

// Build and train the model
async function trainModel() {
  console.log('Loading data...');
  const data = await loadCSV('loan-model/loan_data.csv');

  const inputs = tf.tensor2d(data.map((d) => d.inputs));
  const labels = tf.tensor2d(data.map((d) => [d.output]));

  console.log('Building model...');

  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 10, inputShape: [3], activation: 'relu' }));
  model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

  model.compile({
    optimizer: tf.train.adam(),
    loss: 'binaryCrossentropy',
    metrics: ['accuracy'],
  });

  console.log('Training model...');
  await model.fit(inputs, labels, {
    epochs: 50,
    batchSize: 10,
    shuffle: true,
  });

  console.log('Training complete. Saving model to JSON format...');

  // Save model architecture and weights to JSON
  const modelJSON = await model.toJSON();

  // Save the JSON file
  const savePath = './loan-model/loan-model.json';
  fs.writeFileSync(savePath, JSON.stringify(modelJSON, null, 2)); // Format JSON for readability

  console.log(`Model saved to ${savePath}`);
}

trainModel().catch((error) => console.error('Error:', error));
