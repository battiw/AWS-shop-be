import { sum } from "../sum.mjs";
import { productsL } from "../handler/product.mjs";
import { getProducts } from "../handler/getProductsListWP.mjs";
import { idProducts } from "../handler/getProductsByIdWP.mjs";

test("adds 1 + 2 to equal 3", () => {
  expect(sum(1, 2)).toBe(3);
});

test("all products", () => {
  expect(getProducts).toBe(productsL);
});

test("return status code 200", async () => {
  let aaa = await getProducts();

  expect(aaa.statusCode).toBe(200);
});

// test(" products ID ", () => {
//   let num = {
//     pathParameters: {
//       productId: { id: "7567ec4b-b10c-48c5-9345-fc73c48a80aa" },
//     },
//   };
//   expect(idProducts(num)).toBe(productsL[0]);
// });
