/* eslint-env jest */
// Page-level trust checks for the production release:
//   - waitlist forms are visibly unavailable (never "submitted") when no
//     backend is configured, and show success only after confirmation
//   - the contact form never claims a message was received
//   - /terms is a real Terms page, separate from Privacy and Disclosure

import React from 'react';
import fs from 'fs';
import path from 'path';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// framer-motion's whileInView needs this; jsdom does not provide it.
global.IntersectionObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

const mockWaitlist = {
  isWaitlistAvailable: true,
  WAITLIST_UNAVAILABLE_MESSAGE: 'The waitlist isn’t open for sign-ups yet. Please check back soon.',
  joinWaitlist: jest.fn()
};

jest.mock('../../services/waitlistApi', () => mockWaitlist);

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
  mockWaitlist.isWaitlistAvailable = true;
  mockWaitlist.joinWaitlist.mockReset();
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('God’s Vessel merch waitlist form', () => {
  const renderMerch = () => {
    const GodsVesselMerchPage = require('../GodsVesselMerchPage').default;
    return renderAt('/gods-vessel/merch/001', <GodsVesselMerchPage />, '/gods-vessel/merch/:id');
  };

  test('is disabled with a clear notice when no backend is configured', () => {
    mockWaitlist.isWaitlistAvailable = false;
    renderMerch();

    // The page shows the form more than once; every copy must be disabled.
    screen.getAllByLabelText('Email address').forEach((input) => expect(input).toBeDisabled());
    expect(screen.queryByRole('button', { name: 'Notify Me' })).not.toBeInTheDocument();

    expect(screen.getAllByRole('status')[0]).toHaveTextContent('isn’t open for sign-ups yet');
    expect(screen.getAllByLabelText('Email address')[0]).toBeDisabled();
    const button = screen.getAllByRole('button', { name: 'Opening Soon' })[0];
    expect(button).toBeDisabled();

    fireEvent.submit(button.closest('form'));
    expect(mockWaitlist.joinWaitlist).not.toHaveBeenCalled();
    expect(screen.queryByText(/You’re in the archive/i)).not.toBeInTheDocument();
  });

  test('shows success only after the backend confirms', async () => {
    let confirm;
    mockWaitlist.joinWaitlist.mockImplementation(() => new Promise((resolve) => { confirm = resolve; }));
    renderMerch();

    fireEvent.change(screen.getAllByLabelText('Email address')[0], { target: { value: 'person@example.com' } });
    fireEvent.click(screen.getAllByRole('button', { name: 'Notify Me' })[0]);

    await waitFor(() => expect(mockWaitlist.joinWaitlist).toHaveBeenCalledTimes(1));
    expect(mockWaitlist.joinWaitlist.mock.calls[0][0]).toBe('person@example.com');
    expect(screen.queryByText(/You’re in the archive/i)).not.toBeInTheDocument();

    confirm({ alreadySubscribed: false, created: true });
    expect(await screen.findByText(/You’re in the archive/i)).toBeInTheDocument();
  });

  test('shows the error, not success, when the sign-up fails', async () => {
    mockWaitlist.joinWaitlist.mockRejectedValue(new Error('We couldn’t save your sign-up. Please try again.'));
    renderMerch();

    fireEvent.change(screen.getAllByLabelText('Email address')[0], { target: { value: 'person@example.com' } });
    fireEvent.click(screen.getAllByRole('button', { name: 'Notify Me' })[0]);

    expect(await screen.findByText('We couldn’t save your sign-up. Please try again.')).toBeInTheDocument();
    expect(screen.queryByText(/You’re in the archive/i)).not.toBeInTheDocument();
  });
});

describe('contact form', () => {
  let assignedHref;
  const originalLocation = window.location;

  beforeEach(() => {
    assignedHref = null;
    delete window.location;
    window.location = {
      ...originalLocation,
      set href(value) {
        assignedHref = value;
      },
      get href() {
        return 'http://localhost/contact';
      }
    };
  });

  afterEach(() => {
    window.location = originalLocation;
  });

  test('opens an email draft and never claims the message was received', () => {
    const ContactPage = require('../ContactPage').default;
    renderAt('/contact', <ContactPage />);

    fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'person@example.com' } });
    fireEvent.change(screen.getByPlaceholderText("What's on your mind?"), { target: { value: 'Hello there' } });
    fireEvent.click(screen.getByRole('button', { name: /Continue in Email/i }));

    expect(assignedHref).toMatch(/^mailto:hello@daxcollective\.com\?subject=/);
    expect(decodeURIComponent(assignedHref)).toContain('Hello there');
    expect(decodeURIComponent(assignedHref)).toContain('Reply to: person@example.com');

    expect(screen.getByText('Finish in your email app')).toBeInTheDocument();
    expect(screen.getByText(/not sent until/i)).toBeInTheDocument();
    expect(screen.queryByText(/Message received/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/get back to you/i)).not.toBeInTheDocument();
  });

  test('does nothing without a message', () => {
    const ContactPage = require('../ContactPage').default;
    renderAt('/contact', <ContactPage />);

    fireEvent.submit(screen.getByRole('button', { name: /Continue in Email/i }).closest('form'));

    expect(assignedHref).toBeNull();
    expect(screen.queryByText('Finish in your email app')).not.toBeInTheDocument();
  });
});

describe('legal pages', () => {
  test('/terms renders Terms of Service, not the affiliate disclosure', () => {
    const TermsPage = require('../TermsPage').default;
    renderAt('/terms', <TermsPage />);

    expect(screen.getByRole('heading', { level: 1, name: 'Terms of Service' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 1, name: 'Affiliate Disclosure' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute('href', '/privacy');
    expect(screen.getByRole('link', { name: 'Affiliate Disclosure' })).toHaveAttribute('href', '/disclosure');
  });

  test('App routes /terms, /privacy and /disclosure to three different pages', () => {
    const app = fs.readFileSync(path.join(__dirname, '..', '..', 'App.jsx'), 'utf8');

    expect(app).toMatch(/path="\/terms" element=\{<TermsPage \/>\}/);
    expect(app).toMatch(/path="\/privacy" element=\{<PrivacyPage \/>\}/);
    expect(app).toMatch(/path="\/disclosure" element=\{<DisclosurePage \/>\}/);
    expect(app).not.toMatch(/path="\/terms" element=\{<DisclosurePage \/>\}/);
  });

  test('the footer links Terms, Privacy and Disclosure separately', () => {
    const footer = fs.readFileSync(path.join(__dirname, '..', '..', 'components', 'Footer.jsx'), 'utf8');

    expect(footer).toMatch(/name: 'Terms of Service', to: '\/terms'/);
    expect(footer).toMatch(/name: 'Privacy Policy', to: '\/privacy'/);
    expect(footer).toMatch(/name: 'Affiliate Disclosure', to: '\/disclosure'/);
  });
});
