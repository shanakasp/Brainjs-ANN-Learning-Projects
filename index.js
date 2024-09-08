const http = require("http");
const brain = require("brain.js");

// Create a new instance of a neural network
const network = new brain.NeuralNetwork();

// Function to classify RGB colors as light or dark
const classifyColor = (r, g, b) => {
  // Normalize RGB values
  r = r / 255;
  g = g / 255;
  b = b / 255;

  // Calculate luminance
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  // Return 1 for light, 0 for dark
  return luminance > 0.5 ? 1 : 0;
};

// Training data: RGB values and corresponding classification
const trainingData = [
  // Dark Colors
  { input: [0.1, 0.2, 0.3], output: [0] }, // Dark
  { input: [0.2, 0.3, 0.4], output: [0] }, // Dark
  { input: [0.3, 0.4, 0.5], output: [0] }, // Dark
  { input: [0.4, 0.5, 0.6], output: [0] }, // Dark
  { input: [0.1, 0.1, 0.1], output: [0] }, // Dark
  { input: [0.05, 0.05, 0.05], output: [0] }, // Very Dark
  { input: [0.2, 0.2, 0.2], output: [0] }, // Dark Gray
  { input: [0.15, 0.15, 0.3], output: [0] }, // Dark Blue
  { input: [0.3, 0.1, 0.2], output: [0] }, // Dark Red

  // Light Colors
  { input: [0.9, 0.8, 0.7], output: [1] }, // Light
  { input: [0.8, 0.9, 0.7], output: [1] }, // Light
  { input: [0.7, 0.9, 0.8], output: [1] }, // Light
  { input: [0.6, 0.7, 0.9], output: [1] }, // Light
  { input: [0.9, 0.9, 0.9], output: [1] }, // Light
  { input: [0.95, 0.95, 0.95], output: [1] }, // Very Light
  { input: [0.7, 0.9, 0.6], output: [1] }, // Light Green
  { input: [0.9, 0.7, 0.7], output: [1] }, // Light Red
  { input: [0.9, 0.9, 0.4], output: [1] }, // Light Yellow

  // Edge Cases
  { input: [0.5, 0.5, 0.5], output: [0] }, // Medium Gray
  { input: [0.5, 0.7, 0.5], output: [1] }, // Medium Light Green
];

// Training configuration
const config = {
  log: true,
  logPeriod: 1,
  errorThresh: 0.02,
  iterations: 200, // Increased iterations for better training
  learningRate: 0.01,
};

// Train the neural network
network.train(trainingData, config);

// Test data: RGB values to classify
const testColor = [4 / 255, 4 / 255, 3 / 255]; // Corrected RGB color

const result = network.run(testColor);

// Classify result: 0 = dark, 1 = light
const classification = result > 0.5 ? "Light" : "Dark";

console.log(
  `Test color RGB: (${testColor[0] * 255}, ${testColor[1] * 255}, ${
    testColor[2] * 255
  }) is classified as: ${classification}`
);

// Creating a server
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end(
    `The color RGB (${testColor[0] * 255}, ${testColor[1] * 255}, ${
      testColor[2] * 255
    }) is classified as: ${classification}\n`
  );
});

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
