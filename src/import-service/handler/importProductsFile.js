import AWS from "aws-sdk";

const BUCKET = "battiw-shop-be-task5";

export const importProductsFile = async (event) => {
  const s3 = new AWS.S3({ region: "us-east-1" });
  const { name } = event.queryStringParameters;
  const catalogPath = `uploaded/${name}`;
  console.log(`NaMe ===>>> ${name}`);
  const params = {
    Bucket: BUCKET,
    Key: catalogPath,
    Expires: 60,
    ContentType: "text/csv",
  };

  try {
    const signedURL = await new Promise((resolve, reject) => {
      return s3.getSignedUrl("putObject", params, (error, signedURL) => {
        if (error || !signedURL) {
          reject(error);
        }
        resolve(signedURL);
      });
    });

    console.log(`URL ====>>>>>> ${signedURL}`);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: signedURL,
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        message: `Invalid error!!!`,
      }),
    };
  }
};
