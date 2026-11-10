---
title: ProfScan
description: A QR-based instructor attendance system for a college, from custom ESP32 scanner hardware to a live web dashboard that marks absences automatically.
year: 2026
role: Solo developer · hardware, firmware, backend and frontend
outcome: Replaced manual instructor logbooks with scan-in attendance that updates dashboards in real time
tech: [Laravel, PHP, React, TypeScript, Socket.IO, MySQL, ESP32, Arduino C++, Docker]
image: /projects/profscan.svg
featured: true
order: 4
---

## The problem

The college tracked whether instructors showed up to their classes with paper logbooks checked by staff. Records arrived late, absences were caught after the fact, and building reports for each department meant tallying sheets by hand.

The goal was attendance that records itself. An instructor scans in at the room, and the system knows within minutes who's in class, who's late and who hasn't arrived.

## What I did

- **Built the scanner hardware and firmware.**
  - Each unit is an ESP32 with a serial QR scanner and a 128×64 OLED that shows the clock, status and scan results.
  - Wi-Fi credentials, server URL and pairing token are stored in flash.
  - The device sends a heartbeat every second, enforces a scan cooldown, and factory-resets on a five-second button hold.
- **Designed device pairing.**
  - Admins register a scanner in the web app, which issues a pairing token.
  - The device reports in with that token and shows up on the dashboard.
  - Any scanner silent for 35 seconds is flagged offline, on a check that runs every five seconds.
- **Wrote the Laravel 12 API** with JWT authentication for three roles: admin, staff and instructor. It manages instructors, departments, subjects, schedules and events, and handles password reset by emailed one-time code.
- **Automated the attendance rules.**
  - A scheduler runs every minute and moves each class from Upcoming to Ongoing when it starts.
  - It marks the instructor Absent if there's no scan 15 minutes after start.
  - Schedules reset at midnight, and staff can excuse a whole day or mark absences by hand.
- **Made it real time.** A Socket.IO relay pushes scans, device status and schedule changes to admin and staff rooms, so dashboards update without refreshing.
- **Built three portals in React 19, Vite and Tailwind:**
  - **Admin:** analytics with Chart.js, device management, late-policy settings and Excel exports.
  - **Staff:** live attendance and schedule management.
  - **Instructor:** personal schedule, scan logs and settings.
- **Containerized the stack** with Docker Compose: MySQL, the Laravel API, a dedicated scheduler container, the socket server, the frontend, nginx and phpMyAdmin.

## Results

Instructor attendance is recorded at the moment of the scan rather than reconstructed from logbooks. Absences are flagged automatically 15 minutes into a class, and admins can see every scanner's health and every room's status live.

## What I'd do differently

I'd harden the device endpoints. Scanners currently authenticate with only their pairing token over the same public API, and I'd add signed requests and rate limiting. I'd also add automated tests around the scheduler, since its timing rules decide whether someone gets marked absent.
