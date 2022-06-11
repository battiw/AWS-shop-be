"use strict";

import productList from "./product.js";

export const getProductsById = async (event) => {
  const idProduct = event.pathParameters.productId;

  const product = productList.find((item) => item.id === idProduct);

  if (product) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        product,
      }),
    };
  } else {
    return {
      statusCode: 201,
      body: JSON.stringify({
        idProduct,
      }),
    };
  }
};
