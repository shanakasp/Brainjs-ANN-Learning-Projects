const http = require("http");
const brain = require("brain.js");
const cors = require("cors");
const express = require("express");
const app = express();

const network = new brain.NeuralNetwork();

const classifyColor = (r, g, b) => {
  r = r / 255;
  g = g / 255;
  b = b / 255;

  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  return luminance > 0.5 ? 1 : 0;
};

const trainingData = [
  // Dark Colors
  { input: [0.1, 0.2, 0.3], output: [0] },
  { input: [0.2, 0.3, 0.4], output: [0] },
  { input: [0.3, 0.4, 0.5], output: [0] },
  { input: [0.4, 0.5, 0.6], output: [0] },
  { input: [0.1, 0.1, 0.1], output: [0] },
  { input: [0.05, 0.05, 0.05], output: [0] },
  { input: [0.2, 0.2, 0.2], output: [0] },
  { input: [0.15, 0.15, 0.3], output: [0] },
  { input: [0.3, 0.1, 0.2], output: [0] },

  // Light Colors
  { input: [0.9, 0.8, 0.7], output: [1] },
  { input: [0.8, 0.9, 0.7], output: [1] },
  { input: [0.7, 0.9, 0.8], output: [1] },
  { input: [0.6, 0.7, 0.9], output: [1] },
  { input: [0.9, 0.9, 0.9], output: [1] },
  { input: [0.95, 0.95, 0.95], output: [1] },
  { input: [0.7, 0.9, 0.6], output: [1] },
  { input: [0.9, 0.7, 0.7], output: [1] },
  { input: [0.9, 0.9, 0.4], output: [1] },

  // Edge Cases
  { input: [0.5, 0.5, 0.5], output: [0] },
  { input: [0.5, 0.7, 0.5], output: [1] },
];

const config = {
  log: true,
  logPeriod: 1,
  errorThresh: 0.02,
  iterations: 200,
  learningRate: 0.01,
};

network.train(trainingData, config);

// Middleware
app.use(cors());
app.use(express.json());

app.post("/classify", (req, res) => {
  const { r, g, b } = req.body;

  const result = network.run([r / 255, g / 255, b / 255]);
  const classification = result > 0.5 ? "Light" : "Dark";

  res
    .status(200)
    .send(
      `The color RGB (${r}, ${g}, ${b}) is classified as: ${classification}\n`
    );
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});

const testColors = [
  [0, 0, 0], // Black
  [0.1, 0.1, 0.1], // Dark Gray
  [0.9, 0.9, 0.9], // Light Gray
];

testColors.forEach((color) => {
  const result = network.run(color);
  const classification = result > 0.5 ? "Light" : "Dark";
  console.log(
    `RGB (${color[0] * 255}, ${color[1] * 255}, ${
      color[2] * 255
    }) is classified as: ${classification}`
  );
});
