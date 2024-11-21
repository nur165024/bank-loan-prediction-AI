// const tf = require("@tensorflow/tfjs");
// const path = require("path");

// // Load the trained model and make predictions
// async function predictLoanApproval(inputData) {
//   console.log("Loading model...");
//    const modelPath = `file://${path.resolve(
//      __dirname,
//      "../loan-model/loan-model.json"
//    )}`;
//   console.log("Model path:", modelPath);

//   // Load the model from the JSON configuration
//   const model = await tf.loadLayersModel(modelPath);
//   console.log("Model loaded");
//   console.log("Making predictions...");
//   const inputTensor = tf.tensor2d([inputData], [1, 3]); // Input: Age, Income, LoanAmount
//   const prediction = model.predict(inputTensor);
//   const output = prediction.dataSync()[0];

//   console.log(`Loan approval probability: ${(output * 100).toFixed(2)}%`);
// }

// const inputData = [30, 55000, 15000]; // Example input: Age, Income, LoanAmount
// predictLoanApproval(inputData).catch((error) => console.error("Error:", error));
const tf = require("@tensorflow/tfjs");
const fs = require("fs").promises;
const path = require("path");

async function loadLocalModel(modelPath) {
  try {
    const modelJSON = await fs.readFile(modelPath, "utf8");
    const modelConfig = JSON.parse(modelJSON);

    const model = await tf.models.modelFromJSON(modelConfig);

    return model;
  } catch (error) {
    console.error("Error loading model:", error);
    throw error;
  }
}

async function predictLoanApproval(inputData) {
  console.log("Loading model...");
  const modelPath = path.resolve(__dirname, "../loan-model/loan-model.json");
  console.log("Model path:", modelPath);

  const model = await loadLocalModel(modelPath);
  console.log("Model loaded");
  console.log("Making predictions...");

  const inputTensor = tf.tensor2d([inputData], [1, inputData.length]);

  const prediction = model.predict(inputTensor);
  const output = prediction.dataSync()[0];

  console.log(`Loan approval probability: ${(output * 100).toFixed(2)}%`);

  inputTensor.dispose();
  prediction.dispose();
}

const inputData = [50, 5000, 1000];
predictLoanApproval(inputData).catch((error) => console.error("Error:", error));
