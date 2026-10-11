// src/automation/contentStore.js
// localStorage-based store for Content Ideas and Content Packages.
// All keys are namespaced so they never collide with other localStorage usage.

const KEYS = {
  ideas: 'dax_content_ideas',
  packages: 'dax_content_packages',
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function read(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function write(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// ─── Content Ideas ───────────────────────────────────────────────────────────

export function getIdeas() {
  return read(KEYS.ideas);
}

export function saveIdea(idea) {
  const ideas = read(KEYS.ideas);
  const now = Date.now();
  if (idea.id) {
    const idx = ideas.findIndex((i) => i.id === idea.id);
    if (idx !== -1) {
      ideas[idx] = { ...ideas[idx], ...idea, updatedAt: now };
    }
  } else {
    ideas.unshift({ ...idea, id: uid(), createdAt: now, updatedAt: now, packageId: null });
  }
  write(KEYS.ideas, ideas);
  return ideas;
}

export function deleteIdea(id) {
  const ideas = read(KEYS.ideas).filter((i) => i.id !== id);
  write(KEYS.ideas, ideas);
  return ideas;
}

export function linkIdeaToPackage(ideaId, packageId) {
  const ideas = read(KEYS.ideas);
  const idx = ideas.findIndex((i) => i.id === ideaId);
  if (idx !== -1) {
    ideas[idx].packageId = packageId;
    ideas[idx].updatedAt = Date.now();
  }
  write(KEYS.ideas, ideas);
  return ideas;
}

// ─── Content Packages ────────────────────────────────────────────────────────

export function getPackages() {
  return read(KEYS.packages);
}

export function savePackage(pkg) {
  const packages = read(KEYS.packages);
  const now = Date.now();
  if (pkg.id) {
    const idx = packages.findIndex((p) => p.id === pkg.id);
    if (idx !== -1) {
      packages[idx] = { ...packages[idx], ...pkg, updatedAt: now };
    }
  } else {
    packages.unshift({ ...pkg, id: uid(), createdAt: now, updatedAt: now });
  }
  write(KEYS.packages, packages);
  return packages;
}

export function deletePackage(id) {
  const packages = read(KEYS.packages).filter((p) => p.id !== id);
  write(KEYS.packages, packages);
  return packages;
}

export function getPackageByIdeaId(ideaId) {
  return read(KEYS.packages).find((p) => p.sourceIdeaId === ideaId) || null;
}

// ─── Status logic ────────────────────────────────────────────────────────────

export function derivePackageStatus(notes = '') {
  return notes.trim().length >= 60 ? 'Script Needed' : 'Researching';
}

// ─── Seed data (runs once if store is empty) ─────────────────────────────────

export function seedIfEmpty() {
  if (read(KEYS.ideas).length === 0) {
    const seed = [
      {
        title: 'Top 10 Hidden Anime Gems of 2025',
        brand: 'anidax',
        contentType: 'video',
        platform: 'youtube',
        priority: 'high',
        notes: 'Focus on under-the-radar shows from Spring/Summer 2025 that deserve more attention. Include short clips, character highlights, and community reactions.',
      },
      {
        title: 'Solo Travel Japan on $50/Day',
        brand: 'daxtraveler',
        contentType: 'blog',
        platform: 'blog',
        priority: 'high',
        notes: 'Budget breakdown, hostel tips, free attractions.',
      },
      {
        title: 'Morning Prayer Routine for Busy People',
        brand: 'godsvessel',
        contentType: 'short',
        platform: 'tiktok',
        priority: 'medium',
        notes: '',
      },
      {
        title: 'Working Across 3 Time Zones: My Setup',
        brand: 'timezonetravelers',
        contentType: 'guide',
        platform: 'blog',
        priority: 'low',
        notes: 'Tools, calendar tricks, async communication tips.',
      },
    ];

    seed.forEach((idea) => saveIdea(idea));
  }
}
