import { Checkout } from "./checkout";
import { Product } from "./product";

export type ScenarioOpts = {
  checkout: Checkout;
  products: Product[];
  total: string;
};

export class Scenario {
  constructor(private opts: ScenarioOpts) {}

  public run() {
    const { checkout, products, total } = this.opts;
    for (const item of products) {
      checkout.scan(item);
    }
    const actual = checkout.total();
    return {
      actual,
      expected: total,
      products,
    };
  }
}
