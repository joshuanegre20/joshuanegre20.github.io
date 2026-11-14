---
title: AgroBenta
description: A livestock marketplace for Trinidad, Bohol, built by a team. I handled DevOps, taking it from code to a secure, live production server.
year: 2026
role: DevOps engineer, team project
outcome: Live at agrobenta.com on AWS, with Docker, Caddy, nginx and Cloudflare in front, real-time updates over Reverb and Google sign-in
tech: [AWS, Docker, Caddy, nginx, Cloudflare, Laravel Reverb, Google OAuth]
image: /projects/agrobenta.svg
demo: https://agrobenta.com
featured: true
order: 5
---

## The project

AgroBenta is an online livestock marketplace for Trinidad, Bohol. It gives local farmers and buyers one place to list and find animals, instead of relying on word of mouth and scattered posts.

It was a team project. My teammates built the application, and I owned **DevOps**: everything between the repository and a working, secure site on the public internet.

## What I did

**Hosting and containers**

- Set up the production server on **AWS**.
- Packaged the app and its services with **Docker**, so the server runs the same setup the team develops against and a redeploy is a predictable, repeatable step.

**Traffic, HTTPS and the edge**

- Put **Caddy** and **nginx** in front of the application to handle HTTPS, routing and serving the app.
- Connected the domain through **Cloudflare** for DNS and an extra protective layer between visitors and the server.

**Real-time and sign-in**

- Deployed **Laravel Reverb**, the WebSocket server that pushes live updates to the browser, and configured the proxy so long-lived WebSocket connections pass through correctly.
- Set up **Google OAuth**, so users can sign in with their Google account. This covered the Google Cloud credentials, the authorized redirect URLs for the production domain, and keeping the secrets out of the repository.

## Results

AgroBenta is live at [agrobenta.com](https://agrobenta.com). The team can ship features while the infrastructure underneath stays the same: containerized, served over HTTPS, and protected by Cloudflare.

## What I learned

Working as the DevOps person on a team means your users are first your teammates. A deploy that only I understand isn't finished. Clear environment setup and repeatable containers mattered as much as getting the server online.
