import { scenarios } from "./scenario-fixtures";

describe("scenarios", () => {
  scenarios.map((scenario) => {
    const { actual, expected, products } = scenario.run();
    const skus = products.map((p) => p.sku).join(", ");
    return it(`scanning [${skus}] returns ${expected}`, () => {
      expect(actual).toBe(expected);
    });
  });
});
