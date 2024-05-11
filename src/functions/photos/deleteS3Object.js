import s3Client from "../../aws/s3Client.js";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

const deleteS3Object = async (event) => {
  try {
    const { photoId } = event.pathParameters;

    const deleteCommand = new DeleteObjectCommand({
      Key: `${photoId}-temp`,
      Bucket: process.env.BUCKET_NAME,
    });
  
    await s3Client.send(deleteCommand);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({message: "Object deleted"}),
    };
  } catch (error) {
    console.log("Error removing object:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ message: "Failed to delete object" }),
    };
  }
};

export default deleteS3Object