import { v4 } from 'uuid';
import AWS from "aws-sdk";

// event in this case is a request
const addTodo = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient()

  const { todo } = JSON.parse(event.body);
  const createdAt = new Date().toISOString();
  const id = v4();

  const newTodo = {
    id,
    todo,
    createdAt,
    completed: false
  }

  await dynamodb.put({
    TableName: "TodoTable",
    Item: newTodo
  }).promise()

  return {
    statusCode: 201,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newTodo),
  };
};

export default addTodo