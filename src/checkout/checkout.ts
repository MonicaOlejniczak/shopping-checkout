import { BigNumber } from "bignumber.js";
import { Product } from "../product";
import { LineItem } from "./line-item";
import { PriceRule } from "./price-rule";

/**
 * Represents a physical checkout at a store.
 */
export class Checkout {
  /**
   * Create a checkout.
   *
   * @param {PriceRule[]} [priceRules=[]] The list of price rules available during checkout.
   */
  constructor(private priceRules: PriceRule[] = []) {}

  /**
   * Retrieve the scanned line items in the checkout.
   *
   * @returns {ReadonlyArray<LineItem>} The scanned line items in the checkout.
   */
  public get lineItems(): ReadonlyArray<LineItem> {
    return [];
  }

  /**
   * Scan an item at the checkout.
   *
   * @param {Product} item The product to be scanned.
   */
  public scan(item: Product) {}

  /**
   * Calculate the total cost of the scanned items with all of the applied price rules.
   *
   * @returns {string} The total cost of the scanned items.
   */
  public total(): string {
    return new BigNumber(0)
      .decimalPlaces(2)
      .toString();
  }
}
