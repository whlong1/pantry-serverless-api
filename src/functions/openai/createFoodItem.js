import AWS from "aws-sdk";
import OpenAI from "openai";
import { v4 } from "uuid";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const imageUrl =
  "https://images.pexels.com/photos/1927377/pexels-photo-1927377.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

const imageAnalysisPrompt = `
  Please analyze the food item in the provided photo. 
  The details of the identified food item should be returned in JSON format, adhering to the schema defined below using TypeScript:
  
  enum FoodCategory {
    Grains = "grains",
    MilkAndMilkProducts = "milk and milk products",
    FruitsAndProducts = "fruit and fruit products",
    Eggs = "eggs",
    MeatAndPoultry = "meat and poultry",
    FishAndShellfish = "fish and shellfish",
    Vegetables = "vegetables",
    FatsAndOils = "fats and oils",
    LegumesNutsSeeds = "legumes, nuts, seeds",
    SugarAndProducts = "sugar and sugar products",
    NonAlcoholicBeverages = "non-alcoholic beverages",
    AlcoholicBeverages = "alcoholic beverages"
  }
  
  enum StorageCondition {
    Refrigerated = "Refrigerated",
    Frozen = "Frozen",
    Pantry = "Pantry",
    RoomTemperature = "Room Temperature"
  }
  
  enum Allergen {
    Gluten = "gluten",
    Peanuts = "peanuts",
    TreeNuts = "tree nuts",
    Dairy = "dairy",
    Eggs = "egg",
    Soy = "soy",
    Fish = "fish",
    Shellfish = "shellfish",
    Wheat = "wheat",
    Sesame = "sesame",
    Mustard = "mustard",
    Celery = "celery",
    Sulphites = "sulphites",
    Molluscs = "molluscs",
    Corn = "corn",
  }
  
  interface Food {
    name: string;
    estimatedWeightInGrams: number;
    estimatedServingSizeInGrams: number;
    estimatedNumberOfServings: number;
    estimatedCaloriesPerServing: number;
    estimatedProteinGramsPerServing: number;
    estimatedCarbGramsPerServing: number;
    estimatedFatGramsPerServing: number;
    shelfLifeDays: number;
    category: FoodCategory;
    possibleAllergens: Allergen[]; 
    storage: StorageCondition;
    isCooked: boolean;
    isGMO: boolean;
    isOrganic: boolean;
    isGlutenFree: boolean;
    isVegan: boolean;
    isPreparationRequired: boolean;
    brand: string | 'Not Available';
    packagingType: 'Plastic' | 'Glass' | 'Paper' | 'Metal' | 'None';
    cuisineType: 'Italian' | 'Mexican' | 'Chinese' | 'Indian' | 'American' | 'Other';
    servingTemperature: 'Hot' | 'Cold' | 'Room' | 'Frozen';
  }  
`;

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

const createFoodItem = async (event) => {
  try {
    console.log("EVENT OBJECT", event);
    const userId = event.requestContext.authorizer.userId;

    // Generate food analysis JSON:
    // const analysisContent = await analyzeImage();
    // console.log("Analysis Content:", analysisContent);

    // Handle resource created using JSON:
    const dynamodb = new AWS.DynamoDB.DocumentClient();
    const createdAt = new Date().toISOString();
    const id = v4();

    const testContent =
      "{\n" +
      '  "name": "Raw Bacon",\n' +
      '  "estimatedWeightInGrams": 300,\n' +
      '  "estimatedServingSizeInGrams": 30,\n' +
      '  "estimatedNumberOfServings": 10,\n' +
      '  "estimatedCaloriesPerServing": 150,\n' +
      '  "estimatedProteinGramsPerServing": 10,\n' +
      '  "estimatedCarbGramsPerServing": 0,\n' +
      '  "estimatedFatGramsPerServing": 12,\n' +
      '  "shelfLifeDays": 14,\n' +
      '  "category": "MeatAndPoultry",\n' +
      '  "possibleAllergens": [], \n' +
      '  "storage": "Refrigerated",\n' +
      '  "isCooked": false,\n' +
      '  "isGMO": false,\n' +
      '  "isOrganic": false,\n' +
      '  "isGlutenFree": true,\n' +
      '  "isVegan": false,\n' +
      '  "isPreparationRequired": true,\n' +
      '  "brand": "Not Available",\n' +
      '  "packagingType": "None",\n' +
      '  "cuisineType": "Other",\n' +
      '  "servingTemperature": "Room"\n' +
      "}";

    const newFoodItem = JSON.parse(testContent);
    newFoodItem.id = id;
    newFoodItem.createdAt = createdAt;
    // look at shelfLife and compare to createdAt
    // mark it with an expirationDate
    // query by soon to expire
    // what to do with user id?
    // photo submit

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
    console.error("Error:", error);
    return {
      statusCode: 500,
      headers: headers,
      body: JSON.stringify({ message: "Something went wrong." }),
    };
  }
};

const analyzeImage = async () => {
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

export default createFoodItem;
