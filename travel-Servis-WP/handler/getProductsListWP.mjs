"use strict";

import productList from "./product.mjs";

export const getProductsListWP = async (event) => {
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
};
