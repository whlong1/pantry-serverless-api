// MERN Stack original:
// https://github.com/whlong1/hoot-api/blob/main/controllers/auth.js

import AWS from "aws-sdk";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

const dynamodb = new AWS.DynamoDB.DocumentClient();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

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
        headers: headers,
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

    const token = createJWT({ id, email });

    return {
      statusCode: 201,
      headers: headers,
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
      headers: headers,
      body: JSON.stringify({ message: "Problem with registration." })
    };
  }
};

// === Helpers ===

const createJWT = (userData) => {
  return jwt.sign(userData, JWT_SECRET_KEY, { expiresIn: '24h' });
};

const findUserByEmail = async (email) => {
  try {
    const result = await dynamodb.query({
      TableName: "UserTable",
      IndexName: "EmailIndex",
      KeyConditionExpression: "email = :email",
      ExpressionAttributeValues: { ":email": email }
    }).promise();

    if (result.Items.length > 0) {
      return result.Items[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error:", error);
    throw new Error("Failed to retrieve user data");
  }
};

// https://www.npmjs.com/package/bcryptjs
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export default register;