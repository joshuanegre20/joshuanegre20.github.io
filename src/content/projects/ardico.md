---
title: Ardico
description: A desktop estimating and project management app for a construction firm, turning material take-offs, budgets and weekly site audits into the client's own Excel formats.
year: 2026
role: Solo developer · client project
outcome: Shipped as a Windows installer (v1.0.2) that replaces hand-built estimate and audit spreadsheets
tech: [TypeScript, React Native, Expo Router, Electron, SQLite, SheetJS, fflate]
image: /projects/ardico.svg
featured: true
order: 1
---

## The problem

Ardico, a construction contractor, ran every job out of Excel. Each estimate meant working out materials by hand for each kind of work, then copying the totals into a "program of works" template for the local government. On site, the weekly internal audit (materials bought, labor, money received, cash flow) was another hand-filled workbook. The numbers lived in a dozen files per project, and a mistake in one sheet quietly carried into the next.

They wanted one app that did the arithmetic. It also had to produce the *exact* documents they already submit, because their clients and the LGU expect those formats.

## What I did

- **Built an estimation engine** covering the work types the firm actually prices. That includes concrete by mix class (A 1:2:4, B 1:2.5:5, C 1:3:6), more than 25 ceiling systems, roofing (corrugated GI, long-span, tile, polycarbonate, stone-coated and more), and wall and glass partitions. Each work type turns dimensions into a bill of quantities and a cost breakdown. The work definitions alone run to about 2,800 lines of typed data.
- **Modeled the whole project lifecycle:**
  - projects, their estimates and works
  - a materials catalog with categories and unit prices
  - budgets
  - a money ledger that tracks every inflow and outflow
  - weekly progress reports and internal audits with site photos
- **Recreated the client's Excel templates byte for byte in layout.** That covers the "CMC-10M LGU" program of works and the "04-week" internal audit: logo, diagonal watermarks, boxed headers and the yellow, orange and grey totals. SheetJS's free edition can read cell styles but can't write them, so I assemble the OOXML package by hand and zip it with fflate.
- **Added a portfolio builder** that lays completed projects out as a cover page, contents and photo spreads, then exports to PDF for the firm's proposals.
- **Packaged it as a Windows desktop app.**
  - Electron wraps the Expo web build and serves it from a local HTTP server, so routing and asset paths behave like a normal website.
  - SQLite lives in the user's app-data folder, with five rolling backups.
  - Squirrel handles install, update and shortcuts.
- **Made the installer work on machines without a C++ toolchain.** The native `better-sqlite3` module is optional, and the app falls back to Node's built-in `node:sqlite` when it isn't available.

## Results

The firm now produces estimates, LGU submissions and weekly audits from one place, and the exported workbooks match the formats they already file. Because every report is generated from the same ledger and bill of quantities, a change to a material price or quantity flows through to every document instead of being re-typed.

## What I'd do differently

I'd write automated tests around the estimation engine from day one. The quantity formulas are the core of the product, and today they're checked by comparing exports against the client's sample workbooks by hand.
