import { BigNumber } from "bignumber.js";
import { Product } from "../product/product";
import { Checkout } from "./checkout";
import { LineItem } from "./line-item";
import { PriceRule } from "./price-rule";

describe("Checkout", () => {
  const ipdDefaults = Object.freeze({ sku: "ipd", name: "Super iPad" });
  const mbpDefaults = Object.freeze({ sku: "mbp", name: "MacBook Pro" });
  const atvDefaults = Object.freeze({ sku: "atv", name: "Apple TV" });
  const vgaDefaults = Object.freeze({ sku: "vga", name: "VGA adapter" });

  describe("lineItems", () => {
    it("is empty when no items have been scanned", () => {
      expect(new Checkout().lineItems).toEqual([]);
    });
  });

  describe("#scan()", () => {
    let checkout: Checkout;

    beforeEach(() => {
      checkout = new Checkout();
    });

    it("adds the scanned item to the line items", () => {
      const item = new Product({ ...ipdDefaults, price: new BigNumber("549.99") });
      const previousLineItems = [].concat(checkout.lineItems);
      checkout.scan(item);
      expect(checkout.lineItems).toEqual([
        ...previousLineItems,
        new LineItem({ product: item, quantity: 1 }),
      ]);
    });

    it("combines multiple products of the same id into the same line item with the corresponding quantity", () => {
      const item = new Product({ ...ipdDefaults, price: new BigNumber("549.99") });
      const previousLineItems = [].concat(checkout.lineItems);
      checkout.scan(item);
      checkout.scan(item);
      checkout.scan(item);
      expect(checkout.lineItems).toEqual([
        ...previousLineItems,
        new LineItem({ product: item, quantity: 3 }),
      ]);
    });

    it("adds a line item for each type of item that is scanned", () => {
      const ipd = new Product({ ...ipdDefaults, price: new BigNumber(1) });
      const mbp = new Product({ ...mbpDefaults, price: new BigNumber(1) });
      const atv = new Product({ ...atvDefaults, price: new BigNumber(1) });
      const vga = new Product({ ...vgaDefaults, price: new BigNumber(1) });
      const previousLineItems = [].concat(checkout.lineItems);

      checkout.scan(ipd);
      checkout.scan(mbp);
      checkout.scan(atv);
      checkout.scan(vga);

      expect(checkout.lineItems).toEqual([
        ...previousLineItems,
        new LineItem({ product: ipd, quantity: 1 }),
        new LineItem({ product: mbp, quantity: 1 }),
        new LineItem({ product: atv, quantity: 1 }),
        new LineItem({ product: vga, quantity: 1 }),
      ]);
    });
  });

  describe("#total()", () => {
    let checkout: Checkout;

    beforeEach(() => {
      checkout = new Checkout();
    });

    it("returns 0 when no items have been scanned", () => {
      expect(checkout.total()).toBe("0");
    });

    it("returns the price of a single scanned item", () => {
      checkout.scan(new Product({ sku: "ipd", name: "Super iPad", price: new BigNumber("549.99") }));
      expect(checkout.total()).toBe("549.99");
    });

    it("returns the sum of all of the scanned items", () => {
      checkout.scan(new Product({ ...ipdDefaults, price: new BigNumber("549.99") }));
      checkout.scan(new Product({ ...mbpDefaults, price: new BigNumber("1399.99") }));
      checkout.scan(new Product({ ...atvDefaults, price: new BigNumber("109.50") }));
      checkout.scan(new Product({ ...vgaDefaults, price: new BigNumber("30.00") }));
      expect(checkout.total()).toBe("2089.48");
    });

    it("returns the price of two X when there is a three for two sale and two X have been scanned", () => {
      const atv = new Product({ ...atvDefaults, price: new BigNumber("109.50") });

      const priceRules = [
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
      ];

      checkout = new Checkout(priceRules);
      checkout.scan(atv);
      checkout.scan(atv);

      expect(checkout.total()).toBe("219");
    });

    it("returns the price of two X when there is a three for two sale and three X have been scanned", () => {
      const atv = new Product({ ...atvDefaults, price: new BigNumber("109.50") });

      const priceRules = [
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
      ];

      checkout = new Checkout(priceRules);
      checkout.scan(atv);
      checkout.scan(atv);
      checkout.scan(atv);

      expect(checkout.total()).toBe("219");
    });

    it("does not return a bulk discount price when the quantity has not been met", () => {
      const ipd = new Product({ ...ipdDefaults, price: new BigNumber("549.99") });
      const priceRules = [
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
      ];

      checkout = new Checkout(priceRules);
      checkout.scan(ipd);
      checkout.scan(ipd);
      checkout.scan(ipd);
      checkout.scan(ipd);

      expect(checkout.total()).toBe("2199.96");
    });

    it("returns a bulk discount price when the quantity has been met", () => {
      const ipd = new Product({ ...ipdDefaults, price: new BigNumber("549.99") });
      const priceRules = [
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
      ];

      checkout = new Checkout(priceRules);
      checkout.scan(ipd);
      checkout.scan(ipd);
      checkout.scan(ipd);
      checkout.scan(ipd);
      checkout.scan(ipd);

      expect(checkout.total()).toBe("2499.95");
    });

    it("returns the price of X when Y is bundled for free with X", () => {
      const mbp = new Product({ ...mbpDefaults, price: new BigNumber("1399.99") });
      const vga = new Product({ ...vgaDefaults, price: new BigNumber("30.00") });

      const priceRules = [
        new PriceRule({
          entitledSkus: [vga.sku],
          name: "Free VGA adapter with MacBook Pro purchase",
          prerequisites: [
            (lineItems) => !!lineItems.get(mbp.sku),
          ],
          value: new BigNumber("0"),
          valueType: "fixed_price",
        }),
      ];

      checkout = new Checkout(priceRules);
      checkout.scan(mbp);
      checkout.scan(vga);

      expect(checkout.total()).toBe("1399.99");
    });

    it("returns the price of X when Y is bundled for free for every X", () => {
      const mbp = new Product({ ...mbpDefaults, price: new BigNumber("1399.99") });
      const vga = new Product({ ...vgaDefaults, price: new BigNumber("30.00") });

      const priceRules = [
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

      checkout = new Checkout(priceRules);

      checkout.scan(mbp);
      checkout.scan(vga);

      checkout.scan(mbp);
      checkout.scan(vga);

      checkout.scan(mbp);
      checkout.scan(vga);

      expect(checkout.total()).toBe("4199.97");
    });
  });
});
