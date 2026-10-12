// src/data/editorial/blogDrafts.js
//
// EDITORIAL SOURCE MATERIAL — NOT PUBLISHED.
//
// These are draft blog entries. They include first-person travel accounts,
// dates, prices and budget figures that Daniel has not yet verified, so they
// must not be shown to visitors as fact.
//
// Nothing in the application imports this file, which keeps the drafts out
// of the production bundle entirely. Do not import it from a page, a
// component or blogData.js.
//
// To publish a piece:
//   1. Review the text and correct anything that is not accurate.
//   2. Move the entry into PUBLISHED_ENTRIES in ../blogData.js.
//   3. Set status: 'published' and verified: true on it.

export const BLOG_DRAFT_ENTRIES = [
  {
    id: 1,
    slug: 'old-san-juan-color-salt-silence',
    status: 'draft',
    verified: false,
    title: 'Old San Juan: Color, Salt, and Silence',
    brand: 'dax-the-traveler',
    category: 'From the Vlog',
    excerpt: 'A solo walk through cobblestone streets that taught me how to slow down on the road.',
    body: `There is a specific kind of quiet you only find in a city that does not need to prove itself to you.

Old San Juan has that. The streets are narrow enough that cars feel like guests. The buildings are painted in colors that have no business being that vivid — ochre, coral, turquoise, pale blue — and somehow they work together.

I arrived on a Tuesday, which I recommend. The cruise ships had not docked yet. The plaza near the cathedral was mostly locals. An old man was feeding pigeons with what looked like the bottom crust of a pan de agua.

I had no itinerary.

That was the whole experiment. I had spent years building perfectly timed travel days — 9am here, noon there, afternoon nap at the hotel, dinner at 7. San Juan was my first attempt at moving without a map.

**What I noticed walking without a plan:**

The forts make more sense from the outside. El Morro is iconic from a distance. Up close, the grass field between you and the walls is the point — not the walls. I sat in the grass for forty minutes and watched kites fly.

The water is actually that color. I know you've seen the photos. It is actually that color.

The food stalls near La Perla are not for tourists and they're not trying to be. I had the best mofongo of the trip at a spot with no Instagram presence and three plastic chairs. The woman running it spoke zero English and I spoke just enough Spanish to say "one, please" and point.

**What I wish I had known:**

Wear something you can sweat in. The humidity is a second climate — not a discomfort, a feature. Lean into it.

The uphill streets are steep. Budget your energy if you're walking the old city end to end.

Most of the restaurants on the main drag are fine. The better ones are one block off any main road.

Go slow. This city rewards pace.`,
    heroImage: '/images/dax-cuba-flipped.jpg',
    heroFallback:
      'https://images.unsplash.com/photo-1579687196544-08ae8b3a6c1f?auto=format&fit=crop&w=1400&q=80',
    tags: ['solo trip', 'first time', 'culture', 'Puerto Rico'],
    cta: {
      label: 'Watch the vlog',
      href: 'https://youtube.com/@DaxTheTraveler',
    },
    relatedResources: [
      { label: 'Old San Juan walking map (free PDF)', href: '#' },
      { label: 'Budget breakdown: PR trip', href: '#' },
    ],
    publishedAt: '2024-11-10',
  },
  {
    id: 2,
    slug: 'cuba-on-a-budget-40-a-day',
    status: 'draft',
    verified: false,
    title: 'Cuba on a Budget: $40 a Day, Real Talk',
    brand: 'dax-the-traveler',
    category: 'Wanderlost with Dax',
    excerpt: 'No tourist traps, no resorts. Just casas, classic cars, and the best mojito of my life.',
    body: `The number one question I get about Cuba is: "Is it actually affordable?" Yes. $40 a day is not only possible — it's comfortable if you know where to spend and where not to.

Let me break down how I did it.

**Accommodation: Casas Particulares (~$20-25/night)**

Forget the hotels. Casas particulares are private rooms in Cuban homes, regulated by the government, completely legal for tourists. You get a room, usually breakfast, and a host who will tell you everything the guidebook won't.

My casa in Vedado was $22/night. Included breakfast — eggs, fresh fruit, strong coffee, toast. My host, Rosa, kept the neighborhood cats fed and gave better directions than Google Maps.

**Food: Paladares over tourist restaurants (~$5-8/day for food)**

Paladares are private restaurants — family-run, small, better food, real prices. The state-run tourist spots charge tourist prices and the food is noticeably worse.

I ate lunch every day for under $3. Congris (rice and black beans), ropa vieja (shredded beef stew), fried plantains. Simple, heavy, honest food.

The best mojito of my life was $1.50 at a street cart outside the Museum of the Revolution. I'm not being dramatic.

**Transport: Shared taxis and walking (~$3-5/day)**

Classic American cars are the taxis. Most tourists pay tourist rates for a private ride. The better move is shared taxis (colectivos) — you pile in with locals going the same direction and pay a fraction.

Old Havana is walkable if you're comfortable in heat. I walked most of it.

**The honest part:**

Cuba is not easy travel. Internet is limited. Cash is the only option (bring enough — you cannot access US bank accounts). Some things are genuinely frustrating.

But it is one of the most visually and culturally dense places I have been. The peeling buildings are beautiful. The music is constant. The people are direct in the best way.

$40/day. Bring cash. Stay in casas. Eat at paladares. Go slow.`,
    heroImage: '/images/me smiling cuba.jpg',
    heroFallback:
      'https://images.unsplash.com/photo-1580237072617-771c3ecc4a24?auto=format&fit=crop&w=1400&q=80',
    tags: ['budget', 'food', 'solo trip', 'Cuba'],
    cta: {
      label: 'Watch the Cuba vlog',
      href: 'https://youtube.com/@DaxTheTraveler',
    },
    relatedResources: [
      { label: 'Cuba packing list', href: '#' },
      { label: 'How to get Cuban pesos as an American', href: '#' },
    ],
    publishedAt: '2024-10-18',
  },
  {
    id: 3,
    slug: 'above-the-canopy-first-zipline',
    status: 'draft',
    verified: false,
    title: 'Above the Canopy: My First Zipline',
    brand: 'dax-the-traveler',
    category: 'Quick Jumps',
    excerpt:
      'I am terrified of heights. I went anyway. Here is what happened in the 90 seconds I was airborne.',
    body: `I have been afraid of heights since I was eight years old and climbed a tree I had no business climbing.

The Toro Verde zipline in Puerto Rico is called "The Monster." It is one of the longest ziplines in the world. I booked it before I thought about it too hard.

Here is what the 90 seconds felt like:

**The first three seconds:** Pure terror. You step off a platform, your brain registers that there is nothing below you, and you make a sound you will not repeat in public.

**Seconds four through fifteen:** Your body realizes it is not falling. You are moving horizontally at speed. The terror converts to something that does not have a clean name — not quite adrenaline, not quite peace.

**The rest of it:** You start to see things. The canopy is a texture, not a color. Green is twenty different greens. You can see the ridge of the mountain curving away from you. There is wind you cannot hear over the rushing air, only feel.

And then you land.

The landing is unceremonious. A guy in a harness catches your line and you stop.

That is the whole thing.

I did it three more times that day.

If you're afraid of heights and considering it — go. Not because it will cure you. It won't. Go because you'll find out the thing you're afraid of and the thing itself are not the same thing.`,
    heroImage: '/images/dax-the-traveler.jpg',
    heroFallback:
      'https://images.unsplash.com/photo-1583766395091-2eb9994ed094?auto=format&fit=crop&w=1400&q=80',
    tags: ['adventure', 'first time', 'Puerto Rico', 'heights'],
    cta: {
      label: 'Watch the zipline footage',
      href: 'https://youtube.com/@DaxTheTraveler',
    },
    relatedResources: [
      { label: 'Toro Verde booking tips', href: '#' },
    ],
    publishedAt: '2024-09-22',
  },
  {
    id: 4,
    slug: '5-things-solo-travel-nobody-tells-you',
    status: 'draft',
    verified: false,
    title: '5 Things Nobody Tells You About Solo Travel',
    brand: 'dax-the-traveler',
    category: 'Quick Blips',
    excerpt:
      'Real talk on what solo travel is actually like — not the highlight reel version.',
    body: `1. You will eat more meals alone than you expect, and it will stop bothering you faster than you think.

2. The first day is always the hardest. Every single trip. You get there, you're tired, nothing looks right, you wonder why you came. This passes. Give it 24 hours.

3. People will talk to you more. This sounds counterintuitive — you go alone, you think you'll be more isolated. The opposite happens. Solo travelers are easier to approach. You'll have conversations you never would have had with a group.

4. You will get lost. Not metaphorically — actually lost. This is not a problem. This is usually when the trip gets good.

5. Coming home is stranger than leaving. You've changed slightly. Your apartment hasn't. Give yourself a day before getting back to full speed.`,
    heroImage: '/images/me black shirt.jpg',
    heroFallback:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80',
    tags: ['solo travel', 'tips', 'mindset'],
    cta: {
      label: 'Subscribe for more travel notes',
      href: 'https://youtube.com/@DaxTheTraveler',
    },
    relatedResources: [],
    publishedAt: '2024-08-05',
  },

  {
    id: 5,
    slug: 'honest-cuba-travel-guide-2024',
    status: 'draft',
    verified: false,
    title: 'The Honest Cuba Travel Guide (2024)',
    brand: 'time-zone-travelers',
    category: 'Zone Guides',
    excerpt:
      'Everything the polished travel blogs leave out — cash, connectivity, casas, and what actually matters.',
    body: `Cuba is one of the last genuinely different travel experiences available to Americans. It is also one of the most under-explained.

Here is the guide the polished travel sites don't write because it doesn't photograph well.

**Cash is not optional.**

You cannot access US bank accounts in Cuba. Bring enough cash for your entire trip. A good estimate: your daily budget × days + 20% buffer. Bring it in USD, EUR, or CAD — USD is accepted but at a slightly worse rate post-2021 sanctions.

**Two currencies (sort of).**

Cuba phased out the CUC tourist currency. You now use Cuban pesos (CUP). Exchange at CADECA official exchange houses, not hotels — the hotel rate is consistently worse.

**Internet: limited and expensive.**

Wi-Fi exists only in certain parks, hotels, and approved spots. You buy ETECSA internet cards (1-5 CUC/hour, prices vary). Data is expensive and slow. This is not a bad thing — it makes you present.

Download offline maps before you go. Download your playlists. Bring a book.

**Getting around Havana.**

Three main options: classic car taxis (expensive if you take private), colectivos (shared classic cars, very cheap, ask locals which stop to use), and walking (most of old Havana is walkable).

**What to actually do.**

Skip the Hemingway bar. It's a tourist trap with a famous name and weak drinks.

Go to Fábrica de Arte Cubano on a Thursday night — it's a converted factory turned art-gallery-bar-concert-venue that costs $2 to enter and is one of the best nights out I've had anywhere.

Walk Malecón at sunset. It costs nothing.

Eat at whatever paladar your casa host recommends. They know.

**What to prepare for.**

Shortages are real. Not every store has what you expect. Rolling with this gracefully is part of the trip.

The heat is serious. Start slow.

Be respectful and patient with every bureaucratic interaction. It will serve you.`,
    heroImage: '/images/me smiling cuba.jpg',
    heroFallback:
      'https://images.unsplash.com/photo-1580237072617-771c3ecc4a24?auto=format&fit=crop&w=1400&q=80',
    tags: ['Cuba', 'zone guide', 'budget', 'practical'],
    cta: {
      label: 'Build your Cuba itinerary',
      href: '/timezone-travelers',
    },
    relatedResources: [
      { label: 'Cuba packing checklist (PDF)', href: '#' },
      { label: 'How to exchange money in Cuba', href: '#' },
    ],
    publishedAt: '2024-11-01',
  },
  {
    id: 6,
    slug: 'puerto-rico-budget-itinerary',
    status: 'draft',
    verified: false,
    title: 'How to Build a Puerto Rico Budget Itinerary',
    brand: 'time-zone-travelers',
    category: 'Travel Dispatches',
    excerpt:
      'A practical 5-day framework that works for first-timers — no car rental required.',
    body: `Puerto Rico is one of the most accessible international-feeling trips for US travelers. No passport required, no currency exchange, flights are short from the East Coast. But it can go wrong fast if you plan it like a resort trip.

Here is a 5-day no-car framework built around what actually works.

**Day 1: Old San Juan**
Walk the city without an itinerary. Fort San Felipe del Morro in the morning before it gets crowded. Lunch at a paladar-style restaurant in the back streets. Evening at La Placita — it transitions from market to outdoor bar at sunset naturally.

**Day 2: Condado + Santurce**
Condado is the beach neighborhood. Walk the beach in the morning. Santurce is the arts district — murals, galleries, coffee, the Mercado de Santurce for lunch on Saturday.

**Day 3: El Yunque**
The only tropical rainforest in the US National Forest system. Book a shuttle from San Juan (cheaper than renting a car for one day). La Mina waterfall is crowded; hike a few trails further out for fewer people.

**Day 4: Luquillo + Fajardo**
Luquillo Beach is the best maintained beach on the island. The kioskos (food stalls) on the road in front have every fried food you could want. Fajardo has the bioluminescent bay tour — book Laguna Grande in advance.

**Day 5: Slow day + departure prep**
Coffee and pastries. Visit any spots you missed. The Roberto Clemente Coliseum neighborhood has good street food. Get to the airport early — TSA in SJU can be long.

**Budget breakdown:**
- Accommodation: $60-90/night (Airbnb in Santurce or Condado)
- Food: $20-35/day eating local
- Transport: Public transport + Uber + 1-day shuttle = ~$30-40 for the week
- Activities: Most free except El Yunque ($2/person) and bio bay (~$45)

**Total for 5 days: ~$450-550 USD**`,
    heroImage: '/images/dax-cuba-flipped.jpg',
    heroFallback:
      'https://images.unsplash.com/photo-1579687196544-08ae8b3a6c1f?auto=format&fit=crop&w=1400&q=80',
    tags: ['Puerto Rico', 'itinerary', 'budget', '5 days'],
    cta: {
      label: 'Use the itinerary builder',
      href: '/timezone-travelers',
    },
    relatedResources: [
      { label: '5-day PR template (PDF)', href: '#' },
    ],
    publishedAt: '2024-10-28',
  },
  {
    id: 7,
    slug: 'time-zone-tip-book-first-flight',
    status: 'draft',
    verified: false,
    title: 'Time-Zone Tip: Always Book the First Flight',
    brand: 'time-zone-travelers',
    category: 'Time-Zone Tips',
    excerpt:
      'The single booking decision that saves the most trips. Here is the logic.',
    body: `The first flight of the day is not always the cheapest. But it is the most reliable, and reliability is worth more than the $40 you might save on a midday connection.

Here is why:

**Delays compound.** If the 7am flight is delayed, the airline has all day to fix it. If the 2pm flight is delayed, you are in a chain reaction with every other flight on that aircraft for the rest of the day.

**The first flight typically uses an aircraft that overnighted at that airport.** It is not carrying problems from another city. It has already been through its morning maintenance check. It is starting fresh.

**Connections are safer.** If you have a layover and your first flight is delayed, you have more buffer time to make the connection when you fly early. The airport is also less crowded, which matters more than most people realize.

**The exception:** red-eye flights. If you can sleep on planes, the overnight flight from the East Coast to Europe often outperforms an early morning departure in both price and energy on arrival.

**The rule of thumb:** For domestic trips and short international hops, first flight out. For transatlantic or transpacific routes, evaluate red-eyes on a per-trip basis.`,
    heroImage: '/images/dax-the-traveler.jpg',
    heroFallback:
      'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1400&q=80',
    tags: ['tips', 'flights', 'booking', 'logistics'],
    cta: {
      label: 'More Time-Zone Tips',
      href: '/timezone-travelers',
    },
    relatedResources: [],
    publishedAt: '2024-09-14',
  },

  {
    id: 8,
    slug: 'rezero-season-3-subaru-finally-gets-it',
    status: 'draft',
    verified: false,
    title: 'Re:Zero Season 3 and What Subaru Finally Gets Right',
    brand: 'ani-dax',
    category: 'Anime Files',
    excerpt:
      'Season 3 does something the first two seasons were building toward and most viewers missed until it landed.',
    body: `**This piece contains spoilers for Re:Zero up through Season 3.**

*The views on this page represent editorial commentary and analysis. This is not affiliated with White Fox or Kadokawa. All anime titles referenced are the property of their respective owners. This analysis falls under fair use commentary.*

---

Subaru Natsuki spent two full seasons failing upward. Season 1 gave him the mechanics — Return by Death, the loop, the cost. Season 2 gave him the confrontation — Echidna's trial, the witch cult, the admission that he was a broken person in a world he did not understand. Season 3 is what happens after someone admits what they are.

What the season gets right is patience. It does not rush the payoff.

The early arcs establish that Subaru's relationships have changed not because he changed the external circumstances but because he changed *how he shows up*. The beats are quieter. The loops are shorter. The tension is not "will he survive" but "has he actually learned."

**The Rem arc re-contextualized:**

One of the criticisms of Season 2 was that Rem was sidelined — put to sleep, reduced to a plot device. Season 3 uses her memory loss not as trauma to overcome but as a structural mirror. She encounters Subaru without the accumulated weight of history. She has to form an opinion of him from scratch. And what she forms is complicated.

That's the tell. If Subaru had actually changed, a fresh encounter with him would produce a different result than the one that originally made her devoted to him. The season is interested in whether that is true.

**The Emilia question:**

The show has never fully committed to Emilia as a romantic endpoint — it has committed to Subaru's commitment to her, which is different. Season 3 starts asking what Emilia wants, which is a more interesting question.

**What it still doesn't fully answer:**

The witch cult's broader mythology remains deliberately opaque in ways that feel like deliberate serialization rather than purposeful restraint. This is the one structural frustration that carries over from prior seasons.

**Final read:** Season 3 is the best-written Subaru has ever been. If you dropped off after Season 2, come back.`,
    heroImage: null,
    heroFallback:
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1400&q=80',
    tags: ['Re:Zero', 'season review', 'Subaru', 'analysis'],
    cta: {
      label: 'More Anime Files on AniDax',
      href: '/ani-dax',
    },
    relatedResources: [
      { label: 'Re:Zero character breakdown', href: '#' },
    ],
    publishedAt: '2024-10-05',
  },
  {
    id: 9,
    slug: 'rem-vs-emilia-the-real-arc-battle',
    status: 'draft',
    verified: false,
    title: 'Rem vs. Emilia: The Character Arc Battle Re:Zero Keeps Avoiding',
    brand: 'ani-dax',
    category: 'Character Files',
    excerpt:
      'The debate is not about who Subaru should be with. It is about which character was written with more intention.',
    body: `**Spoilers through Re:Zero Season 3. Fair use commentary.**

*All anime titles and characters referenced are the property of their respective rights holders. This analysis is editorial commentary.*

---

Let's be precise about what this debate actually is.

The "Rem vs. Emilia" conversation that consumes most of the fandom is a shipping argument. That is not what this piece is about. This is a craft argument — which character was constructed with more structural intention, and what does that tell us about how the series understands its own story.

**The case for Rem:**

Rem's arc in Season 1-2 is a complete narrative unit. She starts as someone defined by trauma (her sister, the demon clan, her self-loathing), encounters Subaru at his most pathetic and broken, and makes a choice to love him anyway — not despite his failures, but while fully seeing them. Her confession scene works because she has earned it with thirty episodes of characterization.

Her removal in Season 2 is either the boldest structural move in the series or its worst mistake. I lean toward the former — her absence forces the show to evaluate whether the story can function around Subaru without his most capable ally.

**The case for Emilia:**

Emilia is harder to defend dramatically because the series treats her development as a long runway with delayed returns. Her arc requires patience. Season 2's Subaru trial arc is the payoff — her willingness to face her own history, her growth from "chosen one" passivity to active agency.

The problem is that "patient development" requires the viewer to trust the author. Not all viewers extended that trust, and it is not entirely irrational. There were seasons where Emilia felt like a placeholder more than a person.

**The honest take:**

Rem was written better in the early series. Emilia was written better in the later series. The show improved its ability to write Emilia over time, while Rem's best material front-loaded.

Neither is the better character in absolute terms. They serve different structural functions and the series needs both.

The argument is a proxy for a real question: what kind of anime is Re:Zero trying to be? The Rem camp wants the emotional directness of Season 1. The Emilia camp is betting on a long-game payoff.

Both are reasonable bets.`,
    heroImage: null,
    heroFallback:
      'https://images.unsplash.com/photo-1541562232579-512a800ab8e4?auto=format&fit=crop&w=1400&q=80',
    tags: ['Re:Zero', 'Rem', 'Emilia', 'character analysis'],
    cta: {
      label: 'More Character Files',
      href: '/ani-dax',
    },
    relatedResources: [],
    publishedAt: '2024-09-30',
  },
  {
    id: 10,
    slug: 'anidax-pulse-spring-2024-recap',
    status: 'draft',
    verified: false,
    title: 'AniDax Pulse: Spring 2024 Season Recap',
    brand: 'ani-dax',
    category: 'AniDax Pulse',
    excerpt:
      'What landed, what disappointed, and what one show quietly became the best thing airing.',
    body: `*Standard AniDax disclaimer: All anime titles referenced are the property of their respective rights holders. This is editorial commentary and seasonal analysis.*

---

Every season has a surprise. Spring 2024's surprise was the show that nobody was talking about in week one that had half the community unable to stop talking about by week eight.

**The standout:**

I'm not naming it until you've had the chance to see it unspoiled, but the short version is: if you like anime that takes its premise seriously, builds a world through specific sensory details rather than exposition dumps, and trusts its characters to carry emotional weight without dramatic music swells — it's on Crunchyroll, it finished its run with no filler episodes, and the finale is one of the best single episodes of television (not just anime) I watched this year.

I'll do a full breakdown in the next Anime Files drop.

**What landed:**

The isekai entries this season were largely mediocre with one exception. The exception had a production budget that showed in every fight sequence and a protagonist who was written as competent from the jump rather than "discovering" competence over twelve episodes.

The slice-of-life block was unusually strong. Two shows that would normally fly under mainstream radar built genuine online communities around weekly episode breakdowns. This is the format working the way it's supposed to work.

**What disappointed:**

The sequel season that had been hyped since last year came in under expectations. Not bad — watchable, technically proficient — but the thing that made the original season special was its pacing restraint, and the sequel abandoned that restraint almost immediately. More budget, less soul.

**What I'm carrying into summer:**

Three shows are continuing. One I'll drop after episode one if it doesn't recover. Two have earned another season's worth of trust.

Full summer preview coming next week.`,
    heroImage: null,
    heroFallback:
      'https://images.unsplash.com/photo-1559163499-413811fb2344?auto=format&fit=crop&w=1400&q=80',
    tags: ['seasonal recap', 'Spring 2024', 'AniDax Pulse'],
    cta: {
      label: 'Full AniDax season tracker',
      href: '/ani-dax',
    },
    relatedResources: [],
    publishedAt: '2024-07-01',
  },

  {
    id: 11,
    slug: 'el-shaddai-name-god-gave-abraham',
    status: 'draft',
    verified: false,
    title: 'El Shaddai: The Name God Gave Abraham at 99',
    brand: 'gods-vessel',
    category: 'Names of God: The Dictionary Series',
    excerpt:
      'The first time God calls himself El Shaddai, Abraham is old, childless, and waiting on a promise that has not arrived.',
    body: `**Archive Entry No. 001 — El Shaddai**
*Pronunciation: el shad-DYE*
*Meaning: God Almighty / The All-Sufficient One*
*Scripture: Genesis 17:1*

---

The first time God calls himself El Shaddai, Abraham is ninety-nine years old. He has been waiting twenty-four years on a promise that has not arrived. He tried to solve it himself (Ishmael). That solution created its own complications. And now, at ninety-nine, God shows up again — and introduces himself by a new name.

El Shaddai.

The etymology is debated among Hebrew scholars. The most common root analysis links *Shaddai* to the Hebrew *shadad* (almighty, overpowering) or to *shad* (breast, nourishment — the sufficient one). Both readings illuminate something real about the name. The God who reveals himself here is both powerful enough to do the impossible and sufficient enough to sustain what he has promised.

The grammar of the moment is worth noting. God does not show up at ninety-nine with an explanation for the delay. He shows up with a name — and a command: "Walk before me, and be blameless."

The name precedes the covenant. The self-revelation precedes the instruction.

**What this name carries:**

El Shaddai is used 48 times in the Hebrew Bible — 31 of them in Job. Job is a book about a man who has lost everything and is demanding an audience with God. When God finally answers from the whirlwind, the name hovering over that encounter is the same one given to Abraham: the God who is sufficient, even when circumstances say otherwise.

**For the Archive:**

The No. 001 piece in The Dictionary Series uses El Shaddai as the opening entry because it establishes what the archive is: not a catalog of comfortable names, but a study of who God reveals himself to be at the hardest moments.

Abraham waiting at ninety-nine. Job in the dust. These are the first places this name was spoken.

That is where we start.`,
    heroImage: null,
    heroFallback:
      'https://images.unsplash.com/photo-1544985361-b420d7a77043?auto=format&fit=crop&w=1400&q=80',
    tags: ['El Shaddai', 'names of God', 'Abraham', 'Genesis', 'scripture study'],
    cta: {
      label: 'Join the Archive waitlist',
      href: '/gods-vessel',
    },
    relatedResources: [
      { label: 'Full Archive No. 001 entry', href: '#' },
    ],
    publishedAt: '2024-10-01',
  },
  {
    id: 12,
    slug: 'why-we-started-the-archive',
    status: 'draft',
    verified: false,
    title: 'Why We Started the Archive',
    brand: 'gods-vessel',
    category: 'Archive Notes',
    excerpt:
      'The longer version of how a conversation about clothes turned into a study of the names of God.',
    body: `The God's Vessel archive started with a question about a hoodie.

The question was: why do so many faith-based clothing brands feel the same? Scripture verse in a bold font. Generic cross graphic. A shade of navy blue that has been used on twelve thousand pieces of apparel since 2007.

Nothing wrong with those pieces. But the category as a whole felt like it had given up on design. Like faith content and good design could not coexist.

The premise of the archive is that they can.

**Where the Names of God concept came from:**

The idea emerged from a Bible study conversation about the names of God — specifically how different names were revealed in different moments of crisis. El Shaddai to Abraham in his old age. El Roi to Hagar in the wilderness. Jehovah Jireh to Abraham at Moriah.

Each name is a revelation in context. The name tells you what God showed himself to be *in that specific moment* to *that specific person* in *that specific situation*.

That felt worth studying. Worth wearing.

**What the archive is not:**

It is not a general faith brand. It is not devotional content for its own sake. It is not trying to be the loudest thing in the room.

It is an editorial archive — structured like a study, designed like a product, built to last beyond a single season.

Each entry: an archive number, a name, its etymology, its scripture reference, its theological weight, and a piece designed around it.

We start with six. We go slow. We do it right.

**Phase 1** is El Shaddai, Adonai, and Elohim. Drop details on the waitlist.`,
    heroImage: null,
    heroFallback:
      'https://images.unsplash.com/photo-1476820865390-c52aeebb9891?auto=format&fit=crop&w=1400&q=80',
    tags: ["God's Vessel", 'archive notes', 'brand story', 'faith'],
    cta: {
      label: 'Join the Archive waitlist',
      href: '/gods-vessel',
    },
    relatedResources: [],
    publishedAt: '2024-09-01',
  },
];
