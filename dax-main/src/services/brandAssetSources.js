const unsplashLicense = {
  sourceName: 'Unsplash',
  sourceUrl: 'https://unsplash.com/license',
  licenseLabel: 'Unsplash free-use license'
};

const travelStockPools = {
  timezoneHero: [
    {
      url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1920&q=80',
      alt: 'Traveler planning a route with a map and camera',
      ...unsplashLicense
    },
    {
      url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1920&q=80',
      alt: 'Open landscape road trip view at golden hour',
      ...unsplashLicense
    }
  ],
  timezoneVideo: [
    {
      url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
      alt: 'Scenic road trip landscape',
      ...unsplashLicense
    },
    {
      url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80',
      alt: 'Lake and mountains travel route',
      ...unsplashLicense
    },
    {
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      alt: 'Tropical beach destination',
      ...unsplashLicense
    },
    {
      url: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1200&q=80',
      alt: 'Travelers exploring a city viewpoint',
      ...unsplashLicense
    }
  ],
  itinerary: [
    {
      url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80',
      alt: 'Tokyo city crossing and skyline',
      ...unsplashLicense
    },
    {
      url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
      alt: 'Paris Eiffel Tower city view',
      ...unsplashLicense
    },
    {
      url: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=80',
      alt: 'Bangkok city and temple travel scene',
      ...unsplashLicense
    }
  ],
  daxTravelerDestination: [
    {
      url: 'https://images.unsplash.com/photo-1579687196544-08ae8b3a6c1f?auto=format&fit=crop&w=1920&q=80',
      alt: 'Colorful Caribbean street scene',
      ...unsplashLicense
    },
    {
      url: 'https://images.unsplash.com/photo-1583766395091-2eb9994ed094?auto=format&fit=crop&w=1920&q=80',
      alt: 'Adventure travel in a tropical forest',
      ...unsplashLicense
    },
    {
      url: 'https://images.unsplash.com/photo-1580237072617-771c3ecc4a24?auto=format&fit=crop&w=1920&q=80',
      alt: 'Caribbean coastal travel destination',
      ...unsplashLicense
    }
  ]
};

const editorialAnimeFallback = [
  {
    id: 'fallback-rezero',
    title: 'Re:Zero - Starting Life in Another World',
    rating: 9,
    genre: ['Fantasy', 'Drama', 'Psychological'],
    episodes: 'Editorial reference',
    description: 'A character-driven time-loop story used here as editorial review context for Ani-Dax.',
    status: 'Editorial Pick',
    imageUrl: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx21355-wFZ0l7Qz0S5g.jpg',
    sourceName: 'AniList',
    sourceUrl: 'https://anilist.co/anime/21355/ReZERO-Starting-Life-in-Another-World/',
    usageNote: 'Editorial cover reference. Rights remain with the original owners.'
  },
  {
    id: 'fallback-frieren',
    title: "Frieren: Beyond Journey's End",
    rating: 10,
    genre: ['Fantasy', 'Adventure', 'Drama'],
    episodes: 'Editorial reference',
    description: 'A thoughtful fantasy reference for tone, pacing, and long-form review structure.',
    status: 'Editorial Pick',
    imageUrl: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx154587-gHSraOSa0nBG.jpg',
    sourceName: 'AniList',
    sourceUrl: 'https://anilist.co/anime/154587/Frieren-Beyond-Journeys-End/',
    usageNote: 'Editorial cover reference. Rights remain with the original owners.'
  },
  {
    id: 'fallback-solo-leveling',
    title: 'Solo Leveling',
    rating: 8,
    genre: ['Action', 'Fantasy'],
    episodes: 'Editorial reference',
    description: 'A high-energy action reference for seasonal hype and animation-quality commentary.',
    status: 'Editorial Pick',
    imageUrl: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx151807-12QdwxFK1fBH.jpg',
    sourceName: 'AniList',
    sourceUrl: 'https://anilist.co/anime/151807/Solo-Leveling/',
    usageNote: 'Editorial cover reference. Rights remain with the original owners.'
  }
];

const animeReviewFallback = [
  {
    id: 'review-demon-slayer',
    title: 'Demon Slayer: Hashira Training Arc',
    rating: 7,
    review: 'Visually stunning as always, but the pacing felt more like setup than payoff. Strong for character moments and animation craft.',
    pros: ['Incredible animation', 'Great character moments', 'Beautiful visual direction'],
    cons: ['Slow pacing', 'Limited plot progression', 'Setup-heavy season'],
    imageUrl: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx166240-k0d6OytVcVav.jpg',
    sourceName: 'AniList',
    sourceUrl: 'https://anilist.co/search/anime?search=Demon%20Slayer%20Hashira%20Training'
  },
  {
    id: 'review-jujutsu-kaisen',
    title: 'Jujutsu Kaisen Season 2',
    rating: 9,
    review: 'A benchmark modern shonen season with sharp emotional turns, heavy stakes, and strong visual execution.',
    pros: ['Top-tier animation', 'Emotional storytelling', 'Memorable arc structure'],
    cons: ['Brutal pacing swings', 'Heavy tonal load'],
    imageUrl: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx145064-mE01F4LuPN8d.jpg',
    sourceName: 'AniList',
    sourceUrl: 'https://anilist.co/anime/145064/JUJUTSU-KAISEN-Season-2/'
  }
];

const getPoolItem = (poolName, index = 0) => {
  const pool = travelStockPools[poolName] || travelStockPools.timezoneHero;
  return pool[index % pool.length];
};

const stripHtml = (value = '') => value.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

export const getTravelImage = getPoolItem;

export const getDaxTravelerDestinationAssets = () => travelStockPools.daxTravelerDestination;

export const buildTimeZoneTravelersData = (baseData) => ({
  ...baseData,
  quickItineraries: baseData.quickItineraries.map((itinerary, index) => {
    const image = getPoolItem('itinerary', index);
    return {
      ...itinerary,
      imageUrl: image.url,
      imageAlt: image.alt,
      imageSourceName: image.sourceName,
      imageSourceUrl: image.sourceUrl,
      imageLicenseLabel: image.licenseLabel
    };
  }),
  videos: baseData.videos.map((video, index) => {
    const image = getPoolItem('timezoneVideo', index);
    return {
      ...video,
      thumbnail: image.url,
      thumbnailAlt: image.alt,
      imageSourceName: image.sourceName,
      imageSourceUrl: image.sourceUrl,
      imageLicenseLabel: image.licenseLabel
    };
  })
});

const getAnimeSeason = (date = new Date()) => {
  const month = date.getMonth() + 1;
  if (month <= 3) return 'WINTER';
  if (month <= 6) return 'SPRING';
  if (month <= 9) return 'SUMMER';
  return 'FALL';
};

const mapAniListMedia = (media, index) => ({
  id: media.id,
  title: media.title?.english || media.title?.romaji || 'Untitled anime',
  rating: media.averageScore ? Math.round(media.averageScore / 10) : 8,
  genre: (media.genres || []).slice(0, 3),
  episodes: `${media.episodes || 'TBA'} episodes - ${String(media.status || 'Current').replace(/_/g, ' ')}`,
  description: stripHtml(media.description).slice(0, 170) || 'Current-season anime reference for Ani-Dax editorial coverage.',
  status: index < 2 ? 'Watching' : 'Tracking',
  imageUrl: media.coverImage?.extraLarge || media.coverImage?.large || media.bannerImage,
  sourceName: 'AniList',
  sourceUrl: media.siteUrl,
  usageNote: 'Editorial cover reference. Rights remain with the original owners.'
});

export const fetchCurrentAnimeReferences = async ({ date = new Date(), limit = 6 } = {}) => {
  const season = getAnimeSeason(date);
  const seasonYear = date.getFullYear();
  const query = `
    query CurrentSeasonAnime($season: MediaSeason, $seasonYear: Int, $limit: Int) {
      Page(page: 1, perPage: $limit) {
        media(type: ANIME, season: $season, seasonYear: $seasonYear, sort: TRENDING_DESC, isAdult: false) {
          id
          title { romaji english }
          coverImage { extraLarge large color }
          bannerImage
          genres
          episodes
          status
          averageScore
          description(asHtml: false)
          siteUrl
        }
      }
    }
  `;

  const response = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      query,
      variables: {
        season,
        seasonYear,
        limit
      }
    })
  });

  if (!response.ok) {
    throw new Error(`AniList request failed with ${response.status}`);
  }

  const payload = await response.json();
  const media = payload?.data?.Page?.media || [];

  if (!media.length) {
    return editorialAnimeFallback;
  }

  return media.map(mapAniListMedia).filter((anime) => anime.imageUrl);
};

export const buildAniDaxData = (baseData, animeReferences = editorialAnimeFallback) => {
  const referenceList = animeReferences.length ? animeReferences : editorialAnimeFallback;
  const reviews = animeReviewFallback.map((review, index) => ({
    ...review,
    imageUrl: review.imageUrl || referenceList[index % referenceList.length].imageUrl
  }));

  return {
    ...baseData,
    hottestThisSeason: referenceList.slice(0, 6),
    animeReviews: reviews,
    trendingNow: referenceList.slice(0, 5).map((anime, index) => ({
      title: anime.title,
      rank: index + 1,
      status: anime.status === 'Editorial Pick' ? 'Reference' : 'Ongoing',
      sourceUrl: anime.sourceUrl
    })),
    videos: baseData.videos.map((video, index) => {
      const anime = referenceList[index % referenceList.length];
      return {
        ...video,
        title: video.title.includes('Seasonal') ? `${anime.title} First Look` : video.title,
        thumbnail: anime.imageUrl,
        thumbnailAlt: `${anime.title} editorial cover reference`,
        imageSourceName: anime.sourceName,
        imageSourceUrl: anime.sourceUrl
      };
    })
  };
};

export const getFallbackAnimeReferences = () => editorialAnimeFallback;
