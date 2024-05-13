// HTTP SERVERLESS SOURCE:
// https://dev.to/tmaximini/jwt-authorization-for-serverless-apis-on-aws-lambda-31h9

// Express API Original
// https://github.com/whlong1/hoot-api/blob/main/middleware/auth.js

// Serverless docs:
// https://www.serverless.com/framework/docs/providers/aws/events/apigateway#http-endpoints-with-custom-authorizers

// HTTP API Custom Authorizer Issue:
// https://github.com/dherault/serverless-offline/issues/1624

// Authorizer Output Documentation:
// https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-lambda-authorizer-output.html

// Helpful breakdown on the use of policies here:
// https://www.youtube.com/watch?v=2W-dd-3m5u8&ab_channel=CompleteCoding-MasterAWSServerless

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
        Resource: "*"
        // Specifying methodArn causing occasional 403 status on deploy:
        // Resource: methodArn 
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
    console.log("Allowed:", methodArn)
    return callback(null, generateAuthResponse(decoded.id, "Allow", methodArn));

  } else {
    return callback(null, generateAuthResponse(decoded.id, "Deny", methodArn));
  }
};

export default verifyToken;