import dynamodb from "../../db/dynamodbClient";

// Reference material on incrementing/decrementing:
// https://stackoverflow.com/questions/66308659/increment-the-value-if-it-exists-else-add-a-new-entry-in-dynamodb/66308829#66308829
// https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.UpdateExpressions.html#Expressions.UpdateExpressions.ADD.Number

const updateFood = async (event) => {
  try {
    const { foodId } = event.pathParameters;
    const expressionAttributes = { ":num": 1, ":initial": 0 };
    const updateExpression = "SET estimatedNumberOfServing = if_not_exists(estimatedNumberOfServing, :initial) - :num";

    const res = await dynamodb.update(
      "FoodTable",
      foodId,
      updateExpression,
      expressionAttributes
    );

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(res),
    };
  } catch (error) {
    console.error("DynamoDB Error:", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Failed to update food" }),
    };
  }
};

export default updateFood;
