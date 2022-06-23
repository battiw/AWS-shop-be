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

export const postProducts = async (event) => {
  const client = new Client(dbOptions);
  await client.connect();

  try {
    const bodyPost = await JSON.parse(event.body);

    const { title, description, price, count } = bodyPost;

    console.log(
      `Incoming request. TITLE = ${title}, DESCRIPTION = ${description}, PRICE = ${price}, COUNT = ${count}`
    );

    if (typeof title == "number")
      throw "Invalid input type. TITLE must be a string, not a number";
    if (title == null) throw "Invalid input type.";
    if (title === "") throw "Invalid input. Enter data";
    if (typeof description == "number")
      throw "Invalid input type. DESCRIPTION must be a string, not a number";
    if (description == null) throw "Invalid input type.";
    if (description === "") throw "Invalid input. Enter data";
    if (typeof price == "string")
      throw "Invalid input type. PRICE must be a number, not a string";
    if (price == null) throw "Invalid input type.";
    if (price === 0) throw "Invalid input. Enter data";
    if (typeof count == "string")
      throw "Invalid input type. COUNT must be a number, not a string";
    if (count == null) throw "Invalid input type.";
    if (count === 0) throw "Invalid input. Enter data";

    await client.query("BEGIN");

    const dnlResultProducts = await client.query(`
    insert into products ( title, description, price) values
    ('${title}', '${description}', '${price}') returning id`);
    const createProId = dnlResultProducts.rows[0].id;

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
      body: JSON.stringify(bodyPost),

      isBase64Encoded: false,
    };
  } catch (err) {
    await client.query("ROLLBACK");

    console.error("ErRoR", err);

    if (err) {
      return {
        statusCode: 401,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
          "Content-Type": "application/JSON",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        },
        body: err,

        isBase64Encoded: false,
      };
    } else {
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
