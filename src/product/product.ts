import { BigNumber } from "bignumber.js";

export type ProductOpts = {
  sku: string;
  name: string;
  price: BigNumber;
};

/**
 * A product represents an item in the store catalogue.
 */
export class Product {
  public readonly name: string;
  public readonly price: BigNumber;
  public readonly sku: string;

  /**
   * Create a product.
   *
   * @param {ProductOpts} opts The options that define a product.
   * @param {string} opts.name The name of the product.
   * @param {BigNumber} opts.price The cost of the product. The value must be positive.
   * @param {string} opts.sku The product identification code.
   */
  constructor(private opts: ProductOpts) {
    const { name, price, sku } = this.opts;
    if (price.isLessThan("0")) {
      throw new Error("Product price cannot be negative");
    }

    if (price.isEqualTo("0")) {
      throw new Error("Product price cannot be free");
    }

    this.name = name;
    this.price = price;
    this.sku = sku;
  }
}
