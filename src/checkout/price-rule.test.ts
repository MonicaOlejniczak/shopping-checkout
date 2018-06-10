import { BigNumber } from "bignumber.js";
import { PriceRule, PriceRuleOpts } from "./price-rule";

describe("PriceRule", () => {
  it("stores the price rule values", () => {
    const opts: PriceRuleOpts = {
      entitledSkus: ["a", "b", "c"],
      name: "Custom price rule",
      prerequisites: [],
      value: new BigNumber("-100"),
      valueType: "fixed_offset",
    };
    expect(new PriceRule(opts)).toMatchObject(opts);
  });
});
