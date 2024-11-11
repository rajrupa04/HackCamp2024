// const { GoogleGenerativeAI } = require("@google/generative-ai");
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import express from "express";
const app = express();
app.use(express.json());

app.use(cors())

console.log(GoogleGenerativeAI);

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({model : "gemini-1.5-flash"});
const dragActionsSummary = "Placed 'solar panel array' near 'public transport hub', connected 'rainwater harvesting system' to 'recreational area', optimized layout for aesthetics over energy flow.";
const textResponse = "I wanted the layout to prioritize green spaces and accessibility. I placed renewable resources close to public areas to encourage community interaction and awareness of sustainability.";

app.post('/save-game', async (req, res) => {
    const gameData = req.body;

    const actionsSummary = gameData.flows.map(flow => 
      `Placed a ${flow.color} flow from ${flow.start} to ${flow.end}. Path: ${flow.path.length} steps.`
    ).join(' ');


    // Now you don't have the long answer question anymore, but you can still use the game stats
    const { totalTime, totalMoves, correctMoves, incorrectMoves, completed } = gameData;

    const prompt = `
    The user has completed a puzzle with the following actions: ${actionsSummary}.
    Their game stats are as follows:
    - Total time spent: ${totalTime} seconds
    - Total moves: ${totalMoves}
    - Correct moves: ${correctMoves}
    - Incorrect moves: ${incorrectMoves}
    - Game completed: ${completed ? "Yes" : "No"}

    Based on their actions and game performance, classify the user’s learning style as one of the following:
    - **Analytical**: A methodical, logic-driven, and efficiency-focused mindset.
    - **Creative**: An imaginative, visually-focused, or experimental approach.
    - **Balanced**: If both analytical and creative traits are equally evident.

    Provide a well-structured paragraph summarizing the user’s learning style as either analytical, creative,
     or balanced. Describe why this classification was chosen, based on their actions and game performance, 
     and include targeted recommendations to support their learning style. Phrase the response as though you
     were talking to the user.`
     ;

    try {
        const result = await model.generateContent(prompt);
        const assessment = result.response.text();
        
        // Send the assessment back to the frontend
        console.log("before sending data back....")
        res.json({ assessment });
        console.log("LETS GOOOOOOOOOOOOO YOU'RE SO GOOD")
      } catch (error) {
        console.error("Error generating content:", error);
        res.status(500).json({ error: "Failed to assess game data." });
      }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});