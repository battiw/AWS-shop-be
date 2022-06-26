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

export const getProductsById = async (event) => {
  const client = new Client(dbOptions);
  await client.connect();

  console.log("Incoming request product ID: ", event);

  try {
    const idProduct = await event.pathParameters.productId;

    console.log("Incoming request product ID: ", idProduct);

    const { rows: productsConsole } = await client.query(
      `select id, price, count, title, description from products p left join stocks s on p.id = s.product_id where id in ('${idProduct}')`
    );

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        productsConsole,
      }),
    };
  } catch (err) {
    console.error("ErRoR", err);
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
  } finally {
    client.end();
  }
};
