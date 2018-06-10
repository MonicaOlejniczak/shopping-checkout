import { BigNumber } from "bignumber.js";
import { Product } from "../product";
import { LineItem } from "./line-item";
import { PriceRule } from "./price-rule";

/**
 * Represents a physical checkout at a store.
 */
export class Checkout {
  private items: Map<string, LineItem> = new Map();

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
    return Array.from(this.items.values());
  }

  /**
   * Scan an item at the checkout.
   *
   * @param {Product} item The product to be scanned.
   */
  public scan(item: Product) {
    const key = item.sku;
    const lineItem = this.items.get(key);
    const quantity = lineItem ? lineItem.quantity + 1 : 1;

    this.items.set(key, new LineItem({ product: item, quantity }));
  }

  /**
   * Calculate the total cost of the scanned items with all of the applied price rules.
   *
   * @returns {string} The total cost of the scanned items.
   */
  public total(): string {
    return this.lineItems
      .reduce((accPrice, lineItem) => accPrice.plus(this.getPrice(lineItem)), new BigNumber(0))
      .decimalPlaces(2)
      .toString();
  }

  private getPrice(lineItem: LineItem) {
    const rules = this.getEntitledPriceRules(lineItem);
    // Apply the eligible price rules to the current line item.
    return rules.reduce((price: BigNumber, rule: PriceRule) => {
      switch (rule.valueType) {
        case "fixed_offset":
          // Apply the offset to the current price.
          return price.plus(rule.value);
        case "fixed_price":
          // Replace the current price with the fixed price for all products in the line item.
          return rule.value.times(lineItem.quantity);
        default:
          throw new Error(`Unsupported rule valueType: ${rule.valueType}`);
      }
    }, lineItem.linePrice);
  }

  private getEntitledPriceRules(lineItem: LineItem) {
    return this.priceRules.filter((rule) => {
      return rule.entitledSkus.includes(lineItem.product.sku)
        && rule.prerequisites.every((pre) => pre(this.items));
    });
  }
}
