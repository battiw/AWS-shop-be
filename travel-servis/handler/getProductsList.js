"use strict";

import productList from "./product.js";

export const getProductsList = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      productList,
    }),
  };
};
