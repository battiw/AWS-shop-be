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

export const getProductsList = async (event) => {
  const client = new Client(dbOptions);
  await client.connect();

  try {
    const ddlResult1 = await client.query(`
      create table if not exists products (
        id uuid primary key default uuid_generate_v4(),
        title text, 
        description text,
        price integer
      )`);
    const ddlResult2 = await client.query(`
      create table if not exists stocks (
          product_id uuid,
          count integer,
          foreign key ("product_id") references "products" ("id")
      )`);
    // const dnlResult1 = await client.query(`
    // insert into products ( title, description, price) values
    // ( 'Voucher 001 - Benin', 'Benin', 999 )`);

    const { rows: productsConsole } = await client.query(
      `select * from products`
    );
    console.log(productsConsole);
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
