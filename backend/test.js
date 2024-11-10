// const { GoogleGenerativeAI } = require("@google/generative-ai");
import { GoogleGenerativeAI } from "@google/generative-ai";
import express from "express";
const app = express();
app.use(express.json());

console.log(GoogleGenerativeAI);

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({model : "gemini-1.5-flash"});
const dragActionsSummary = "Placed 'solar panel array' near 'public transport hub', connected 'rainwater harvesting system' to 'recreational area', optimized layout for aesthetics over energy flow.";
const textResponse = "I wanted the layout to prioritize green spaces and accessibility. I placed renewable resources close to public areas to encourage community interaction and awareness of sustainability.";

const prompt = `
  The user has completed a puzzle with the following actions: ${dragActionsSummary}.
  Their response to an open-ended question is: "${textResponse}".

  Assess the user’s approach and classify their learning style as one of the following:
  - **Analytical**: Indicates a methodical, logic-driven, and efficiency-focused mindset.
  - **Creative**: Indicates an imaginative, visually-focused, or experimental approach.
  - **Balanced**: Used only if the user's actions and response demonstrate an equal blend of analytical and creative traits. This should be rare and only applied when clear evidence of both styles is present.

  Based on your analysis, identify the user’s style as either analytical, creative, or, if strongly justified, balanced. Then, provide targeted learning recommendations.
`;

const result = await model.generateContent(prompt);
console.log(result.response.text());