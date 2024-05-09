import AWS from "aws-sdk";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const dynamodb = new AWS.DynamoDB.DocumentClient();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const login = async (event) => {
  try {
    const { email, password } = JSON.parse(event.body);

    // Find the user by email
    const user = await findUserByEmail(email);
    if (!user) {
      return {
        statusCode: 401,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "User not found" })
      };
    }

    const passwordIsValid = await validatePassword(password, user.password);
    if (!passwordIsValid) {
      return {
        statusCode: 401,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Incorrect password!" })
      };
    }

    const token = createJWT({ id: user.id, email: user.email })

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: user.id,
        email: user.email,
        token: token,
      }),
    };

  } catch (error) {
    console.error("Login error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Login error." })
    };
  }
};

// === Helpers ===

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

export default login;