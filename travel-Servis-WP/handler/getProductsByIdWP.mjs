"use strict";

import productList from "./product.mjs";

export const getProductsByIdWP = async (event) => {
  const idProduct = event.pathParameters.productId;

  const product = productList.find((item) => item.id === idProduct);

  if (product) {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },

      body: JSON.stringify({
        product,
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
