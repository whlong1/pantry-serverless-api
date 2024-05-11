import AWS from "aws-sdk";
import { v4 } from "uuid";

const dynamodbDocumentClient = new AWS.DynamoDB.DocumentClient();

const dynamodb = {
  async create(tableName, data) {
    const id = v4();
    const createdAt = new Date().toISOString();
    data.id = id;
    data.createdAt = createdAt;
    await dynamodbDocumentClient
      .put({ TableName: tableName, Item: data })
      .promise();
    return { id, createdAt, ...data };
  },

  async findByIdAndDelete(tableName, id) {
    return await dynamodbDocumentClient
      .delete({
        TableName: "tableName",
        Key: { id: id },
      })
      .promise();
  },

  async update(tableName, id, updateExpression, expressionAttributes) {
    return await dynamodbDocumentClient
      .update({
        TableName: tableName,
        Key: { id },
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: expressionAttributes,
        ReturnValues: "ALL_NEW",
      })
      .promise();
  },

  async queryByGSI(tableName, indexName, queryKey, queryValue) {
    const result = await dynamodbDocumentClient
      .query({
        TableName: tableName,
        IndexName: indexName,
        KeyConditionExpression: `${queryKey} = :${queryKey}`,
        ExpressionAttributeValues: { [`:${queryKey}`]: queryValue },
      })
      .promise();
    return result;
  },
};

export default dynamodb;
