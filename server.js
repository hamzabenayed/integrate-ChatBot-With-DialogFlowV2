const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/chatbot", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const InputSchema = new mongoose.Schema({
  input: String,
  response: String,
  timestamp: { type: Date, default: Date.now },
});

const Input = mongoose.model("Input", InputSchema);

// Endpoint to save unknown inputs
app.post("/save-input", async (req, res) => {
  try {
    const { input, response } = req.body;
    const newInput = new Input({ input, response });
    await newInput.save();
    res.status(200).send("Input saved");
  } catch (error) {
    res.status(500).send("Error saving input");
  }
});

// Endpoint to retrieve responses
app.get("/get-response/:input", async (req, res) => {
  try {
    const { input } = req.params;
    const result = await Input.findOne({ input });
    if (result) {
      res.status(200).json({ response: result.response });
    } else {
      res.status(404).send("No response found");
    }
  } catch (error) {
    res.status(500).send("Error retrieving response");
  }
});



app.listen(3000, () => console.log("Server running on port 3000"));



/*const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dialogflow = require("@google-cloud/dialogflow"); // Updated import
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose
  .connect("mongodb://localhost/chatbot", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Schema and Model
const UnrecognizedInputSchema = new mongoose.Schema({
  userInput: String,
  botResponse: String,
  timestamp: { type: Date, default: Date.now },
});
const UnrecognizedInput = mongoose.model(
  "UnrecognizedInput",
  UnrecognizedInputSchema
);

// Dialogflow setup
const projectId = "neural-engine-406110"; // Replace with your Dialogflow project ID
const keyFilename = "path/to/dialogflow-key.json"; // Replace with the path to your JSON key file

const intentsClient = new dialogflow.IntentsClient({ keyFilename });

// Endpoint to log unrecognized input
app.post("/log-unrecognized-input", async (req, res) => {
  const { userInput, botResponse } = req.body;
  console.log("Received request body:", req.body);

  const newEntry = new UnrecognizedInput({ userInput, botResponse });

  try {
    await newEntry.save();
    console.log("Data saved successfully");
    await addIntentToDialogflow(userInput);
    res.status(200).send("Input logged successfully");
  } catch (error) {
    console.error("Error during save operation:", error);
    res.status(500).send("Error logging input");
  }
});

// Endpoint to retrieve stored responses
app.post("/get-response", async (req, res) => {
  const { userInput } = req.body;
  console.log("Received request to get response for:", userInput);

  try {
    const entry = await UnrecognizedInput.findOne({ userInput }).exec();
    if (entry) {
      console.log("Found entry:", entry);
      res.status(200).json({ botResponse: entry.botResponse });
    } else {
      console.log("No entry found for:", userInput);
      res.status(404).json({ botResponse: null });
    }
  } catch (error) {
    console.error("Error retrieving response:", error);
    res.status(500).send("Error retrieving response");
  }
});

// Function to add a new intent to Dialogflow
const addIntentToDialogflow = async (trainingPhrase) => {
  const intent = {
    displayName: `Intent_${Date.now()}`,
    trainingPhrases: [{ type: "EXAMPLE", parts: [{ text: trainingPhrase }] }],
    messages: [{ text: { text: ["Response to the new input."] } }],
  };

  const request = {
    parent: `projects/${projectId}/agent`,
    intent: intent,
  };

  try {
    const [response] = await intentsClient.createIntent(request);
    console.log("Created intent:", response);
  } catch (error) {
    console.error("Error creating intent:", error);
  }
};

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});*/
