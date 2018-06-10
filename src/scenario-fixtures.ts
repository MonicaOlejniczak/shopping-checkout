import { BigNumber } from "bignumber.js";
import { Checkout } from "./checkout/checkout";
import { PriceRule } from "./checkout/price-rule";
import { Product } from "./product/product";
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

const priceRules: PriceRule[] = [
  new PriceRule({
    entitledSkus: [atv.sku],
    name: "Three apple tvs for the price of two",
    prerequisites: [
      (lineItems) => {
        const atvLineItem = lineItems.get(atv.sku);
        return !!atvLineItem && atvLineItem.quantity >= 3;
      },
    ],
    value: new BigNumber("-109.50"),
    valueType: "fixed_offset",
  }),
  new PriceRule({
    entitledSkus: [ipd.sku],
    name: "Price drop for iPad when you buy more than four",
    prerequisites: [
      (lineItems) => {
        const ipdLineItem = lineItems.get(ipd.sku);
        return !!ipdLineItem && ipdLineItem.quantity > 4;
      },
    ],
    value: new BigNumber("499.99"),
    valueType: "fixed_price",
  }),
  new PriceRule({
    entitledSkus: [vga.sku],
    name: "Free VGA adapter with every MacBook Pro purchase",
    prerequisites: [
      (lineItems) => !!lineItems.get(mbp.sku),
    ],
    value: new BigNumber("0"),
    valueType: "fixed_price",
  }),
];

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
