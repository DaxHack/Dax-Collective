// src/automation/AggressiveAccelerator.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  RocketLaunchIcon,
  FireIcon,
  BoltIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ChartBarIcon,
  TrophyIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const AggressiveAccelerator = () => {
  const [currentMonth, setCurrentMonth] = useState(1);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [monthlyTarget] = useState([0, 2000, 8000, 20000, 35000, 50000]);

  const aggressiveTimeline = [
    {
      month: 1,
      title: "Foundation Sprint",
      target: "$0 → $2K",
      urgency: "CRITICAL",
      color: "from-red-500 to-orange-500",
      strategies: [
        {
          name: "Emergency $5K System",
          revenue: "$800",
          timeframe: "Week 1-2",
          description: "Implement zero-cost monetization immediately",
          actions: [
            "FREE affiliate blitz (Amazon, Booking.com)",
            "Manual outreach campaign (50+ brands)",
            "Lead magnets with instant upsells",
            "YouTube monetization activation"
          ]
        },
        {
          name: "Viral Content Explosion",
          revenue: "$1,200",
          timeframe: "Week 3-4",
          description: "Scale with viral content + affiliates",
          actions: [
            "TikTok viral machine (3+ posts/day)",
            "Instagram Reels automation",
            "YouTube Shorts optimization",
            "Cross-platform syndication"
          ]
        }
      ]
    },
    {
      month: 2,
      title: "Monetization Explosion",
      target: "$2K → $8K",
      urgency: "HIGH",
      color: "from-orange-500 to-yellow-500",
      strategies: [
        {
          name: "High-Ticket Consulting",
          revenue: "$3,000",
          timeframe: "Week 1-2",
          description: "Premium 1-on-1 services",
          actions: [
            "Travel planning consultation ($200-500/hr)",
            "Content strategy calls ($300/hr)",
            "Brand building coaching ($500/session)",
            "Group coaching programs ($297/month)"
          ]
        },
        {
          name: "Digital Product Empire",
          revenue: "$3,000",
          timeframe: "Week 3-4",
          description: "Scalable product launches",
          actions: [
            "Ultimate Travel Guide Bundle ($97)",
            "Anime Content Creator Course ($297)",
            "Faith & Travel Devotional ($47)",
            "Brand Building Masterclass ($497)"
          ]
        }
      ]
    },
    {
      month: 3,
      title: "Automation & Scale",
      target: "$8K → $20K",
      urgency: "HIGH",
      color: "from-yellow-500 to-green-500",
      strategies: [
        {
          name: "AI Content Factory",
          revenue: "$6,000",
          timeframe: "Week 1-2",
          description: "10x content output automation",
          actions: [
            "AI-generated travel guides (daily)",
            "Automated anime reviews",
            "Daily devotional content",
            "Multi-platform distribution"
          ]
        },
        {
          name: "Brand Partnerships",
          revenue: "$6,000",
          timeframe: "Week 3-4",
          description: "Premium sponsorship deals",
          actions: [
            "Travel gear partnerships ($1K-5K)",
            "Anime brand collaborations",
            "Christian lifestyle sponsors",
            "Recurring partnership deals"
          ]
        }
      ]
    },
    {
      month: 4,
      title: "Optimization",
      target: "$20K → $35K",
      urgency: "MEDIUM",
      color: "from-green-500 to-blue-500",
      strategies: [
        {
          name: "International Expansion",
          revenue: "$7,500",
          timeframe: "Week 1-2",
          description: "Global market penetration",
          actions: [
            "Multi-language content",
            "International affiliate programs",
            "Global sponsorship outreach",
            "Currency-specific pricing"
          ]
        },
        {
          name: "Premium Tiers",
          revenue: "$7,500",
          timeframe: "Week 3-4",
          description: "High-value service packages",
          actions: [
            "VIP travel planning ($5K-10K)",
            "Mastermind programs ($2,997)",
            "Done-for-you services ($5K+)",
            "Exclusive membership tiers"
          ]
        }
      ]
    },
    {
      month: 5,
      title: "Maximize",
      target: "$35K → $50K+",
      urgency: "OPTIMIZE",
      color: "from-blue-500 to-purple-500",
      strategies: [
        {
          name: "Enterprise Partnerships",
          revenue: "$10,000",
          timeframe: "Week 1-2",
          description: "Large-scale business deals",
          actions: [
            "Tourism board partnerships",
            "Hotel chain collaborations",
            "Airline sponsorship deals",
            "Travel app integrations"
          ]
        },
        {
          name: "Automated Sales Systems",
          revenue: "$5,000",
          timeframe: "Week 3-4",
          description: "24/7 revenue generation",
          actions: [
            "Advanced sales funnels",
            "Retargeting campaigns",
            "Affiliate recruitment program",
            "Passive income streams"
          ]
        }
      ]
    }
  ];

  const weeklyMilestones = [
    { week: 1, revenue: 200, milestone: "First affiliate sales" },
    { week: 2, revenue: 800, milestone: "Emergency system working" },
    { week: 3, revenue: 1200, milestone: "Viral content success" },
    { week: 4, revenue: 2000, milestone: "Month 1 target hit" },
    { week: 6, revenue: 4000, milestone: "Consulting launched" },
    { week: 8, revenue: 8000, milestone: "Month 2 target hit" },
    { week: 10, revenue: 12000, milestone: "AI factory scaling" },
    { week: 12, revenue: 20000, milestone: "Month 3 target hit" },
    { week: 14, revenue: 25000, milestone: "International expansion" },
    { week: 16, revenue: 35000, milestone: "Month 4 target hit" },
    { week: 18, revenue: 42000, milestone: "Enterprise deals" },
    { week: 20, revenue: 50000, milestone: "$50K ACHIEVED!" }
  ];

  const currentMonthData = aggressiveTimeline[currentMonth - 1];
  const progressToTarget = currentMonth <= 5 ? (totalRevenue / monthlyTarget[currentMonth]) * 100 : 100;

  return (
    <div className="space-y-6">
      {/* Aggressive Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 rounded-xl p-6 text-white"
      >
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center space-x-2">
            <FireIcon className="w-8 h-8 animate-pulse" />
            <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
              AGGRESSIVE MODE
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold">$50K IN 4-5 MONTHS</h1>
            <p className="text-orange-100">Maximum velocity growth system</p>
          </div>
          <div className="ml-auto text-right">
            <div className="text-3xl font-bold">${totalRevenue.toLocaleString()}</div>
            <div className="text-sm text-orange-100">of $50,000 goal</div>
            <div className="text-xs text-yellow-200 font-bold">MONTH {currentMonth}/5</div>
          </div>
        </div>
        
        <div className="w-full bg-red-800/50 rounded-full h-6 mb-4">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(totalRevenue / 50000) * 100}%` }}
            className="bg-gradient-to-r from-yellow-400 to-white h-6 rounded-full"
          />
        </div>
        
        <div className="grid grid-cols-5 gap-4 text-center">
          {monthlyTarget.slice(1).map((target, index) => (
            <div key={index} className={`p-2 rounded-lg ${currentMonth === index + 1 ? 'bg-white/20' : 'bg-white/10'}`}>
              <div className="text-lg font-bold">${(target/1000).toFixed(0)}K</div>
              <div className="text-xs text-orange-100">Month {index + 1}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Current Month Focus */}
      {currentMonthData && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-800 rounded-xl p-6 border-2 border-orange-500"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-lg bg-gradient-to-r ${currentMonthData.color}`}>
                <RocketLaunchIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Month {currentMonth}: {currentMonthData.title}</h3>
                <p className="text-gray-400">{currentMonthData.target}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                currentMonthData.urgency === 'CRITICAL' ? 'bg-red-600 text-white animate-pulse' :
                currentMonthData.urgency === 'HIGH' ? 'bg-orange-600 text-white' :
                currentMonthData.urgency === 'MEDIUM' ? 'bg-yellow-600 text-black' :
                'bg-green-600 text-white'
              }`}>
                {currentMonthData.urgency}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {currentMonthData.strategies.map((strategy, index) => (
              <div key={index} className="bg-gray-700 rounded-lg p-4 border border-orange-500/30">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-white text-lg">{strategy.name}</h4>
                  <div className="text-right">
                    <div className="text-green-400 font-bold">{strategy.revenue}</div>
                    <div className="text-xs text-gray-400">{strategy.timeframe}</div>
                  </div>
                </div>
                <p className="text-gray-300 text-sm mb-3">{strategy.description}</p>
                <ul className="space-y-1">
                  {strategy.actions.map((action, actionIndex) => (
                    <li key={actionIndex} className="text-xs text-gray-400 flex items-center space-x-2">
                      <div className="w-1 h-1 bg-orange-500 rounded-full"></div>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 20-Week Milestone Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 rounded-xl p-6"
      >
        <h3 className="text-xl font-bold text-white mb-4">20-Week Milestone Timeline</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {weeklyMilestones.map((milestone, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border-2 transition-all ${
                milestone.week <= 4 
                  ? 'border-green-500 bg-green-500/10' 
                  : 'border-gray-600 bg-gray-700/50'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-400">Week {milestone.week}</span>
                <span className="text-sm font-bold text-green-400">${(milestone.revenue/1000).toFixed(0)}K</span>
              </div>
              <div className="text-sm text-white">{milestone.milestone}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Key Success Factors */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 rounded-xl p-6"
      >
        <h3 className="text-xl font-bold text-white mb-4">🚀 Success Accelerators</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-red-600/20 border border-red-500 rounded-lg p-4 text-center">
            <BoltIcon className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <div className="text-lg font-bold text-white">4x Speed</div>
            <div className="text-sm text-red-300">Multi-brand strategy</div>
          </div>
          <div className="bg-orange-600/20 border border-orange-500 rounded-lg p-4 text-center">
            <RocketLaunchIcon className="w-8 h-8 text-orange-400 mx-auto mb-2" />
            <div className="text-lg font-bold text-white">Zero Cost</div>
            <div className="text-sm text-orange-300">100% profit margins</div>
          </div>
          <div className="bg-yellow-600/20 border border-yellow-500 rounded-lg p-4 text-center">
            <ChartBarIcon className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-lg font-bold text-white">24/7 Auto</div>
            <div className="text-sm text-yellow-300">Passive income systems</div>
          </div>
          <div className="bg-green-600/20 border border-green-500 rounded-lg p-4 text-center">
            <TrophyIcon className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <div className="text-lg font-bold text-white">Proven</div>
            <div className="text-sm text-green-300">15 countries experience</div>
          </div>
        </div>
      </motion.div>

      {/* Emergency Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-red-600 to-orange-600 rounded-xl p-6"
      >
        <h3 className="text-xl font-bold text-white mb-4">🚨 IMPLEMENT THIS WEEK</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <button className="bg-white/20 hover:bg-white/30 border border-white/50 text-white px-6 py-3 rounded-lg font-semibold transition-all">
            🔥 Launch Emergency $5K System
          </button>
          <button className="bg-white/20 hover:bg-white/30 border border-white/50 text-white px-6 py-3 rounded-lg font-semibold transition-all">
            📱 Start Viral Content Machine
          </button>
          <button className="bg-white/20 hover:bg-white/30 border border-white/50 text-white px-6 py-3 rounded-lg font-semibold transition-all">
            💰 Setup High-Ticket Consulting
          </button>
          <button className="bg-white/20 hover:bg-white/30 border border-white/50 text-white px-6 py-3 rounded-lg font-semibold transition-all">
            🤖 Activate AI Content Factory
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AggressiveAccelerator;

