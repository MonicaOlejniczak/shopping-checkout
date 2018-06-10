import { BigNumber } from "bignumber.js";
import { Product } from "./product";

describe("Product", () => {
  const productDefaults = {
    name: "Super iPad",
    sku: "ipd",
  };

  it("does not allow a negative price", () => {
    const price = new BigNumber("-1");
    expect(() => new Product({ ...productDefaults, price })).toThrow("Product price cannot be negative");
  });

  it("does not allow a free item", () => {
    const price = new BigNumber("0");
    expect(() => new Product({ ...productDefaults, price })).toThrow("Product price cannot be free");
  });

  it("stores and retrieves the product information", () => {
    const price = new BigNumber("549.99");
    const product = new Product({ ...productDefaults, price });
    expect(product).toMatchObject({ name: productDefaults.name, price, sku: productDefaults.sku });
  });
});
