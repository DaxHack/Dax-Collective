# Dax-Collective
A repository of all my major projects
Dax Suite: Travel Brand Web App

Overview

Dax Suite (also known as Dax Collective) is a unified web application for delivering engaging travel content, itineraries, and digital products under the "Dax the Traveler" and "Timezone Travelers" brands. This repository houses the code and configuration needed to launch a minimal viable product (MVP) of the travel site, complete with blogging, image management, and monetization features.

Features

Landing Page & Navigation: A visually compelling homepage with clear links to all sub-pages (blogs, guides, product listings).

Blog CMS: Built‑in functionality to add, edit, and publish blog posts with rich media support.

Image Management: Easy swapping of header and gallery images via simple file uploads or CMS controls.

Monetization Integration:

Affiliate link placement

Ad slot placeholders

Simple shop or product widget integration


Automation & Workflows:

GitHub Actions: CI/CD pipeline for build & deploy on every push to main branch.

n8n Workflows: Automations for social syndication, backups, newsletter triggers, and more.



Tech Stack

Frontend: Vue.js / JavaScript / HTML / CSS

Build & Deploy: GitHub Actions (.github/workflows/main.yml)

Automations: n8n (self‑hosted via Docker or n8n.cloud)

Hosting: GitHub Pages, Netlify, or Vercel (configurable)


Getting Started

1. Clone the repository

git clone https://github.com/daxhack/dax-travel-site.git
cd dax-travel-site


2. Install dependencies

npm ci


3. Run locally

npm run dev


4. Access CMS

Navigate to /admin or use provided UI controls to create and publish blog posts.

Swap images in the assets/images directory or via CMS image upload feature.




Deployment

The repo includes a GitHub Actions workflow that:

1. Checks out code


2. Installs dependencies


3. Builds the site (npm run build)


4. Deploys to your chosen host (GitHub Pages by default)



Customize publish_dir, deploy tokens, or switch to Netlify/Vercel actions as needed.

Automation Setup

1. GitHub Actions

Ensure Actions are enabled in repo settings

Configure secrets for external deploy targets (e.g., NETLIFY_AUTH_TOKEN)



2. n8n

Self‑host with Docker: docker run -it --rm -p 5678:5678 -v ~/.n8n:/home/node/.n8n n8nio/n8n

Or sign up at n8n.cloud

Import workflows for:

Content syndication (Twitter, LinkedIn)

Backup & storage

Newsletter or email triggers





MVP Roadmap (40% → 60%)

1. Core CMS polish (low effort)


2. Basic monetization enabled (medium effort)


3. UX review & link validation (low effort)


4. Automation flows activation (medium effort)


5. User testing & feedback loop (ongoing)



Contributing

Fork the repository

Open an issue for any new feature or bug

Submit a pull request with clear descriptions

Follow existing code style and commit conventions


License

This project is licensed under the MIT License. See LICENSE for details.

Contact

Email: daxdaniel2013@gmail.com

Website: https://daxcollective.com

Social:

YouTube: Dax the Traveler / Timezone Travelers

Instagram: @DaxTheTraveler

Twitter: @DaxTraveler



