# shopping-checkout
A simple shopping checkout system.

## Installation
- Install the latest version of Node 8
- `git clone` this repository
- `npm install`

## Running
- `npm start`

## Running tests
- `npm test`

## Assumptions
- The product catalogue is not validated during checkout
- Items are not automatically bundled e.g. a VGA adapter will not be added to the line items when a MacBook Pro is scanned
- Price rules do not expire
- A product price cannot be 0 or negative

## Design decisions
- TypeScript was used to provide static type checking and therefore reduce programmer error
- Arbitrary-precision numbers have been utilised for prices using `BigNumber`, which is similar to Java's `BigDecimal` class
- Simple validated immutable object models were designed in order to make the program easier to reason about
- Checkout contains the logic to apply price rules as this is more flexible than having it in price rule or line item

## Extensions
- Validate catalogue items during checkout
- Validate price rules
- Use more declarative price rule prerequisites
- Add price rule from and to dates
- Add price rule priorities
- Add percentage price rules
- Add shipping costs and discounts
