import { BigNumber } from "bignumber.js";
import { Product } from "../product";
import { LineItem } from "./line-item";

describe("LineItem", () => {
  const product = new Product({
    name: "Super iPad",
    price: new BigNumber("549.99"),
    sku: "ipd",
  });

  it("does not allow a negative quantity", () => {
    expect(() => new LineItem({ product, quantity: -1 })).toThrow("Quantity cannot be negative");
  });

  it("stores the product and quantity in the line", () => {
    const lineItem = new LineItem({ product, quantity: 1 });
    expect(lineItem).toMatchObject({ product, quantity: 1 });
  });

  it("calculates the line price based on the product price and quantity", () => {
    const lineItem = new LineItem({ product, quantity: 3 });
    expect(lineItem.linePrice).toEqual(new BigNumber("1649.97"));
  });
});
