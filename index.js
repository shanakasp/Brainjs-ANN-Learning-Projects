const http = require("http");

const brain = require("brain.js");

const network = new brain.NeuralNetwork();

// Training data: weights for children and adults
const trainingData = [
  { input: [20], output: [0] }, // Child (weight: 20kg)
  { input: [30], output: [0] }, // Child (weight: 30kg)
  { input: [35], output: [0] }, // Child (weight: 35kg)
  { input: [40], output: [0] }, // Child (weight: 40kg)
  { input: [50], output: [1] }, // Adult (weight: 50kg)
  { input: [55], output: [1] }, // Adult (weight: 55kg)
  { input: [60], output: [1] }, // Adult (weight: 60kg)
  { input: [70], output: [1] }, // Adult (weight: 70kg)
];

// Configuration for training
const config = {
  log: true, // Enable logging
  logPeriod: 1, // Log training progress after every iteration
  errorThresh: 0.02, // Acceptable error threshold
  iterations: 100, // Maximum number of iterations
  learningRate: 0.01, // Adjust the learning rate
};

network.train(trainingData, config);

const testWeight = 50;
const result = network.run([testWeight]);

// Classify result: 0 = child, 1 = adult
const classification = result < 0.5 ? "Child" : "Adult";

console.log(`Test weight: ${testWeight}, Classification: ${classification}`);

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end(
    `The person with weight ${testWeight}kg is classified as: ${classification}\n`
  );
});

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
