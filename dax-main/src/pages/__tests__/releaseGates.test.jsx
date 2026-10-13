/* eslint-env jest */
// Release gates for making `main` the canonical product:
//   - unverified blog content is never public
//   - internal investor routes are not part of production
//   - /automation shows the dashboard only after sign-in AND a server-side
//     admin check
//   - unverified or placeholder social links are never rendered
//   - contact form labels are tied to their inputs

import React from 'react';
import fs from 'fs';
import path from 'path';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

global.IntersectionObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

const SRC = path.join(__dirname, '..', '..');
const read = (file) => fs.readFileSync(path.join(SRC, file), 'utf8');

// ─── Mocks for the dashboard gate ────────────────────────────────────────────
const mockFirebase = { isFirebaseConfigured: true, auth: { currentUser: null } };
const mockAuthState = { user: null, loading: false, signIn: jest.fn(), signOut: jest.fn() };
const mockAccess = { checked: true, authorized: false, reason: 'unauthenticated', message: 'Sign in to use the admin tools.' };

jest.mock('../../config/firebase', () => mockFirebase);
jest.mock('../../contexts/AuthContext', () => ({ useAuth: () => mockAuthState }));
jest.mock('../../hooks/useAdminAccess', () => ({ useAdminAccess: () => mockAccess }));
jest.mock('../../automation/AutomationDashboard', () => ({
  __esModule: true,
  default: () => <div>AUTOMATION DASHBOARD CONTENT</div>
}));

const renderAt = (route, element, routePath) =>
  render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path={routePath || route} element={element} />
        </Routes>
      </MemoryRouter>
    </HelmetProvider>
  );

beforeEach(() => {
  mockFirebase.isFirebaseConfigured = true;
  Object.assign(mockAuthState, { user: null, loading: false });
  mockAuthState.signIn.mockReset();
  mockAuthState.signIn.mockResolvedValue(null);
  Object.assign(mockAccess, {
    checked: true,
    authorized: false,
    reason: 'unauthenticated',
    message: 'Sign in to use the admin tools.'
  });
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

// ─── Blog ────────────────────────────────────────────────────────────────────
describe('blog publication control', () => {
  const blog = require('../../data/blogData');
  // Editorial source material. Imported here only to prove it stays private.
  const drafts = require('../../data/editorial/blogDrafts').BLOG_DRAFT_ENTRIES;

  test('only published AND verified entries are public', () => {
    expect(blog.isPublicPost({ status: 'published', verified: true })).toBe(true);
    expect(blog.isPublicPost({ status: 'published', verified: false })).toBe(false);
    expect(blog.isPublicPost({ status: 'published' })).toBe(false);
    expect(blog.isPublicPost({ status: 'draft', verified: true })).toBe(false);
    expect(blog.isPublicPost({ verified: true })).toBe(false);
    expect(blog.isPublicPost({})).toBe(false);
    expect(blog.isPublicPost(null)).toBe(false);
  });

  test('the existing unverified posts are kept as drafts and none is public', () => {
    expect(drafts).toHaveLength(12);
    drafts.forEach((post) => {
      expect(post.status).toBe('draft');
      expect(post.verified).toBe(false);
      expect(post.body.length).toBeGreaterThan(100); // the writing is preserved
    });
    expect(blog.BLOG_POSTS).toEqual([]);
  });

  test('public helpers never return a draft', () => {
    drafts.forEach((post) => {
      expect(blog.getPostBySlug(post.slug)).toBeNull();
      expect(blog.getPostsByBrand(post.brand)).toEqual([]);
      expect(blog.getPostsByCategory(post.category)).toEqual([]);
    });
    expect(blog.getAllCategories()).toEqual([]);
  });

  test('the blog page shows the editorial empty state and no draft', () => {
    const BlogPage = require('../BlogPage').default;
    renderAt('/blog', <BlogPage />);

    expect(screen.getByRole('heading', { level: 1, name: 'Stories in the edit' })).toBeInTheDocument();
    expect(screen.getByText('The first pieces are being finished.')).toBeInTheDocument();
    drafts.forEach((post) => {
      expect(screen.queryByText(post.title)).not.toBeInTheDocument();
    });
    expect(document.querySelectorAll('img')).toHaveLength(0);
    expect(document.querySelectorAll('a[href^="/blog/"]')).toHaveLength(0);
  });

  test('a draft cannot be opened by its URL', () => {
    const BlogPostPage = require('../BlogPostPage').default;
    const draft = drafts[0];
    renderAt(`/blog/${draft.slug}`, <BlogPostPage />, '/blog/:slug');

    expect(screen.getByRole('heading', { name: 'Post not found' })).toBeInTheDocument();
    expect(screen.queryByText(draft.title)).not.toBeInTheDocument();
  });

  test('no application code imports the drafts, so they are not in the bundle', () => {
    const offenders = [];
    const walk = (dir) => {
      fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          if (entry.name !== '__tests__' && entry.name !== 'editorial') walk(full);
        } else if (entry.name.endsWith('.js') || entry.name.endsWith('.jsx')) {
          const importsDrafts = fs
            .readFileSync(full, 'utf8')
            .split(/\r?\n/)
            .some((line) => !line.trim().startsWith('//') && line.includes('editorial/blogDrafts'));
          if (importsDrafts) {
            offenders.push(path.relative(SRC, full));
          }
        }
      });
    };
    walk(SRC);
    expect(offenders).toEqual([]);
  });

  test('the sitemap lists no individual post', () => {
    const sitemap = fs.readFileSync(path.join(SRC, '..', 'public', 'sitemap.xml'), 'utf8');
    expect(sitemap).not.toMatch(/\/blog\/[a-z0-9-]+</);
    expect(sitemap).toMatch(/<loc>https:\/\/daxcollective\.com\/blog<\/loc>/);
  });
});

// ─── Investor routes ─────────────────────────────────────────────────────────
describe('internal investor routes', () => {
  const app = read('App.jsx');

  test('the page is loaded only in non-production builds', () => {
    expect(app).not.toMatch(/^import DaxTheInvestorPage/m);
    expect(app).toMatch(
      /const DaxTheInvestorPage = process\.env\.NODE_ENV !== 'production'\s*\?\s*React\.lazy\(\(\) => import\('\.\/pages\/DaxTheInvestorPage'\)\)\s*:\s*null/
    );
  });

  test('routes are registered only when the page is available', () => {
    expect(app).toMatch(/\{DaxTheInvestorPage && INTERNAL_INVESTOR_PATHS\.map\(/);
    expect(app).not.toMatch(/<Route path="[^"]*" element=\{<DaxTheInvestorPage \/>\} \/>/);
  });

  test.each([
    '/dax-the-investor',
    '/investor',
    '/internal/investor',
    '/private/financial',
    '/dax/investor',
    '/rollo-investor',
    '/internal/rollo'
  ])('%s is only declared in the development-only list', (routePath) => {
    const occurrences = app.split(`'${routePath}'`).length - 1;
    expect(occurrences).toBe(1);
    expect(app).not.toContain(`path="${routePath}"`);
  });

  test('the page source is preserved', () => {
    expect(fs.existsSync(path.join(SRC, 'pages', 'DaxTheInvestorPage.jsx'))).toBe(true);
  });
});

// ─── /automation gate ────────────────────────────────────────────────────────
describe('/automation', () => {
  const renderDashboard = () => {
    const Dashboard = require('../Dashboard').default;
    return renderAt('/automation', <Dashboard />);
  };
  const DASHBOARD = 'AUTOMATION DASHBOARD CONTENT';

  test('behaves as a 404 when Firebase is not configured in the build', () => {
    mockFirebase.isFirebaseConfigured = false;
    mockAuthState.user = { uid: 'u1' };
    Object.assign(mockAccess, { authorized: true, reason: null, message: '' });
    renderDashboard();

    expect(screen.getByText("This page doesn't exist")).toBeInTheDocument();
    expect(screen.queryByText(DASHBOARD)).not.toBeInTheDocument();
  });

  test('shows only a sign-in prompt to a signed-out visitor', () => {
    renderDashboard();

    expect(screen.getByText('Admin sign-in required')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
    expect(screen.queryByText(DASHBOARD)).not.toBeInTheDocument();
  });

  test('shows nothing while the server-side check is still running', () => {
    mockAuthState.user = { uid: 'u1' };
    Object.assign(mockAccess, { checked: false, authorized: false, reason: null, message: '' });
    renderDashboard();

    expect(screen.queryByText(DASHBOARD)).not.toBeInTheDocument();
    expect(screen.getByText('Loading Dashboard...')).toBeInTheDocument();
  });

  test.each([
    ['forbidden', 'This account does not have admin access.'],
    ['not_available', 'Admin uploads are not enabled on the server.'],
    ['unavailable', 'The admin service is currently unavailable.'],
    ['network', 'Could not reach the server.'],
    ['rate_limited', 'Too many requests. Please wait a moment and try again.']
  ])('a signed-in user the backend does not authorize (%s) never sees the dashboard', (reason, message) => {
    mockAuthState.user = { uid: 'u1' };
    Object.assign(mockAccess, { checked: true, authorized: false, reason, message });
    renderDashboard();

    expect(screen.getByText('Dashboard unavailable')).toBeInTheDocument();
    expect(screen.getByText(message)).toBeInTheDocument();
    expect(screen.queryByText(DASHBOARD)).not.toBeInTheDocument();
  });

  test('renders the dashboard only when the backend confirms an admin', async () => {
    mockAuthState.user = { uid: 'admin-1' };
    Object.assign(mockAccess, { checked: true, authorized: true, reason: null, message: '' });
    renderDashboard();

    expect(await screen.findByText(DASHBOARD)).toBeInTheDocument();
  });

  test('the gate has no development bypass', () => {
    const source = read('pages/Dashboard.jsx');
    expect(source).not.toMatch(/NODE_ENV/);
    expect(source).toMatch(/useAdminAccess\(user\)/);
  });
});

// ─── Social links ────────────────────────────────────────────────────────────
describe('social links fail closed', () => {
  const social = jest.requireActual('../../config/socialLinks');

  test('only verified https links are public', () => {
    const links = [
      { name: 'A', url: 'https://example.org/a', verified: true },
      { name: 'B', url: 'https://example.org/b', verified: false },
      { name: 'C', url: 'https://example.org/c' },
      { name: 'D', url: '#facebook-page-url-needed', verified: true },
      { name: 'E', url: 'http://example.org/e', verified: true },
      { name: 'F', url: '', verified: true },
      { label: 'G', href: 'https://example.org/g', verified: true }
    ];
    expect(social.publicSocialLinks(links).map((l) => l.name || l.label)).toEqual(['A', 'G']);
    expect(social.publicSocialLinks(undefined)).toEqual([]);
  });

  test('no placeholder or unverified link is public in the real config', () => {
    const all = [...social.daxCollectiveSocialLinks, ...social.daxTravelerSocialLinks];
    const publicLinks = social.publicSocialLinks(all);

    publicLinks.forEach((link) => {
      expect(link.verified).toBe(true);
      expect(link.href || link.url).toMatch(/^https:\/\//);
    });
    expect(JSON.stringify(publicLinks)).not.toContain('#facebook');
    // Known links are kept in config even though they are not rendered.
    expect(all.length).toBe(9);
  });

  test('the footer renders no placeholder and no unverified social link', () => {
    const Footer = require('../../components/Footer').default;
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    const hrefs = [...document.querySelectorAll('a')].map((a) => a.getAttribute('href') || '');
    expect(hrefs.filter((href) => href.startsWith('#facebook'))).toEqual([]);
    const allowed = social.publicSocialLinks(social.daxCollectiveSocialLinks).map((l) => l.url);
    hrefs
      .filter((href) => /youtube\.com|instagram\.com|tiktok\.com|twitter\.com|facebook\.com/.test(href))
      .forEach((href) => expect(allowed).toContain(href));
  });

  test('public pages render social links only through publicSocialLinks', () => {
    expect(read('components/Footer.jsx')).toMatch(/publicSocialLinks\(daxCollectiveSocialLinks\)/);
    expect(read('pages/DaxTheTravelerPage.jsx')).toMatch(/publicSocialLinks\(daxTravelerSocialLinks\)/);
  });
});

// ─── Contact form accessibility ──────────────────────────────────────────────
describe('contact form labels', () => {
  test.each([
    [/^Name/, 'contact-name', 'INPUT'],
    [/^Email/, 'contact-email', 'INPUT'],
    [/^Topic/, 'contact-topic', 'SELECT'],
    [/^Message/, 'contact-message', 'TEXTAREA']
  ])('%s label is associated with its control', (labelText, id, tagName) => {
    const ContactPage = require('../ContactPage').default;
    renderAt('/contact', <ContactPage />);

    const control = screen.getByLabelText(labelText);
    expect(control.id).toBe(id);
    expect(control.tagName).toBe(tagName);
    expect(document.querySelector(`label[for="${id}"]`)).not.toBeNull();
  });
});
