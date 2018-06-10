import { BigNumber } from "bignumber.js";
import { LineItem } from "./line-item";

export type PriceRulePrerequisite = (lineItems: Map<string, LineItem>) => boolean;
export type PriceRuleValueType = "fixed_offset" | "fixed_price";

export type PriceRuleOpts = {
  entitledSkus: string[];
  name: string;
  prerequisites: PriceRulePrerequisite[];
  value: BigNumber;
  valueType: PriceRuleValueType;
};

/**
 * A price rule offers select products at a different price based on a set of prerequisites.
 */
export class PriceRule {
  public readonly entitledSkus: ReadonlyArray<string>;
  public readonly name: string;
  public readonly prerequisites: ReadonlyArray<PriceRulePrerequisite>;
  public readonly value: BigNumber;
  public readonly valueType: PriceRuleValueType;

  /**
   * Create a price rule.
   *
   * @param {PriceRuleOpts} opts The options that define a price rule.
   * @param {string[]} opts.entitledSkus The list of product ids that are eligible for the price rule.
   * @param {string} opts.name The name of the price rule.
   * @param {PriceRulePrerequisite[]} opts.prerequisites The set of conditions that must be met before the price rule
   * can be applied.
   * @param {BigNumber} opts.value The value of the price rule, which represents either a discount or markup in price.
   * @param {PriceRuleValueType} opts.valueType The type of discount or markup applied to a price. This can be one of:
   *
   *  fixed_offset: Adds the value of the price rule to the final price. e.g. if value is -10, then 10 is deducted from
   *  the final price.
   *
   *  fixed_price: Sets the price of the item to the value specified in the price rule. e.g. if a product costs 30 and
   *  the price rule value is 20 then the final price of the product becomes 20.
   */
  constructor(private opts: PriceRuleOpts) {
    this.entitledSkus = opts.entitledSkus;
    this.name = opts.name;
    this.prerequisites = opts.prerequisites;
    this.value = opts.value;
    this.valueType = opts.valueType;
  }
}
