const fs = require('fs');
const { faker } = require('@faker-js/faker');

// Generate loan data
function generateLoanData(numRecords) {
  const rows = [];
  rows.push('Age,Income,LoanAmount,Approved'); // CSV Header

  for (let i = 0; i < numRecords; i++) {
    const age = faker.number.int({ min: 20, max: 65 }); // Age between 20 and 65
    const income = faker.number.int({ min: 20000, max: 150000 }); // Income between 20k and 150k
    const loanAmount = faker.number.int({ min: 5000, max: 50000 }); // Loan amount between 5k and 50k
    const approved = faker.datatype.boolean() ? 1 : 0; // Random approval (0 or 1)
    rows.push(`${age},${income},${loanAmount},${approved}`);
  }

  return rows.join('\n');
}

// Save data to CSV file
function saveToCSV(fileName, data) {
  fs.writeFileSync(fileName, data);
  console.log(`Data saved to ${fileName}`);
}

// Generate 500 records and save to loan_data.csv
const csvData = generateLoanData(500);
saveToCSV('loan-model/loan_data.csv', csvData);
