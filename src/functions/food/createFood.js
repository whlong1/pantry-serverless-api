import AWS from "aws-sdk";
import OpenAI from "openai";
import { v4 } from "uuid";
import imageAnalysisPrompt from "./prompts/imageAnalysisPrompt.js";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

const createFood = async (event) => {
  try {
    const { imageUrl } = JSON.parse(event.body);
    if (!imageUrl) throw new Error("Please provide a valid image URL.");

    // Generate food analysis JSON:
    const analysisContent = await analyzeImage(imageUrl);

    // Handle resource created using JSON:
    const dynamodb = new AWS.DynamoDB.DocumentClient();
    const id = v4();
    const createdAt = new Date().toISOString();
    const userId = event.requestContext.authorizer.userId;

    const newFoodItem = JSON.parse(analysisContent);
    newFoodItem.id = id;
    newFoodItem.userId = userId;
    newFoodItem.createdAt = createdAt;

    await dynamodb
      .put({
        TableName: "FoodTable",
        Item: newFoodItem,
      })
      .promise();

    return {
      statusCode: 201,
      headers: headers,
      body: JSON.stringify(newFoodItem),
    };
  } catch (error) {
    console.error("Error:", error.message);
    return {
      statusCode: 500,
      headers: headers,
      body: JSON.stringify({ message: error.message }),
    };
  }
};

const analyzeImage = async (imageUrl) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [
      { role: "system", content: "Please output valid JSON" },
      {
        role: "user",
        content: [
          { type: "text", text: imageAnalysisPrompt },
          { type: "image_url", image_url: { url: imageUrl } },
        ],
      },
    ],
    temperature: 0.2,
    response_format: { type: "json_object" },
  });
  return response.choices[0].message.content;
};

export default createFood;