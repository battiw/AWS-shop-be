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
    const dnlResultProducts = await client.query(`
    insert into products ( title, description, price) values
    ('Poland', 'Poland', 999) returning id`);

    const createProId = dnlResultProducts.rows[0].id;

    const dnlResultStocks = await client.query(`
    insert into stocks (product_id, count) values
    ('${createProId}', 6) `);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        dnlResultStocks,
      }),
    };
  } catch (err) {
    console.error("ErRoR", err);
  } finally {
    client.end();
  }
};
