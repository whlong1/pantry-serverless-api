import OpenAI from "openai";
import dynamodb from "../../db/dynamodbClient.js";
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
    console.log("Image URL", imageUrl)

    // Generate food analysis JSON:
    const analysisContent = await analyzeImage(imageUrl);
    console.log("OpenAI Analysis:", analysisContent);

    // Parse JSON:
    const foodData = JSON.parse(analysisContent);
    // Add userId for lookups:
    foodData.userId = event.requestContext.authorizer.userId;
    // Add to database:
    const newFoodItem = await dynamodb.create("FoodTable", foodData);
    console.log("New Food Item:", newFoodItem);
    // Custom .create() method returns { id, createdAt, ...data }

    return {
      statusCode: 201,
      headers: headers,
      body: JSON.stringify(newFoodItem),
    };
  } catch (error) {
    console.error("Error:", error.message);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
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
