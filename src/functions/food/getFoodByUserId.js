import dynamodb from "../../db/dynamodbClient.js";

const getFoodByUserId = async (event) => {  
  try {
    const { userId } = event.requestContext.authorizer;
    const res = await dynamodb.queryByGSI("FoodTable", "UserIdIndex", "userId", userId)
    const foodItems = res.Items
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(foodItems),
    };
  } catch (error) {
    console.error("DynamoDB Error:", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Failed to retrieve food list" }),
    };
  }
};

export default getFoodByUserId;