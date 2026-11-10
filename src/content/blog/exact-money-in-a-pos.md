---
title: Never trust a float with someone's money
description: How I built an offline point-of-sale app that adds up to the centavo, using integer money, per-unit discounts and weighted-average costing.
pubDate: 2026-11-10
tags: [typescript, electron, sqlite, pos]
---

When I started the point-of-sale system for [JrBanz Motoshop](/projects/jrbanz-pos), a motorcycle parts shop, I assumed the hard part would be the interface: the sales screen, receipts, inventory tables. It wasn't. The hard part was making sure that every number on every screen agreed with every other number, to the centavo, forever.

A shop owner who sees ₱528.66 on the receipt and ₱528.67 in the daily total stops trusting the whole app. Here's how I designed the money so that can't happen.

## Rule 1: money is an integer

Open any JavaScript console and type `0.1 + 0.2`. You get `0.30000000000000004`. Floating-point numbers can't represent most decimal fractions exactly, and the error grows a little with every sum.

So the app never stores pesos. It stores **centavos as integers**: ₱185.50 is `18550`. Percentages get the same treatment as **basis points**, hundredths of a percent, so a 12.5% markup is `1250`. Nothing that touches a stored amount ever does floating-point math.

That raises a new question: what happens when you *must* divide, like taking 5% off a price? Every division in the app goes through one function:

```ts
/** Computes round(a * b / c) exactly, rounding halves away from zero. */
export function mulDivRound(a: number, b: number, c: number): number {
  if (c === 0) throw new RangeError("Division by zero");
  const numerator = BigInt(a) * BigInt(b);
  const divisor = BigInt(c);
  const negative = numerator < 0n !== divisor < 0n;
  const n = numerator < 0n ? -numerator : numerator;
  const d = divisor < 0n ? -divisor : divisor;
  const rounded = (n * 2n + d) / (d * 2n);
  return Number(negative ? -rounded : rounded);
}
```

Two details matter here:

- **It uses `BigInt`.** Multiplying a large inventory value by a quantity can pass JavaScript's safe-integer limit, and `BigInt` makes the intermediate result exact no matter how big it gets.
- **It rounds half up, in integer arithmetic.** `(n * 2 + d) / (d * 2)` is "add half, then truncate" without ever leaving whole numbers. There's one rounding rule for the entire app, written in one place.

## Rule 2: round the discount per unit, not per line

Say a customer buys three cans of chain lube at ₱185.50 each, with a 5% discount. There are two reasonable-looking ways to compute it:

| Approach | Math | Result |
|---|---|---|
| Discount the line total | ₱556.50 − 5% = ₱556.50 − ₱27.83 | **₱528.67** |
| Discount each unit | (₱185.50 − ₱9.28) × 3 = ₱176.22 × 3 | **₱528.66** |

The receipt shows the unit price, ₱176.22 × 3. If the total was computed the first way, the receipt doesn't add up, and somebody will notice with a calculator.

So the app rounds the discount **per unit**, then multiplies:

```ts
export function lineTotals({ retail, quantity, discountBp }: LineInput): LineTotals {
  const discountAmount = mulDivRound(retail, discountBp, 10_000);
  const discountedUnitPrice = retail - discountAmount;
  return {
    discountAmount,
    discountedUnitPrice,
    subtotal: discountedUnitPrice * quantity,
  };
}
```

Unit price × quantity always equals the subtotal, by construction.

## Rule 3: profit uses what the stock actually cost

This one is subtle, and it's where many small-shop systems quietly lie.

Suppose the shop buys 10 spark plugs at ₱100, then later 10 more at ₱130 because the supplier raised prices. Now it sells 5. What did those 5 cost?

If you use the latest purchase price, the answer is ₱650. But the shop never paid ₱130 for half of its stock. The honest answer is the **moving weighted average**: ₱2,300 spent on 20 plugs is ₱115 each, so ₱575.

Each product keeps a running `inventory_value`. A purchase adds its cost, and a sale removes a proportional share:

```ts
/** Moving weighted-average cost of removing `quantity` from a stock pool. */
export function costOfRemoval(stockQuantity: number, inventoryValue: number, quantity: number): number {
  if (stockQuantity <= 0) return 0;
  if (quantity >= stockQuantity) return inventoryValue;
  return mulDivRound(inventoryValue, quantity, stockQuantity);
}
```

Three design choices make this robust:

1. **The exact removed cost is stored on the sale line.** When a sale is voided, the app puts back precisely that amount, not a recalculated one. Recalculating after more purchases have happened would give a different number.
2. **Selling the last unit takes the whole remaining value.** Rounding can leave a centavo or two of "dust" in the pool, and that branch makes sure an empty shelf really is worth ₱0.00.
3. **`wholesale_price` is display-only.** It records the latest purchase cost, which is useful for setting prices, but it's never used to compute cost of goods sold.

## Rule 4: make the dangerous paths impossible

Correct formulas aren't enough if some other code path can bypass them. So two more rules are enforced by the structure of the code, not by convention:

- **Stock changes only through `applyStockChange`.** Sales, restocks, voids and manual adjustments all call the same function, inside a database transaction, and it always writes an inventory movement record. There's no way to change a quantity without leaving a trail.
- **Checkout is idempotent.** Every confirmation carries a unique `request_id`. If the cashier double-clicks "Charge", or the app retries after a hiccup, the second request finds the first sale and returns it instead of selling the same cart twice.

## Proving it

All of these rules live in plain TypeScript modules with no Electron imports, which makes them easy to test. The suite has **95 tests** across sales, inventory, pricing, finance and backups. They run against real SQLite databases instead of mocks, because the bugs I worried about most (a transaction that half-commits, a void that doesn't restore stock) only show up against a real database.

## What I took away

Money bugs are rarely about hard math. They're about two pieces of code doing *slightly different* math and nobody noticing until the totals drift. The fix wasn't clever. It was being boring on purpose:

- one representation (integer centavos)
- one rounding rule
- one function for division
- one path for stock changes

Then I wrote tests to keep it that way.
