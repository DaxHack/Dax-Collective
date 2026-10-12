// First-person chronology supplied by Daniel on 2026-10-01.
// CONFIRMED means explicitly supplied by Daniel or supported by inspected media;
// it does not claim independent flight-record verification.
// UNKNOWN means not verified, never that a visit did not occur.
export const EVIDENCE = Object.freeze({
  CONFIRMED: 'CONFIRMED',
  APPROXIMATE: 'APPROXIMATE',
  UNKNOWN: 'UNKNOWN',
});

const { CONFIRMED, APPROXIMATE, UNKNOWN } = EVIDENCE;
const source = 'Daniel’s first-person travel chronology, supplied October 1, 2026';
const fact = (text, status = CONFIRMED) => ({ text, status, source });

const record = (id, year, destination, coordinates, options = {}) => ({
  id, year, destination, coordinates,
  chapterType: 'travel',
  period: String(year),
  facts: [],
  photos: [],
  source,
  ...options,
  evidence: {
    visit: CONFIRMED, year: CONFIRMED, dates: UNKNOWN, duration: UNKNOWN,
    mediaLocation: UNKNOWN, itinerary: UNKNOWN, ...options.evidence,
  },
});

export const personalPhotos = [
  { src: '/images/dax-personal/havana-balcony.webp', alt: 'Daniel on a balcony with Havana behind him', caption: 'Havana, from above.', location: 'Havana, Cuba', locationStatus: CONFIRMED },
  { src: '/images/dax-personal/cuba-classic-car.webp', alt: 'Daniel beside a blue classic car in Cuba', caption: 'A frame beside a blue classic car.', location: 'Cuba', locationStatus: CONFIRMED },
  { src: '/images/dax-personal/havana-city-portrait.webp', alt: 'Daniel with Havana’s Capitol in the background', caption: 'Daniel, with Havana in the frame.', location: 'Havana, Cuba', locationStatus: CONFIRMED },
  { src: '/images/dax-personal/evening-portrait.webp', alt: 'Daniel smiling in a striped shirt', caption: 'From Daniel’s camera roll.', location: 'Location not yet verified', locationStatus: UNKNOWN },
  { src: '/images/dax-personal/open-air-portrait.webp', alt: 'Daniel seated outdoors', caption: 'An open-air portrait.', location: 'Location not yet verified', locationStatus: UNKNOWN },
  { src: '/images/dax-personal/dax-smiling.webp', alt: 'Daniel smiling for a selfie', caption: 'A personal portrait.', location: 'Location not yet verified', locationStatus: UNKNOWN },
  { src: '/images/dax-history/daniel-camera-roll-portrait.jpg', alt: 'Daniel in a black shirt in a personal camera-roll portrait', caption: 'Another frame from Daniel’s camera roll.', location: 'Location not yet verified', locationStatus: UNKNOWN },
];

// Coordinates are approximate public geographic anchors, not Daniel’s GPS records
// or exact itinerary stops. Country-only records use country-level anchors.
export const travelHistory = [
  record('mexico-2019', 2019, 'Mexico', [-102.5, 23.6]),
  record('bahamas-2020', 2020, 'Bahamas', [-77.4, 25.0]),
  record('puerto-rico-2021', 2021, 'Puerto Rico', [-66.4, 18.2]),
  record('dubai-2021', 2021, 'Dubai, UAE', [55.27, 25.20]),
  record('spain-2022', 2022, 'Spain', [-3.7, 40.2]),
  record('los-angeles-2022', 2022, 'Los Angeles, California', [-118.24, 34.05]),
  record('las-vegas-2022', 2022, 'Las Vegas, Nevada', [-115.14, 36.17]),
  record('chicago-2022', 2022, 'Chicago, Illinois', [-87.63, 41.88]),
  record('guatemala-2022', 2022, 'Guatemala', [-90.3, 15.7]),
  record('el-salvador-2022', 2022, 'El Salvador', [-88.9, 13.8]),
  record('germany-2022', 2022, 'Germany', [10.4, 51.2]),
  record('turkey-2022', 2022, 'Turkey', [35.2, 39.0]),
  record('colombia-2022', 2022, 'Colombia', [-73.9, 4.6]),
  record('dominican-republic-2023', 2023, 'Dominican Republic', [-70.2, 18.9]),
  record('bahamas-2023', 2023, 'Bahamas', [-77.4, 25.0], { facts: [fact('A return to the Bahamas, following the 2020 chapter.')] }),
  record('turks-caicos-2023', 2023, 'Turks & Caicos', [-71.8, 21.8]),
  record('cuba-2023', 2023, 'Cuba', [-82.37, 23.11], {
    locationDetail: 'Havana is supported by the inspected personal photographs.',
    photos: personalPhotos.slice(0, 3),
    evidence: { mediaLocation: CONFIRMED },
    facts: [fact('The 2023 Cuba visit is recorded in Daniel’s chronology.'), fact('Personal photographs show Daniel in Havana. Individual capture dates have not been verified.')],
  }),
  record('panama-2023', 2023, 'Panama', [-80.0, 8.5]),
  record('honduras-roatan-2023', 2023, 'Honduras / Roatán', [-86.54, 16.32]),
  record('toronto-2024', 2024, 'Toronto, Canada', [-79.38, 43.65]),
  record('cleveland-2024', 2024, 'Cleveland, Ohio', [-81.69, 41.50], {
    chapterType: 'living-learning',
    period: 'Approximately May–August 2024',
    duration: 'Roughly 3–4 months',
    evidence: { dates: APPROXIMATE, duration: APPROXIMATE },
    facts: [
      fact('A temporary living and learning chapter—not a vacation.'),
      fact('Daniel attended Tech Elevator’s 14-week full-stack Java bootcamp.'),
      fact('He temporarily lived in Cleveland for approximately 3–4 months, around May–August 2024.', APPROXIMATE),
    ],
  }),
  record('peru-2025', 2025, 'Peru', [-77.04, -12.05], {
    period: 'July 2025 · exact travel dates unverified',
    duration: 'Approximately 6–7 days',
    birthday: 'July 26, 2025',
    knownStops: ['Lima'],
    locationDetail: 'Lima is confirmed as part of the trip; the map uses a Lima anchor.',
    evidence: { dates: APPROXIMATE, duration: APPROXIMATE },
    facts: [
      fact('Daniel spent his July 26 birthday in Peru. Lima was part of the trip.'),
      fact('He remembers his birthday occurring around the second day of the trip.', APPROXIMATE),
      fact('The trip lasted approximately 6–7 days. Overall departure and return dates are not established.', APPROXIMATE),
    ],
  }),
  record('ghana-2025', 2025, 'Ghana', [-0.19, 5.60], {
    period: 'September–approximately October 2025',
    arrival: 'September 12, 2025 · Accra',
    arrivalISO: '2025-09-12',
    arrivalStatus: CONFIRMED,
    duration: 'Approximately three weeks / 21 days',
    knownStops: ['Accra', 'Family building project', 'Farm'],
    locationDetail: 'Arrival in Accra is confirmed; this is an arrival-city anchor.',
    evidence: { dates: APPROXIMATE, duration: APPROXIMATE },
    facts: [
      fact('Daniel arrived in Accra on September 12, 2025.'),
      fact('The visit included a family building project and farm.'),
      fact('Ghana was particularly meaningful because it represented one of Daniel’s two new continents during this period.'),
      fact('Approximately three weeks in total, extending into approximately October. The return date is not established.', APPROXIMATE),
    ],
  }),
  record('texas-dreamcon-2026', 2026, 'Texas · DreamCon', [-99.0, 31.0], {
    period: 'Approximately June 2026',
    locationDetail: 'Texas-level map anchor; a specific host city is not established here.',
    evidence: { dates: APPROXIMATE },
    facts: [fact('Daniel attended DreamCon in Texas.'), fact('The remembered period is approximately June 2026; the itinerary dates are not verified.', APPROXIMATE)],
  }),
  record('kenya-2026', 2026, 'Kenya · Nairobi', [36.82, -1.29], {
    period: 'August 2026 · exact travel dates unverified',
    duration: 'Approximately one week',
    knownStops: ['Nairobi', 'London / Heathrow transit'],
    relatedJourney: 'london-2026',
    evidence: { dates: APPROXIMATE, duration: APPROXIMATE },
    facts: [fact('A Nairobi trip with travel through London / Heathrow.'), fact('Approximately one week during August 2026; exact flight dates are not yet supplied.', APPROXIMATE)],
  }),
  record('london-2026', 2026, 'London / United Kingdom', [-0.45, 51.47], {
    chapterType: 'transit',
    period: 'August 2026 · part of the Kenya journey',
    relatedJourney: 'kenya-2026',
    knownStops: ['London / Heathrow transit'],
    locationDetail: 'Heathrow is used as the transit anchor, not as evidence of an independent UK holiday.',
    evidence: { dates: APPROXIMATE },
    facts: [fact('London was part of the Kenya journey / layover.'), fact('This is not presented as a long independent UK vacation. Duration and individual transit dates remain unverified.')],
  }),
];

export const travelYears = [...new Set(travelHistory.map(chapter => chapter.year))];
export const chapterTypeLabels = {
  travel: 'Travel chapter',
  'living-learning': 'Living / learning chapter',
  transit: 'Transit chapter',
};

export const getYearChapters = year => travelHistory.filter(chapter => chapter.year === year);