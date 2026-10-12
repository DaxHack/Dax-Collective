import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { EnvelopeIcon } from '@heroicons/react/24/outline';

const TOPICS = [
  'General question',
  'Brand collaboration',
  'God\'s Vessel — product / waitlist',
  'Dax the Traveler — travel inquiry',
  'Time-Zone Travelers — itinerary help',
  'AniDax — content / commentary',
  'Press or media',
  'Something else',
];

// There is no backend contact endpoint, so this form does not send anything
// itself. It prepares a draft in the visitor's own email app and says so; it
// never claims a message was received.
const CONTACT_EMAIL = 'hello@daxcollective.com';

const buildMailto = ({ name, email, topic, message }) => {
  const subject = `[Dax Collective] ${topic || 'General question'}`;
  const body = [message, '', name ? `— ${name}` : null, `Reply to: ${email}`]
    .filter((line) => line !== null)
    .join('\n');
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', topic: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.message) {
      setError('Email and message are required.');
      return;
    }
    setError('');
    window.location.href = buildMailto(form);
    setSubmitted(true);
  };

  return (
    <>
      <Helmet>
        <title>Contact — Dax Collective</title>
        <meta
          name="description"
          content="Get in touch with Dax Collective. Collaborations, questions, God's Vessel waitlist, and more."
        />
      </Helmet>

      <div className="min-h-screen bg-black text-white">
        <div className="max-w-2xl mx-auto px-6 py-16">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-3">
              Get in Touch
            </p>
            <h1 className="text-4xl font-bold text-white mb-4">Contact</h1>
            <p className="text-gray-400">
              For collaborations, questions about any of our brands, or to get in touch with the
              team. We read everything.
            </p>
          </div>

          {submitted ? (
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-10 text-center">
              <EnvelopeIcon className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Finish in your email app</h2>
              <p className="text-gray-400">
                We opened a draft addressed to{' '}
                <span className="text-white">{CONTACT_EMAIL}</span>. Your message is not sent until
                you send it from there.
              </p>
              <p className="mt-3 text-gray-400 text-sm">
                Nothing opened?{' '}
                <a href={buildMailto(form)} className="text-blue-400 hover:underline">
                  Open the draft again
                </a>{' '}
                or email us directly at that address.
              </p>
              <button
                onClick={() => { setSubmitted(false); setForm({ name: '', email: '', topic: '', message: '' }); }}
                className="mt-6 text-sm text-blue-400 hover:underline"
              >
                Write another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Name <span className="text-gray-500">(optional)</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Topic</label>
                <select
                  name="topic"
                  value={form.topic}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="">Select a topic…</option>
                  {TOPICS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Message <span className="text-red-400">*</span>
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={6}
                  required
                  placeholder="What's on your mind?"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                />
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                <EnvelopeIcon className="h-4 w-4" />
                Continue in Email
              </button>

              <p className="text-xs text-gray-500 text-center">
                This opens a draft in your email app — nothing is sent from this page.
                We do not sell or share contact information.{' '}
                <a href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</a>
              </p>
            </form>
          )}

          <div className="mt-14 pt-8 border-t border-gray-800 grid sm:grid-cols-2 gap-6">
            {[
              {
                label: "God's Vessel — Archive waitlist",
                detail: 'Join via the waitlist form on the God\'s Vessel page.',
                link: '/gods-vessel',
                linkLabel: 'Go to God\'s Vessel →',
              },
              {
                label: 'Collaborations & press',
                detail: 'Use the form above and select "Brand collaboration" or "Press or media."',
                link: null,
                linkLabel: null,
              },
            ].map((item) => (
              <div key={item.label} className="bg-gray-800/30 border border-gray-800 rounded-xl p-5">
                <h3 className="font-semibold text-white mb-1.5">{item.label}</h3>
                <p className="text-gray-400 text-sm">{item.detail}</p>
                {item.link && (
                  <a href={item.link} className="mt-2 block text-sm text-blue-400 hover:underline">
                    {item.linkLabel}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
