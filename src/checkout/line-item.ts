import { BigNumber } from "bignumber.js";
import { Product } from "../product";

export type LineItemOpts = {
  product: Product;
  quantity: number;
};

/**
 * A line item represents a single distinct set of products during checkout.
 */
export class LineItem {
  /**
   * The combined price of all the products in the line item.
   */
  public readonly linePrice: BigNumber;
  public readonly product: Product;
  public readonly quantity: number;

  /**
   * Create a line item.
   *
   * @param {LineItemOpts} opts The options that define a line item.
   * @param {Product} opts.product The distinct product in the line item.
   * @param {number} opts.quantity The amount of products in the line item. This value cannot be negative.
   */
  constructor(private opts: LineItemOpts) {
    const { product, quantity } = this.opts;
    if (quantity < 0) {
      throw new Error("Quantity cannot be negative");
    }

    this.linePrice = product.price.times(quantity);
    this.product = product;
    this.quantity = quantity;
  }
}
