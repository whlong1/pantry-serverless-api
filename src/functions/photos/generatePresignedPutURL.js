import { v4 as uuidv4 } from "uuid";
import s3Client from '../../aws/s3Client.js'
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";

const generatePresignedPutURL = async (event) => {
  try {
    const { name, type, size } = JSON.parse(event.body);

    // Photo details:
    const photoId = uuidv4();
    const objectKey = `${photoId}-temp`;

    // PutObjectCommand: used to generate a pre-signed URL for uploading:
    const putCommand = new PutObjectCommand({
      Key: objectKey,
      ContentType: type,
      Bucket: process.env.BUCKET_NAME,
    });

    // GetObjectCommand: used to generate a pre-signed URL for viewing.
    const getCommand = new GetObjectCommand({
      Key: objectKey,
      Bucket: process.env.BUCKET_NAME,
    });

    // Generate pre-signed URL for PUT request:
    const putUrl = await getSignedUrl(s3Client, putCommand, {
      expiresIn: 600,
    });

    // Generate pre-signed URL for GET request
    const getUrl = await getSignedUrl(s3Client, getCommand, { expiresIn: 600 });

    return {
      statusCode: 201,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        photoId,
        putUrl,
        getUrl,
      }),
    };
  } catch (error) {
    console.log("Error generating URL:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ message: "Error generating URL" }),
    };
  }
};

export default generatePresignedPutURL;