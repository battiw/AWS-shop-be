"use strict";

import AWS from "aws-sdk";
import csv from "csv-parser";

export const importFileParser = async (event, context, callback) => {
  const s3 = new AWS.S3({ region: "eu-west-1" });
  const sqs = new AWS.SQS();

  try {
    for (const record of event.Records) {
      const BUCKET = record.s3.bucket.name;
      const key = record.s3.object.key;
      const results = [];

      const params = {
        Bucket: BUCKET,
        Key: key,
      };

      await new Promise((resolve, reject) => {
        s3.getObject(params)
          .createReadStream()
          .pipe(csv(["title", "description", "price", "count"]))
          // .on("data", (data) => results.push(data))
          .on("data", (data) => {
            sqs.sendMessage(
              {
                QueueUrl: process.env.SQS_URL,
                MessageBody: JSON.stringify(data),
              },
              (error) => {
                if (error) {
                  console.log(`ERROR SEMDING MESSAGE: ${error}`);
                } else {
                  console.log(`SEND MESSAGE FOR: ${JSON.stringify(data)}`);
                }
              }
            );

            callback(null, {
              statusCode: 200,
              headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
              },
            });
          })
          .on("end", async () => {
            // console.log(JSON.stringify(results));

            await s3
              .copyObject({
                Bucket: BUCKET,
                CopySource: `${BUCKET}/${key}`,
                Key: key.replace("uploaded", "parsed"),
              })
              .promise();

            console.log(`Copied to file on folder parsed.`);

            await s3
              .deleteObject({
                Bucket: BUCKET,
                Key: key,
              })
              .promise();

            console.log("File deleted");

            resolve(`OK`);
          });
      });
    }
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: null,
    };
  }
  console.log("kuku1");
};
