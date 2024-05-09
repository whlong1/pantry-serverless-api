import AWS from "aws-sdk";

const deleteTodo = async (event) => {
  console.log("I RAAAAAAAAAAN============")
  console.log("delete event",event)
  
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  const { id } = event.pathParameters;

  try {

    await dynamodb.delete({
      TableName: "TodoTable",
      Key: { id: id }
    }).promise();

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Todo deleted." }),
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

export default deleteTodo;