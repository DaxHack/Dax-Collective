# Dax Collective

**A unified travel + faith + anime content hub** powering:
- **Dax the Traveler** (personal travel vlogs & blogs)
- **Timezone Travelers** (faceless SEO-driven travel content)
- **God’s Vessel** (faith-based quotes, merch, and automation)
- **Ani-Dax** (automated anime link processing & reviews)

---

## 🚀 Features

- **Multi-brand CMS**  
  → Create, edit, and publish blog posts and pages for each brand  
- **Dynamic Image Management**  
  → Pull real images from Unsplash, Canva and host in Firebase Storage  
- **Anime Link Processor**  
  → Drop any MAL/AniList/Crunchyroll link and auto-extract title, synopsis, images  
- **Automations (n8n)**  
  → Social syndication, backups, email triggers, affiliate tracking  
- **Monetization Hooks**  
  → Affiliate links, ad slots, simple shop widget integration  

---

## 🛠 Tech Stack

- **Frontend:** React (Create React App), Tailwind CSS, Framer Motion  
- **Backend & Hosting:** Firebase Hosting + Functions  
- **Automations:** n8n (self-hosted via Docker or n8n.cloud)  
- **APIs:** Unsplash, Jikan (MAL), AniList GraphQL, Canva, OpenAI  

---

## ⚙️ Quick Setup

1. **Clone & install**  
   ```bash
   git clone https://github.com/DaxHack/Dax-Collective.git
   cd Dax-Collective/dax-main
   npm ci