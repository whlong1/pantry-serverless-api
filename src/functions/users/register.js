import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import { hashPassword, createJWT, findUserByEmail } from "../helpers/authHelpers";

const dynamodb = new AWS.DynamoDB.DocumentClient();

// MERN Stack original:
// https://github.com/whlong1/hoot-api/blob/main/controllers/auth.js

const register = async (event) => {
  try {
    const id = uuidv4();
    const createdAt = new Date().toISOString();
    const { email, password } = JSON.parse(event.body);
    const hashedPassword = await hashPassword(password);

    // Check for existing account with provided email
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return {
        statusCode: 409,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Account already exists!" })
      };
    }

    const newUser = {
      id,
      email,
      password: hashedPassword,
      createdAt,
    };

    await dynamodb.put({ TableName: "UserTable", Item: newUser }).promise();

    const token = createJWT({ id, email })

    return {
      statusCode: 201,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: newUser.id,
        email: newUser.email,
        token: token,
      }),
    };

  } catch (error) {
    console.error("Registration error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Problem with registration." })
    };
  }
};

export default register;