---
title: Faithly
description: A church community platform with a mobile app, a real-time API and an admin website, covering a social feed, chat, live streams, event registration and giving for a church network in Bohol.
year: 2026
role: Solo full-stack developer
outcome: Mobile app, API and admin site in production behind Docker, nginx and a Cloudflare Tunnel, backed by 128 server tests
tech: [TypeScript, React Native, Expo, React Router, Node.js, Express, Socket.IO, MySQL, Redis, Firebase Cloud Messaging, Docker]
image: /projects/faithly.svg
demo: https://cthimm-bohol.com
featured: true
order: 3
---

## The problem

The church kept its community spread across Facebook pages, group chats, paper registration forms and spreadsheets. Members missed announcements. Event sign-ups and fees were tracked by hand, and the staff had no single view of attendance, giving or who needed follow-up.

They wanted their own app: a place members actually open every day, plus one admin console that runs everything behind it.

## What I did

**Mobile app (Expo / React Native)**

- A personalized news feed with posts, photos, videos, reels and embedded Facebook posts, plus comments, replies, reactions and saved posts.
- Direct and group chat over Socket.IO, with attachments, shared posts, editing and unsend.
- Live streams, worship and church schedules, ministries, service requests, giving ("seeds"), and event registration with tiered fees and guest types.
- Push notifications through Firebase Cloud Messaging, and over-the-air updates through Expo Updates.
- Identity verification at sign-up: a photo of a government ID plus an in-app selfie, which admins compare before approving the account.

**API (Node.js / Express / MySQL / Redis)**

- A real-time API split into focused modules: feed ranking, group chats, live streams, event fees and schedules, push, reactions, verification, Facebook sync and more.
- **128 tests** written with Node's built-in test runner.
- 40 versioned SQL migrations that track the schema as features shipped.
- **A feed-ranking algorithm** written as pure, testable functions:
  - Recency decays with a 36-hour half-life, and a comment counts three times a like.
  - Posts get boosts for the viewer's own church and for authors they engage with.
  - Low-effort posts and "not interested" get penalties.
  - Variety rules stop more than two of the same format, or two suggested posts, appearing in a row.
  - A seeded hash adds jitter, so the order stays stable while someone scrolls.

**Admin website (React Router, shadcn/ui, Tailwind)**

- A live dashboard over sockets, so switching tabs doesn't reload.
- Sections for:
  - users, posts and announcements
  - events, registrations and payments
  - attendance, including Sunday worship
  - giving, ministries, services and messages
  - live streams and Facebook page sync
  - an outreach map built with Leaflet
  - a website content editor and system settings
- PDF reports generated with jsPDF.

**Deployment**

- Docker Compose runs MySQL, Redis, the API, the server-rendered web client and nginx.
- A Cloudflare Tunnel publishes it without opening any inbound ports.
- Fresh servers seed themselves from an init SQL folder.

## Results

The church has one platform in place of scattered pages and paper forms. The repository has 75 commits over about a month, from first commit to version 1.1.0, including a maintenance mode, detailed notifications and Sunday attendance tracking added after launch.

## What I'd do differently

I'd break `server.js` up sooner. The newer features live in small, tested modules, but the original routes grew into one file of more than 10,000 lines. That's now the hardest part of the codebase to change safely.
