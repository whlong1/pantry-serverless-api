// Express API Original
// https://github.com/whlong1/hoot-api/blob/main/middleware/auth.js

// Serverless guide:
// https://dev.to/tmaximini/jwt-authorization-for-serverless-apis-on-aws-lambda-31h9

// Serverless docs:
// https://www.serverless.com/framework/docs/providers/aws/events/apigateway#http-endpoints-with-custom-authorizers

// HTTP API Custom Authorizer Issue:
// https://github.com/dherault/serverless-offline/issues/1624

import jwt from "jsonwebtoken";
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const generateAuthResponse = (principalId, effect, methodArn) => {
  const policyDocument = generatePolicyDocument(effect, methodArn);
  return {
    principalId,
    policyDocument,
    context: {
      userId: principalId
    }
  };
};

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
};

const verifyToken = (event, context, callback) => {
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

export default verifyToken;