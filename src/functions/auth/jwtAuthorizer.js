import jwt from "jsonwebtoken";

// Serverless Reference
// https://github.com/tmaximini/serverless-jwt-authorizer/blob/master/functions/authorize.js

// Original
// https://github.com/whlong1/hoot-api/blob/main/middleware/auth.js

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const generateAuthResponse = (principalId, effect, methodArn) => {
  const policyDocument = generatePolicyDocument(effect, methodArn);
  console.log("Policy being returned:", JSON.stringify(policyDocument));
  return {
    principalId,
    policyDocument
  };
}

const generatePolicyDocument = (effect, methodArn) => {
  if (!effect || !methodArn) return null;

  const policyDocument = {
    Version: "2012-10-17",
    Statement: [
      {
        Action: "execute-api:Invoke",
        Effect: effect,
        Resource: methodArn
      }
    ]
  };
  return policyDocument;
}

const verifyToken = (event, context, callback) => {
  console.log("EVENT", event)
  const methodArn = event.methodArn
  const token = event.authorizationToken.replace("Bearer ", "");
  if (!token || !methodArn) return callback(null, "Unauthorized");
  const decoded = jwt.verify(token, JWT_SECRET_KEY);
  if (decoded && decoded.id) {
    return callback(null, generateAuthResponse(decoded.id, "Allow", methodArn));

  } else {
    return callback(null, generateAuthResponse(decoded.id, "Deny", methodArn));
  }
};

export default verifyToken