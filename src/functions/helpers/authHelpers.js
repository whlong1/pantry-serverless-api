import AWS from "aws-sdk";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const dynamodb = new AWS.DynamoDB.DocumentClient();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const validatePassword = async(submittedPassword, passwordFromDb) => {
  return await bcrypt.compare(submittedPassword, passwordFromDb);
};

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
}

export {
  createJWT,
  hashPassword,
  findUserByEmail,
  validatePassword,
}