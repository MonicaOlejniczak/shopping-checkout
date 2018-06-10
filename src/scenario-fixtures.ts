import { BigNumber } from "bignumber.js";
import { Checkout, PriceRule } from "./checkout";
import { Product } from "./product";
import { Scenario } from "./scenario";

const ipd = new Product({
  name: "Super iPad",
  price: new BigNumber("549.99"),
  sku: "ipd",
});

const mbp = new Product({
  name: "MacBook Pro",
  price: new BigNumber("1399.99"),
  sku: "mbp",
});

const atv = new Product({
  name: "Apple TV",
  price: new BigNumber("109.50"),
  sku: "atv",
});

const vga = new Product({
  name: "VGA adapter",
  price: new BigNumber("30.00"),
  sku: "vga",
});

const priceRules: PriceRule[] = [];

export const scenarios = [
  new Scenario({
    checkout: new Checkout(priceRules),
    products: [atv, atv, atv, vga],
    total: "249",
  }),
  new Scenario({
    checkout: new Checkout(priceRules),
    products: [atv, ipd, ipd, atv, ipd, ipd, ipd],
    total: "2718.95",
  }),
  new Scenario({
    checkout: new Checkout(priceRules),
    products: [mbp, vga, ipd],
    total: "1949.98",
  }),
];
