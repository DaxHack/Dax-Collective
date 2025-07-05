// src/pages/DaxTheTravelerPage.jsx
// PERSONALIZED VERSION - With real photos and enhanced interactivity

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { 
  MapPinIcon, 
  PlayIcon, 
  EyeIcon, 
  HeartIcon, 
  ChatBubbleLeftIcon,
  ArrowTopRightOnSquareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  GlobeAltIcon,
  CameraIcon,
  ShareIcon,
  ArrowDownIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import BrandGallery from '../components/BrandGallery';
import YouTubeIntegration from '../components/YouTubeIntegration';

// Real Dax the Traveler photos (paths should be updated to match your project structure)
const DAX_PHOTOS = {
  profile: '/images/dax/profile.jpeg', // Main profile photo
  profileFallback: '/home/ubuntu/upload/1714962873240.jpeg', // Fallback path for development
  adventures: '/images/dax/adventures.jpg', // Collage of adventures
  adventuresFallback: '/home/ubuntu/upload/FBAdventures.jpg', // Fallback path for development
  logo: '/images/dax/logo.png', // Logo design
  logoFallback: '/home/ubuntu/upload/Untitleddesign(1).png' // Fallback path for development
};

// Travel destinations with real photos
const TRAVEL_DESTINATIONS = [
  {
    name: 'Puerto Rico',
    description: 'Colorful streets and vibrant culture',
    image: '/images/destinations/puerto-rico.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1579687196544-08ae8b3a6c1f?auto=format&fit=crop&w=1920&q=80',
    position: 'center 70%',
    color: 'from-blue-500 to-teal-400'
  },
  {
    name: 'Zipline Adventure',
    description: 'Thrilling heights and breathtaking views',
    image: '/images/destinations/zipline.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1583766395091-2eb9994ed094?auto=format&fit=crop&w=1920&q=80',
    position: 'center 30%',
    color: 'from-green-500 to-emerald-400'
  },
  {
    name: 'Caribbean Exploration',
    description: 'Pristine beaches and historic architecture',
    image: '/images/destinations/caribbean.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1580237072617-771c3ecc4a24?auto=format&fit=crop&w=1920&q=80',
    position: 'center center',
    color: 'from-purple-500 to-indigo-400'
  }
];

// Adventure categories with icons
const ADVENTURE_CATEGORIES = [
  {
    name: 'Urban Exploration',
    icon: '🏙️',
    description: 'Discovering hidden gems in city centers',
    color: 'from-blue-500 to-blue-300'
  },
  {
    name: 'Nature Escapes',
    icon: '🌲',
    description: 'Connecting with the natural world',
    color: 'from-green-500 to-green-300'
  },
  {
    name: 'Cultural Immersion',
    icon: '🏛️',
    description: 'Experiencing local traditions and history',
    color: 'from-amber-500 to-amber-300'
  },
  {
    name: 'Adventure Sports',
    icon: '🧗‍♂️',
    description: 'Pushing limits with thrilling activities',
    color: 'from-red-500 to-red-300'
  }
];

// Travel stats with icons and descriptions
const TRAVEL_STATS = [
  {
    icon: '🌏',
    number: '15+',
    label: 'Countries',
    description: 'Explored across 4 continents',
    color: 'from-blue-500 to-blue-300'
  },
  {
    icon: '🎒',
    number: '100+',
    label: 'Adventures',
    description: 'From mountains to beaches',
    color: 'from-purple-500 to-purple-300'
  },
  {
    icon: '📸',
    number: '1000+',
    label: 'Moments',
    description: 'Captured and shared',
    color: 'from-red-500 to-red-300'
  },
  {
    icon: '🍜',
    number: '50+',
    label: 'Cuisines',
    description: 'Tasted and experienced',
    color: 'from-green-500 to-green-300'
  }
];

const DaxTheTravelerPage = () => {
  // State management
  const [activeTab, setActiveTab] = useState('videos');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videoData, setVideoData] = useState({
    featured: null,
    shorts: [],
    longform: [],
    channelInfo: null,
    statistics: null
  });
  const [currentShortIndex, setCurrentShortIndex] = useState(0);
  const [showNewsletter, setShowNewsletter] = useState(false);
  const [youtubeHelpers, setYoutubeHelpers] = useState(null);
  const [activeDestination, setActiveDestination] = useState(0);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const [activeCategory, setActiveCategory] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Refs for smooth scrolling and parallax effects
  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const videosRef = useRef(null);
  const galleryRef = useRef(null);
  const connectRef = useRef(null);
  const shortsContainerRef = useRef(null);
  const parallaxRef = useRef(null);
  const profileImageRef = useRef(null);

  // Mouse movement for interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Scroll-based animations
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 500], ['0%', '50%']);
  const contentOpacity = useTransform(scrollY, [0, 200, 300, 500], [1, 0.8, 0.6, 0]);
  const contentY = useTransform(scrollY, [0, 500], ['0%', '25%']);
  const profileScale = useTransform(scrollY, [0, 300], [1, 1.1]);
  const profileRotate = useTransform(scrollY, [0, 300], [0, 5]);
  
  // Spring animations for smoother effects
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const profileX = useMotionValue(0);
  const profileY = useMotionValue(0);
  const springX = useSpring(profileX, springConfig);
  const springY = useSpring(profileY, springConfig);

  // Update profile image position based on mouse movement
  useEffect(() => {
    if (profileImageRef.current) {
      profileX.set((mousePosition.x - 0.5) * 20);
      profileY.set((mousePosition.y - 0.5) * 20);
    }
  }, [mousePosition, profileX, profileY]);

  // Scroll to section function
  const scrollToSection = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Handle YouTube data loading
  const handleYouTubeDataLoaded = useCallback((helpers) => {
    if (!helpers) return;
    
    setYoutubeHelpers(helpers);
    
    const brandData = helpers.brandData;
    if (!brandData) return;
    
    const featured = helpers.getFeaturedVideo('dax-traveler');
    const shorts = helpers.getTopShorts('dax-traveler', 3);
    const longform = helpers.getBrandVideos('dax-traveler').filter(v => !v.isShort);
    
    setVideoData({
      featured,
      shorts,
      longform,
      channelInfo: {
        name: brandData.displayName,
        handle: brandData.channelUsername,
        url: `https://youtube.com/@${brandData.channelUsername}`,
      },
      statistics: brandData.stats
    });
    
    setLoading(false);
  }, []);

  // Cycle through destination backgrounds
  useEffect(() => {
    if (loading) return;
    
    const interval = setInterval(() => {
      setActiveDestination((prev) => (prev + 1) % TRAVEL_DESTINATIONS.length);
    }, 7000);
    
    return () => clearInterval(interval);
  }, [loading]);

  // Cycle through adventure categories
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCategory((prev) => (prev + 1) % ADVENTURE_CATEGORIES.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Hide scroll hint after scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowScrollHint(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigate shorts carousel
  const navigateShorts = (direction) => {
    if (!videoData.shorts || videoData.shorts.length === 0) return;
    
    if (direction === 'next') {
      setCurrentShortIndex((prev) => (prev + 1) % videoData.shorts.length);
    } else {
      setCurrentShortIndex((prev) => (prev - 1 + videoData.shorts.length) % videoData.shorts.length);
    }
  };

  // External link handler
  const openExternalLink = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    
    // Track analytics if available
    if (window.gtag) {
      window.gtag('event', 'external_link_click', {
        link_url: url,
        link_domain: new URL(url).hostname
      });
    }
  };

  // Format number for display
  const formatNumber = (num) => {
    if (youtubeHelpers && youtubeHelpers.formatNumber) {
      return youtubeHelpers.formatNumber(num);
    }
    
    if (!num) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  // Stats data with real channel links
  const stats = [
    { 
      number: videoData.longform ? `${videoData.longform.length}+` : '6+', 
      label: 'Adventures', 
      icon: '🌍',
      action: () => scrollToSection(galleryRef),
      link: videoData.channelInfo?.url ? `${videoData.channelInfo.url}/videos` : null
    },
    { 
      number: videoData.statistics ? formatNumber(videoData.statistics.videoCount) : '15+', 
      label: 'Real Stories', 
      icon: '📖',
      action: () => scrollToSection(videosRef),
      link: videoData.channelInfo?.url
    },
    { 
      number: videoData.statistics ? formatNumber(videoData.statistics.subscriberCount) : '100%', 
      label: videoData.statistics ? 'Subscribers' : 'Solo Traveler', 
      icon: videoData.statistics ? '👥' : '🎒',
      action: () => scrollToSection(aboutRef),
      link: videoData.channelInfo?.url ? `${videoData.channelInfo.url}/about` : null
    }
  ];

  // YouTube embed component with real data
  const YouTubeEmbed = ({ video, isShort = false, className = '' }) => {
    if (!video) return null;
    
    const aspectRatio = isShort ? 'aspect-[9/16]' : 'aspect-video';
    
    return (
      <div className={`${aspectRatio} rounded-lg overflow-hidden shadow-lg ${className}`}>
        <iframe
          src={`https://www.youtube.com/embed/${video.videoId}?rel=0&modestbranding=1`}
          title={video.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    );
  };

  // Video card component with enhanced interactivity
  const VideoCard = ({ video, isShort = false, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ 
          scale: 1.03, 
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className={`bg-gray-800/50 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 cursor-pointer group ${isShort ? 'w-64' : ''}`}
        onClick={onClick}
      >
        <div className="relative">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-40 object-cover transition-transform duration-500"
            style={{ 
              transform: isHovered ? 'scale(1.08)' : 'scale(1)'
            }}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x225?text=Dax+The+Traveler';
            }}
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
            <motion.div
              animate={{ 
                scale: isHovered ? 1.2 : 1,
                opacity: isHovered ? 1 : 0.8
              }}
              transition={{ duration: 0.3 }}
            >
              <PlayIcon className="w-12 h-12 text-white" />
            </motion.div>
          </div>
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
            {video.durationFormatted || '0:00'}
          </div>
          {isHovered && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3"
            >
              <p className="text-white text-xs line-clamp-2">
                {video.description?.substring(0, 100) || "Watch this adventure now!"}
              </p>
            </motion.div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="text-white font-semibold text-sm line-clamp-2 mb-2 group-hover:text-blue-400 transition-colors">
            {video.title}
          </h3>
          
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <EyeIcon className="w-3 h-3" />
              <span>{formatNumber(video.viewCount)}</span>
            </div>
            <div className="flex items-center gap-1">
              <HeartIcon className="w-3 h-3" />
              <span>{formatNumber(video.likeCount)}</span>
            </div>
            <div className="flex items-center gap-1">
              <CalendarIcon className="w-3 h-3" />
              <span>{new Date(video.publishedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  // Newsletter signup modal with enhanced design
  const NewsletterModal = () => (
    <AnimatePresence>
      {showNewsletter && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowNewsletter(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gradient-to-br from-gray-900 to-blue-900 rounded-2xl p-8 max-w-md w-full border border-blue-500/30"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="mb-6">
                <img 
                  src={DAX_PHOTOS.logoFallback} 
                  alt="Dax the Traveler" 
                  className="h-16 mx-auto"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/160x80?text=Dax+The+Traveler';
                  }}
                />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4">Join the Adventure!</h3>
              <p className="text-gray-300 mb-6">
                Get exclusive travel tips, behind-the-scenes content, and early access to new adventures.
              </p>
              
              <form className="space-y-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                >
                  Subscribe Now
                </motion.button>
              </form>
              
              <button
                onClick={() => setShowNewsletter(false)}
                className="mt-4 text-gray-400 hover:text-white transition-colors"
              >
                Maybe later
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Destination background component with parallax effect
  const DestinationBackground = ({ destination, active }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: active ? 1 : 0 }}
      transition={{ duration: 1.5 }}
      style={{ 
        backgroundImage: `url(${destination.fallbackImage})`,
        backgroundPosition: destination.position,
        opacity: active ? 1 : 0,
        y: backgroundY
      }}
      className="absolute inset-0 bg-cover bg-center"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-filter backdrop-blur-[2px]"></div>
      
      {active && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="absolute bottom-8 left-8 max-w-xs bg-black/60 backdrop-blur-md p-4 rounded-lg border border-white/10"
        >
          <h3 className={`text-lg font-bold bg-gradient-to-r ${destination.color} bg-clip-text text-transparent`}>
            {destination.name}
          </h3>
          <p className="text-white/80 text-sm">{destination.description}</p>
        </motion.div>
      )}
    </motion.div>
  );

  // Adventure category card component
  const AdventureCategoryCard = ({ category, index, isActive }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: isActive ? 1 : 0.7, 
        scale: isActive ? 1 : 0.95,
        y: isActive ? 0 : 10
      }}
      transition={{ duration: 0.5 }}
      className={`bg-gray-900/70 backdrop-blur-md rounded-xl overflow-hidden shadow-lg border border-gray-800 transition-all duration-300 ${isActive ? 'border-gray-600' : ''}`}
    >
      <div className={`h-2 bg-gradient-to-r ${category.color}`}></div>
      <div className="p-5">
        <div className="text-3xl mb-2">{category.icon}</div>
        <div className="mb-1 font-bold text-white">
          {category.name}
        </div>
        <p className="text-xs text-gray-400">{category.description}</p>
      </div>
    </motion.div>
  );

  // Travel stat card component with enhanced interactivity
  const TravelStatCard = ({ stat, index }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 * index }}
        whileHover={{ 
          scale: 1.05, 
          rotate: -1,
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="bg-gray-900/70 backdrop-blur-md rounded-xl overflow-hidden shadow-lg border border-gray-800 hover:border-gray-700 transition-all duration-300"
      >
        <div className={`h-2 bg-gradient-to-r ${stat.color}`}></div>
        <div className="p-5">
          <motion.div 
            animate={{ 
              scale: isHovered ? 1.2 : 1,
              rotate: isHovered ? 10 : 0
            }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="text-3xl mb-2"
          >
            {stat.icon}
          </motion.div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {stat.number}
            </span>
            <span className="text-sm font-medium text-gray-400">
              {stat.label}
            </span>
          </div>
          <p className="text-xs text-gray-500">{stat.description}</p>
        </div>
      </motion.div>
    );
  };

  // Profile image component with interactive effects
  const ProfileImage = () => (
    <motion.div
      ref={profileImageRef}
      style={{ 
        scale: profileScale,
        rotate: profileRotate,
        x: springX,
        y: springY
      }}
      className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl mx-auto lg:mx-0"
    >
      <img 
        src={DAX_PHOTOS.profileFallback} 
        alt="Dax the Traveler" 
        className="w-full h-full object-cover"
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/400x400?text=Dax';
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <p className="text-white font-bold text-lg">Dax</p>
        <p className="text-white/80 text-sm">The Traveler</p>
      </div>
    </motion.div>
  );

  // Adventures collage component
  const AdventuresCollage = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="relative rounded-xl overflow-hidden shadow-2xl border border-white/10"
    >
      <img 
        src={DAX_PHOTOS.adventuresFallback} 
        alt="Dax's Adventures" 
        className="w-full h-full object-cover"
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/800x600?text=Adventures';
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-white font-bold text-xl mb-1">Real Adventures</h3>
        <p className="text-white/80 text-sm">Authentic experiences around the world</p>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <div className="text-white text-xl">Loading your adventure...</div>
          <div className="text-gray-300 text-sm mt-2">Fetching latest content from YouTube</div>
        </div>
        
        {/* Hidden YouTube integration to load data */}
        <div className="hidden">
          <YouTubeIntegration 
            brandKey="dax-traveler"
            onDataLoaded={handleYouTubeDataLoaded}
            displayMode="compact"
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dax the Traveler | Real Adventures, Authentic Experiences</title>
        <meta name="description" content="Join Dax on incredible solo travel adventures. Real stories, practical tips, and authentic experiences from someone who's been there." />
        <meta name="keywords" content="travel, solo travel, adventure, travel tips, travel vlog, backpacking, travel stories, dax the traveler" />
        <meta property="og:title" content="Dax the Traveler | Real Adventures" />
        <meta property="og:description" content="Real adventures, authentic experiences, and practical travel wisdom from someone who's been there." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={videoData.channelInfo?.url} />
        <meta property="og:image" content={videoData.featured?.thumbnail || DAX_PHOTOS.profileFallback} />
        <link rel="canonical" href={videoData.channelInfo?.url} />
        
        {/* Structured Data for SEO */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Dax the Traveler",
            "url": videoData.channelInfo?.url,
            "sameAs": [
              videoData.channelInfo?.url
            ],
            "jobTitle": "Travel Content Creator",
            "description": "Solo traveler sharing authentic experiences and practical travel wisdom"
          })}
        </script>
      </Helmet>

      <div className="bg-gray-900">
        {/* HERO SECTION WITH PARALLAX AND REAL PHOTOS */}
        <section 
          ref={heroRef} 
          className="relative h-screen overflow-hidden"
        >
          {/* Parallax background images */}
          <div ref={parallaxRef} className="absolute inset-0">
            {TRAVEL_DESTINATIONS.map((destination, index) => (
              <DestinationBackground 
                key={destination.name}
                destination={destination}
                active={index === activeDestination}
              />
            ))}
          </div>
          
          {/* Content overlay */}
          <motion.div 
            className="relative h-full flex flex-col"
            style={{ opacity: contentOpacity, y: contentY }}
          >
            {/* Top navigation bar */}
            <div className="absolute top-0 left-0 right-0 z-10">
              <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center gap-3"
                >
                  <img 
                    src={DAX_PHOTOS.logoFallback} 
                    alt="Dax the Traveler" 
                    className="h-10"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/160x40?text=Dax';
                    }}
                  />
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center gap-6"
                >
                  <button 
                    onClick={() => scrollToSection(aboutRef)}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    About
                  </button>
                  <button 
                    onClick={() => scrollToSection(videosRef)}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Videos
                  </button>
                  <button 
                    onClick={() => scrollToSection(galleryRef)}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Gallery
                  </button>
                  <button 
                    onClick={() => scrollToSection(connectRef)}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Connect
                  </button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => openExternalLink(videoData.channelInfo?.url || '#')}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    <span>📺</span>
                    YouTube
                  </motion.button>
                </motion.div>
              </div>
            </div>
            
            {/* Main hero content */}
            <div className="flex-1 flex items-center justify-center px-4">
              <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Left side - Main heading, profile image and CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-center lg:text-left"
                >
                  <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                    <span className="text-white">Dax</span>
                    <span className="text-blue-400">The</span>
                    <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      Traveler
                    </span>
                  </h1>
                  
                  <div className="flex flex-col lg:flex-row items-center gap-8 mb-8">
                    <ProfileImage />
                    
                    <div>
                      <p className="text-xl text-gray-300 mb-4 max-w-xl">
                        Real adventures, authentic experiences, and practical travel wisdom from someone who's been there.
                      </p>
                      
                      <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => scrollToSection(videosRef)}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg flex items-center gap-2"
                        >
                          <PlayIcon className="w-5 h-5" />
                          Watch Adventures
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setShowNewsletter(true)}
                          className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/20 transition-all duration-300"
                        >
                          Join Newsletter
                        </motion.button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Channel info display */}
                  {videoData.channelInfo && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.8 }}
                      className="mt-4 text-gray-300 flex items-center justify-center lg:justify-start gap-2"
                    >
                      <p className="text-sm">
                        Follow me on YouTube: 
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05, x: 3 }}
                        onClick={() => openExternalLink(videoData.channelInfo.url)}
                        className="text-blue-400 hover:text-blue-300 transition-colors underline flex items-center gap-1"
                      >
                        {videoData.channelInfo.handle}
                        <ArrowRightIcon className="w-3 h-3" />
                      </motion.button>
                    </motion.div>
                  )}
                </motion.div>
                
                {/* Right side - Adventures collage and category cards */}
                <div className="space-y-6">
                  <AdventuresCollage />
                  
                  <div className="grid grid-cols-2 gap-4">
                    {ADVENTURE_CATEGORIES.map((category, index) => (
                      <AdventureCategoryCard 
                        key={category.name}
                        category={category}
                        index={index}
                        isActive={index === activeCategory}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Scroll indicator */}
            <AnimatePresence>
              {showScrollHint && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
                  className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-center"
                >
                  <p className="text-sm mb-2">Scroll to explore</p>
                  <ArrowDownIcon className="w-6 h-6 mx-auto" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </section>

        {/* FEATURED VIDEO SECTION */}
        {videoData.featured && (
          <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-gray-800">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Featured Adventure
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto"></div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-gray-800/30 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                  <div>
                    <YouTubeEmbed video={videoData.featured} />
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-4">
                        {videoData.featured.title}
                      </h3>
                      <p className="text-gray-300 leading-relaxed">
                        {videoData.featured.description?.substring(0, 300)}...
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">
                          {formatNumber(videoData.featured.viewCount)}
                        </div>
                        <div className="text-sm text-gray-400">Views</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-400">
                          {formatNumber(videoData.featured.likeCount)}
                        </div>
                        <div className="text-sm text-gray-400">Likes</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">
                          {videoData.featured.durationFormatted || '0:00'}
                        </div>
                        <div className="text-sm text-gray-400">Duration</div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => openExternalLink(videoData.featured.watchUrl || `https://youtube.com/watch?v=${videoData.featured.videoId}`)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                      >
                        <PlayIcon className="w-5 h-5" />
                        Watch on YouTube
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          navigator.share?.({
                            title: videoData.featured.title,
                            url: videoData.featured.watchUrl || `https://youtube.com/watch?v=${videoData.featured.videoId}`
                          });
                        }}
                        className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors"
                      >
                        <ShareIcon className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* SHORTS SECTION */}
        {videoData.shorts && videoData.shorts.length > 0 && (
          <section ref={videosRef} className="py-20 px-4 bg-gradient-to-b from-gray-800 to-gray-900">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Quick Adventures
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto"></div>
              </motion.div>

              <div className="relative">
                <div 
                  ref={shortsContainerRef}
                  className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 justify-center"
                  style={{ scrollSnapType: 'x mandatory' }}
                >
                  {videoData.shorts.map((video, index) => (
                    <div key={video.videoId} className="flex-shrink-0" style={{ scrollSnapAlign: 'start' }}>
                      <YouTubeEmbed 
                        video={video} 
                        isShort={true} 
                        className="w-64 h-[456px]"
                      />
                      <div className="mt-4 w-64">
                        <h3 className="text-white font-semibold text-sm line-clamp-2 mb-2">
                          {video.title}
                        </h3>
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <span>{formatNumber(video.viewCount)} views</span>
                          <span>{formatNumber(video.likeCount)} likes</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Navigation arrows */}
                {videoData.shorts.length > 1 && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.1, x: -3 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        shortsContainerRef.current?.scrollBy({ left: -280, behavior: 'smooth' });
                      }}
                      className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                    >
                      <ChevronLeftIcon className="w-6 h-6" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1, x: 3 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        shortsContainerRef.current?.scrollBy({ left: 280, behavior: 'smooth' });
                      }}
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                    >
                      <ChevronRightIcon className="w-6 h-6" />
                    </motion.button>
                  </>
                )}
              </div>
            </div>
          </section>
        )}

        {/* LONGFORM VIDEOS SECTION */}
        {videoData.longform && videoData.longform.length > 0 && (
          <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-gray-800">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Travel Adventures
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto"></div>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videoData.longform.slice(0, 6).map((video) => (
                  <VideoCard 
                    key={video.videoId} 
                    video={video} 
                    onClick={() => openExternalLink(video.watchUrl || `https://youtube.com/watch?v=${video.videoId}`)}
                  />
                ))}
              </div>

              {videoData.longform.length > 6 && (
                <div className="text-center mt-8">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => openExternalLink(videoData.channelInfo?.url ? `${videoData.channelInfo.url}/videos` : '#')}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-6 py-3 text-white hover:bg-white/20 transition-all duration-300"
                  >
                    View All Adventures
                  </motion.button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ABOUT SECTION */}
        <section ref={aboutRef} className="py-20 px-4 bg-gradient-to-b from-gray-800 to-gray-900">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                About Dax
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto"></div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-bold text-white mb-4">
                  Solo Traveler & Authentic Storyteller
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  I'm Dax, a passionate solo traveler who believes that the best stories come from stepping outside your comfort zone. Over the past few years, I've explored {videoData.longform?.length || 6}+ destinations, each journey teaching me something new about the world and myself.
                </p>
                <p className="text-gray-300 text-lg leading-relaxed">
                  My mission is simple: share authentic travel experiences that inspire others to explore, while providing practical tips that actually work. No fluff, no fake Instagram moments – just real adventures from someone who's been there.
                </p>

                <div className="grid grid-cols-2 gap-6 mt-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2">
                      {videoData.statistics ? formatNumber(videoData.statistics.videoCount) : videoData.longform?.length || 6}
                    </div>
                    <div className="text-gray-400">Videos Created</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-2">
                      {videoData.statistics ? formatNumber(videoData.statistics.viewCount) : '50K+'}
                    </div>
                    <div className="text-gray-400">Total Views</div>
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => openExternalLink(videoData.channelInfo?.url || '#')}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
                  >
                    <span>📺</span>
                    Subscribe on YouTube
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => scrollToSection(connectRef)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Let's Connect
                  </motion.button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                  <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <GlobeAltIcon className="w-6 h-6 text-blue-400" />
                    Travel Philosophy
                  </h4>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>Authentic experiences over tourist traps</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>Budget-conscious but not cheap</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>Solo travel builds confidence</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>Every mistake is a story</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                  <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <CameraIcon className="w-6 h-6 text-purple-400" />
                    Content Focus
                  </h4>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>Real-time travel vlogs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>Practical travel tips</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>Budget breakdowns</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>Cultural insights</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* GALLERY SECTION */}
        <section ref={galleryRef} className="py-20 px-4 bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Travel Gallery
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto"></div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <BrandGallery 
                brand="dax-the-traveler"
                category="travel"
                maxImages={12}
                layout="grid"
                showControls={true}
                className="mb-8"
              />
            </motion.div>
          </div>
        </section>

        {/* CONNECT SECTION */}
        <section ref={connectRef} className="py-20 px-4 bg-gradient-to-b from-gray-800 to-gray-900">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Let's Connect
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto mb-8"></div>
              
              <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
                Ready to start your own adventure? Have questions about a destination? 
                Want to collaborate? Let's make it happen!
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.03, y: -5 }}
                  className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
                >
                  <div className="text-4xl mb-4">📺</div>
                  <h3 className="text-xl font-bold text-white mb-2">YouTube</h3>
                  <p className="text-gray-300 mb-4">Subscribe for weekly adventures</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => openExternalLink(videoData.channelInfo?.url || '#')}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Subscribe
                  </motion.button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.03, y: -5 }}
                  className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
                >
                  <div className="text-4xl mb-4">📧</div>
                  <h3 className="text-xl font-bold text-white mb-2">Newsletter</h3>
                  <p className="text-gray-300 mb-4">Exclusive tips and updates</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowNewsletter(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Join Now
                  </motion.button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.03, y: -5 }}
                  className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
                >
                  <div className="text-4xl mb-4">🤝</div>
                  <h3 className="text-xl font-bold text-white mb-2">Collaborate</h3>
                  <p className="text-gray-300 mb-4">Brand partnerships welcome</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.location.href = 'mailto:hello@daxcollective.com'}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Get in Touch
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Newsletter Modal */}
        <NewsletterModal />
      </div>
    </>
  );
};

export default DaxTheTravelerPage;

