// import AWS from "aws-sdk";
import dynamodb from "../../db/dynamodbClient.js";

const getFoodByUserId = async (event) => {
  // const dynamodb = new AWS.DynamoDB.DocumentClient();
  
  try {
    
    const { userId } = event.requestContext.authorizer;
    // const queryKey = "userId";
    // const queryValue = email;
    const res = await dynamodb.queryByGSI("FoodTable", "UserIdIndex", "userId", userId)


    console.log("RESSSSS",res)

    // const result = await dynamodb.get({
    //   TableName: "FoodTable",
    //   // Key: { userId }
    // }).promise();


    // const params = {
    //   TableName: 
    // }
    // const res = await dynamodb.query(params).promise()

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({message: "ok"}),
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
