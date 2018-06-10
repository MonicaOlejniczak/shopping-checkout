/* tslint:disable:no-console */
import { scenarios } from "./scenario-fixtures";

for (const scenario of scenarios) {
  const { actual, expected, products } = scenario.run();
  const skus = products.map((p) => p.sku).join(", ");
  console.log(`SKUs scanned: ${skus}`);
  console.log(`Total expected: ${expected}`);
  console.log(`Total received: ${actual}`);
  console.log();
}
