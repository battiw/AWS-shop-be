"use strict";

import pkg from "pg";
const { Client } = pkg;

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;

const dbOptions = {
  host: PG_HOST,
  port: PG_PORT,
  database: PG_DATABASE,
  user: PG_USERNAME,
  password: PG_PASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 5000,
};

export const catalogBatchProcess = async (event) => {
  const client = new Client(dbOptions);
  await client.connect();

  const dataMessageQueue = await event.Records.map(({ body }) => body);

  console.log(`1 ===>>> ${dataMessageQueue}`);
  console.log(`2 ===>>> ${JSON.parse(dataMessageQueue)}`);

  try {
    // const bodyPost = await JSON.parse(event.body);
    for (let dataMes of dataMessageQueue) {
      const { price, title, description, count } = JSON.parse(dataMes);
      console.log(
        `Incoming request. 
      TITLE = ${title}, 
      DESCRIPTION = ${description}, 
      PRICE = ${price}, 
      COUNT = ${count}`
      );
      await client.query("BEGIN");

      const dnlResultProducts = await client.query(`
    insert into products ( title, description, price) values
    ('${title}', '${description}', '${price}') returning id`);
      const createProId = dnlResultProducts.rows[0].id;

      console.log(dnlResultProducts);

      const dnlResultStocks = await client.query(`
    insert into stocks (product_id, count) values
    ('${createProId}', '${count}') `);

      await client.query("COMMIT");

      return {
        statusCode: 201,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
          "Content-Type": "application/JSON",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        },
        body: JSON.stringify(dataMessageQueue),

        isBase64Encoded: false,
      };
    }
    console.log("11111111111");

    // const { title, description, price, count } = JSON.parse(dataMessageQueue);
    console.log("2222222222222");
  } catch (err) {
    await client.query("ROLLBACK");

    console.error("ErRoR1", err);

    if (err.name === "SyntaxError" || err.code === "22P02") {
      console.log("ErRoR SyntaxError: ", err.code);
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({ message: "Product data is invalid" }),

        isBase64Encoded: false,
      };
    } else {
      console.log("ErRoR status 500: ", err);
      return {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({
          message: "Unhandled error",
        }),
      };
    }
  } finally {
    client.end();
  }
};
