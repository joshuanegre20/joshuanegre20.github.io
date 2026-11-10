---
title: JrBanz Motoshop POS
description: An offline point-of-sale and inventory system for a motorcycle parts shop, built so the money always adds up to the centavo, even with no internet.
year: 2026
role: Solo developer · client project
outcome: Shipped as a Windows installer with 95 automated tests run against real SQLite databases
tech: [TypeScript, React, Electron, SQLite, Drizzle ORM, Zustand, Tailwind CSS, Vitest]
image: /projects/pos.svg
featured: true
order: 2
---

## The problem

JrBanz Motoshop sells motorcycle parts and needed a register and stock system that keeps working when the internet doesn't. It also had to answer the owner's real questions: what's in stock, what needs reordering, what did we actually earn this week, and where did the money go.

Small-shop POS tools often get the money subtly wrong. Floating-point totals drift, discounts don't add back up to the line total, and profit is calculated from the *latest* purchase price instead of what the stock really cost.

## What I did

- **Built it as a fully offline Windows desktop app** with Electron, React and SQLite. No server, no account, no connection required.
- **Made money exact by design:**
  - Amounts are stored as integer centavos and percentages as integer basis points (12.5% = 1250), rounded half up to the centavo.
  - Discounts round per unit, so unit price × quantity always equals the subtotal.
  - The profit percentage is defined explicitly as markup on wholesale, not margin.
- **Implemented moving weighted-average costing.**
  - Each product keeps a running inventory value. A sale removes value × quantity sold ÷ units on hand.
  - That exact cost is stored on the sale line, so voiding a sale puts back precisely what was taken out.
  - Cost of goods sold never depends on the latest purchase price.
- **Protected the stock ledger.** Every stock change goes through a single function that always writes an inventory movement. Checkout is idempotent through a unique request ID, so a double-click can't sell the same cart twice.
- **Locked down the desktop app's internals.** The renderer's only bridge to the main process is an allowlisted `invoke()`. The IPC layer enforces login and hides raw errors from the UI, and business rules live in plain services with no Electron imports, so they can be tested directly.
- **Covered the shop's daily work:**
  - a sales screen with receipts, plus sales history and voids
  - products and inventory, with low-stock status
  - restocking
  - expenses
  - a dashboard with weekly (Monday to Sunday) and period charts
- **Made data survive anything.**
  - The database lives in `%APPDATA%`, outside the install folder, so updates and reinstalls never touch it.
  - Backups run on a schedule, and every restore first takes a safety copy of the current data.
  - An hourly maintenance task and an error log round it out.
- **Wrote 95 Vitest tests** for sales, inventory, pricing, finance and backup. They run against real SQLite databases rather than mocks.

## Results

The shop runs its register, stock and books from one installer (`JrBanzMotoshop-Setup-1.0.0.exe`) on a single PC with no internet dependency. Every peso of profit can be traced back to the exact cost recorded on each sale line.

## What I'd do differently

I'd put the project under version control from the first commit. Everything else about the codebase is disciplined, from the typed IPC contract and pure services to the test suite against real databases. Without history, though, there's no record of *why* rules like markup-versus-margin were decided.
