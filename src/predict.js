const tf = require('@tensorflow/tfjs');
const path = require('path');

// Load the trained model and make predictions
async function predictLoanApproval(inputData) {
  console.log('Loading model...');
  const modelPath = './loan-model.json';
  
  // Load the model from the JSON configuration
  const model = await tf.loadLayersModel(modelPath);


  console.log('Making predictions...');
  const inputTensor = tf.tensor2d([inputData], [1, 3]); // Input: Age, Income, LoanAmount
  const prediction = model.predict(inputTensor);
  const output = prediction.dataSync()[0];
  
  console.log(`Loan approval probability: ${(output * 100).toFixed(2)}%`);
}

const inputData = [30, 55000, 15000]; // Example input: Age, Income, LoanAmount
predictLoanApproval(inputData).catch((error) => console.error('Error:', error));
