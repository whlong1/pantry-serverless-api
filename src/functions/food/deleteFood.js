import AWS from "aws-sdk";

const deleteFood = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  const { foodId } = event.pathParameters;

  try {
    await dynamodb.delete({
      TableName: "FoodTable",
      Key: { id: foodId }
    }).promise();

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Food deleted." }),
    };
  } catch (error) {
    console.error("DynamoDB Error:", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Problem deleting food" }),
    };
  }
};

export default deleteFood;