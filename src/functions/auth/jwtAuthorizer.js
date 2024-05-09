
import jwt from "jsonwebtoken";

// Serverless Reference
// https://github.com/tmaximini/serverless-jwt-authorizer/blob/master/functions/authorize.js

// Original
// https://github.com/whlong1/hoot-api/blob/main/middleware/auth.js

// const jwt = require("jsonwebtoken"); // used to create, sign, and verify tokens
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const generateAuthResponse = (principalId, effect, methodArn) => {
  const policyDocument = generatePolicyDocument(effect, methodArn);
  // const policy = generatePolicy(decoded.id, "Allow", event.methodArn);
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
  // try {
  const methodArn = event.routeArn
  const tokenHeader = event.headers.authorization
  const token = tokenHeader.replace("Bearer ", "");

  console.log("EVENT", event)

  if (!token || !methodArn) return callback(null, "Unauthorized");
  // if (!tokenHeader) return callback(null, generateAuthResponse('user', 'Deny', event.methodArn));

  console.log("token:::::::::::::::::::::::::", token);

  const decoded = jwt.verify(token, JWT_SECRET_KEY);
  console.log("DECODED", decoded);

  console.log("CALLBACK FN======", callback)
  // return callback(null, generateAuthResponse(decoded.id, "Allow", event.methodArn));

  if (decoded && decoded.id) {
    return callback(null, generateAuthResponse(decoded.id, "Allow", methodArn));
    
  } else {
    return callback(null, generateAuthResponse(decoded.id, "Deny", methodArn));
  }
  // } catch (e) {
  //   console.log("Verification error:", e);
  //   return callback(null, generateAuthResponse('user', 'Deny', event.methodArn));

  // return {
  //   statusCode: 500,
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ message: "Failed to retrieve todos" }),
  // };
  // }
};



export default verifyToken


// const verifyToken = (event, context, callback) => {
//   console.log("event",event)
//   console.log("context", context)
//   console.log("callback", callback)
//   const token = event.authorizationToken.replace("Bearer ", "");
//   const methodArn = event.methodArn;

//   if (!token || !methodArn) return callback(null, "Unauthorized");

//   // const secret = Buffer.from(JWT_SECRET_KEY, "base64");

//   // verifies token
//   // const decoded = jwt.verify(token, secret);

//   const decoded = jwt.verify(token, JWT_SECRET_KEY);

//   if (decoded && decoded.id) {
//     return callback(null, generateAuthResponse(decoded.id, "Allow", methodArn));
//   } else {
//     return callback(null, generateAuthResponse(decoded.id, "Deny", methodArn));
//   }
// // };
