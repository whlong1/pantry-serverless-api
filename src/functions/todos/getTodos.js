import AWS from "aws-sdk";

const getTodos = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  try {
    const results = await dynamodb.scan({ TableName: "TodoTable" }).promise();
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(results),
    };
  } catch (error) {
    console.error("DynamoDB Error:", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Failed to retrieve todos" }),
    };
  }
};

export default getTodos;
