import OpenAI from "openai";
import dynamodb from "../../db/dynamodbClient.js";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const dataStructurePrompt = `
The details of the recipe should be returned in JSON format, adhering to the schema defined below using TypeScript:
  interface RecipeStep {
    step: number;
    content: string;
  }

  interface Recipe {
    name: string;
    description: string;
    steps: RecipeStep[];
    ingredients: string[];
    estimatedCookingTimeInMinutes: number;
    difficultyLevel: 'Easy' | 'Medium' | 'Hard';
  }
`;

const createRecipe = async (event) => {
  try {
    const { recipeCategory } = JSON.parse(event.body);
    const { userId } = event.requestContext.authorizer;

    const foodQueryResults = await dynamodb.queryByGSI(
      "FoodTable",
      "UserIdIndex",
      "userId",
      userId
    );

    const ingredients = foodQueryResults.Items
      .filter((item) => item.isIngredient)
      .map((item) => item.name)
      .join(", ");

    const dynamicPrompt = `Please generate a ${recipeCategory} recipe using only ingredients from the following list: ${ingredients}.`;
    const recipePrompt = dynamicPrompt + dataStructurePrompt;

    const recipeJSON = await generateRecipe(recipePrompt);
    const recipeObject = JSON.parse(recipeJSON);

    const { id, createdAt } = await dynamodb.create(
      "RecipeTable",
      recipeObject,
    );

    return {
      statusCode: 201,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({id, createdAt, ...recipeObject }),
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

const generateRecipe = async (prompt) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [
      { role: "system", content: "Please output valid JSON" },
      {
        role: "user",
        content: [{ type: "text", text: prompt }],
      },
    ],
    temperature: 0.2,
    response_format: { type: "json_object" },
  });
  return response.choices[0].message.content;
};

export default createRecipe;