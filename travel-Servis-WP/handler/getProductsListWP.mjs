"use strict";

import productList from "./product.mjs";

export const getProductsListWP = async (event) => {
  if (productList.length > 0) {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        productList,
      }),
    };
  } else {
    return {
      statusCode: 404,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ message: "Product not found" }),
    };
  }
};
