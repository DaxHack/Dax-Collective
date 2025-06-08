// src/automation/EmergencyMonetization.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BoltIcon,
  FireIcon,
  CurrencyDollarIcon,
  ClockIcon,
  RocketLaunchIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const EmergencyMonetization = () => {
  const [currentDay, setCurrentDay] = useState(1);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [dailyTarget] = useState(83.33); // $5K / 60 days

  const emergencyStrategies = [
    {
      week: "Week 1-2",
      days: "1-14",
      target: "$0-$800",
      urgency: "CRITICAL",
      budget: "100% FREE",
      color: "from-red-500 to-orange-500",
      strategies: [
        {
          name: "FREE Affiliate Blitz",
          revenue: "$200-400",
          timeToImplement: "24 hours",
          cost: "$0",
          description: "Zero-cost affiliate setup across all 4 brands",
          actions: [
            "Amazon Associates (FREE signup)",
            "Booking.com affiliate (FREE)",
            "ShareASale free affiliates",
            "Commission Junction (FREE)"
          ]
        },
        {
          name: "Manual Outreach Campaign",
          revenue: "$300-500",
          timeToImplement: "48 hours",
          cost: "$0", 
          description: "Free cold outreach using templates",
          actions: [
            "Gmail for outreach (FREE)",
            "LinkedIn organic messaging",
            "Instagram DM campaigns",
            "Free email templates"
          ]
        },
        {
          name: "FREE Lead Magnets",
          revenue: "$100-200",
          timeToImplement: "72 hours",
          cost: "$0",
          description: "Free tools for conversion funnels",
          actions: [
            "Canva for free graphics",
            "Google Docs for guides",
            "Mailchimp free tier (2K contacts)",
            "Free landing pages (Carrd)"
          ]
        }
      ]
    },
    {
      week: "Week 3-4", 
      days: "15-28",
      target: "$800-$2K",
      urgency: "HIGH",
      budget: "100% FREE",
      color: "from-orange-500 to-yellow-500",
      strategies: [
        {
          name: "FREE AI Content Factory",
          revenue: "$400-600",
          timeToImplement: "Week 3",
          cost: "$0",
          description: "Free AI tools for 10+ posts daily",
          actions: [
            "ChatGPT free tier",
            "Claude.ai free usage",
            "Canva free templates",
            "Buffer free scheduling"
          ]
        },
        {
          name: "Organic Viral Strategy",
          revenue: "$300-500",
          timeToImplement: "Week 3",
          cost: "$0",
          description: "Zero-cost viral content",
          actions: [
            "TikTok organic growth",
            "Instagram Reels (FREE)", 
            "YouTube Shorts (FREE)",
            "Free trending hashtags"
          ]
        },
        {
          name: "FREE Marketplace Sales",
          revenue: "$500-800",
          timeToImplement: "Week 4",
          cost: "$0",
          description: "Free platform digital sales",
          actions: [
            "Gumroad (FREE tier)",
            "Etsy digital downloads",
            "Facebook Marketplace",
            "Free PDF creation tools"
          ]
        }
      ]
    },
    {
      week: "Week 5-6",
      days: "29-42", 
      target: "$2K-$3.5K",
      urgency: "MEDIUM",
      budget: "100% FREE",
      color: "from-yellow-500 to-green-500",
      strategies: [
        {
          name: "FREE Consulting Setup",
          revenue: "$800-1200",
          timeToImplement: "Week 5",
          cost: "$0",
          description: "Zero-cost high-value services",
          actions: [
            "Calendly free scheduling",
            "Zoom free calls (40 min)",
            "Google Meet (FREE)",
            "Free consultation templates"
          ]
        },
        {
          name: "FREE Digital Empire",
          revenue: "$600-1000",
          timeToImplement: "Week 5-6",
          cost: "$0",
          description: "Free product creation & sales",
          actions: [
            "Google Docs → PDF guides",
            "Canva for course materials",
            "YouTube for free courses",
            "Discord for communities"
          ]
        }
      ]
    },
    {
      week: "Week 7-8",
      days: "43-60",
      target: "$3.5K-$5K+",
      urgency: "OPTIMIZE",
      budget: "100% FREE",
      color: "from-green-500 to-blue-500",
      strategies: [
        {
          name: "FREE Automation Funnels",
          revenue: "$1000-1500",
          timeToImplement: "Week 7",
          cost: "$0",
          description: "Zero-cost 24/7 revenue",
          actions: [
            "Zapier free tier automation",
            "IFTTT free workflows",
            "Free email sequences",
            "Organic retargeting"
          ]
        }
      ]
    }
  ];

  const dailyActions = [
    { day: 1, action: "FREE Amazon Associates signup", revenue: 0, cost: "$0" },
    { day: 2, action: "Manual outreach campaign start", revenue: 50, cost: "$0" },
    { day: 3, action: "Create first FREE lead magnet", revenue: 75, cost: "$0" },
    { day: 4, action: "YouTube monetization (FREE)", revenue: 25, cost: "$0" },
    { day: 5, action: "Launch FREE affiliate campaigns", revenue: 150, cost: "$0" },
    { day: 7, action: "First sponsorship deal (FREE outreach)", revenue: 300, cost: "$0" },
    { day: 10, action: "FREE lead magnet converting", revenue: 200, cost: "$0" },
    { day: 14, action: "Week 1-2 total (ZERO SPENT)", revenue: 800, cost: "$0" },
    { day: 21, action: "FREE AI content scaling", revenue: 400, cost: "$0" },
    { day: 28, action: "Organic viral success", revenue: 800, cost: "$0" },
    { day: 35, action: "FREE consulting launch", revenue: 600, cost: "$0" },
    { day: 42, action: "FREE digital products live", revenue: 800, cost: "$0" },
    { day: 50, action: "FREE automated funnels", revenue: 700, cost: "$0" },
    { day: 60, action: "$5K ACHIEVED - $0 SPENT!", revenue: 5000, cost: "$0" }
  ];

  const progressPercentage = (totalRevenue / 5000) * 100;
  const daysRemaining = 60 - currentDay;

  return (
    <div className="space-y-6">
      {/* Emergency Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 text-white"
      >
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center space-x-2">
            <ExclamationTriangleIcon className="w-8 h-8 animate-pulse" />
            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              $0 BUDGET
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold">ZERO-COST MONETIZATION</h1>
            <p className="text-green-100">60-Day Sprint to $5,000 • No Money Required</p>
          </div>
          <div className="ml-auto text-right">
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <div className="text-sm text-green-100">of $5,000 goal</div>
            <div className="text-xs text-green-200 font-bold">TOTAL SPENT: $0</div>
          </div>
        </div>
        
        <div className="w-full bg-green-800/50 rounded-full h-4 mb-4">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            className="bg-white h-4 rounded-full"
          />
        </div>
        
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold">Day {currentDay}</div>
            <div className="text-sm text-green-100">Current Day</div>
          </div>
          <div>
            <div className="text-2xl font-bold">${dailyTarget.toFixed(0)}</div>
            <div className="text-sm text-green-100">Daily Target</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{daysRemaining}</div>
            <div className="text-sm text-green-100">Days Left</div>
          </div>
          <div>
            <div className="text-2xl font-bold">$0</div>
            <div className="text-sm text-green-100">Total Spent</div>
          </div>
        </div>
      </motion.div>

      {/* Weekly Strategies */}
      <div className="space-y-6">
        {emergencyStrategies.map((week, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${week.color}`}>
                  <FireIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{week.week}</h3>
                  <p className="text-gray-400">Days {week.days} • {week.target}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                  week.urgency === 'CRITICAL' ? 'bg-red-600 text-white' :
                  week.urgency === 'HIGH' ? 'bg-orange-600 text-white' :
                  week.urgency === 'MEDIUM' ? 'bg-yellow-600 text-black' :
                  'bg-green-600 text-white'
                }`}>
                  {week.urgency}
                </div>
                <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  {week.budget}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {week.strategies.map((strategy, stratIndex) => (
                <div key={stratIndex} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-white">{strategy.name}</h4>
                    <div className="flex flex-col items-end">
                      <span className="text-green-400 font-bold text-sm">{strategy.revenue}</span>
                      <span className="text-green-300 font-bold text-xs">{strategy.cost}</span>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm mb-3">{strategy.description}</p>
                  <div className="flex items-center space-x-2 mb-3">
                    <ClockIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-400">{strategy.timeToImplement}</span>
                  </div>
                  <ul className="space-y-1">
                    {strategy.actions.map((action, actionIndex) => (
                      <li key={actionIndex} className="text-xs text-gray-400 flex items-center space-x-1">
                        <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Daily Action Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 rounded-xl p-6"
      >
        <h3 className="text-xl font-bold text-white mb-4">60-Day Action Timeline</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {dailyActions.map((item, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border-2 transition-all ${
                item.day <= currentDay 
                  ? 'border-green-500 bg-green-500/10' 
                  : 'border-gray-600 bg-gray-700/50'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-400">Day {item.day}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-green-400">+${item.revenue}</span>
                  <span className="text-xs text-green-300">{item.cost}</span>
                </div>
              </div>
              <div className="text-sm text-white">{item.action}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Emergency Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6"
      >
        <h3 className="text-xl font-bold text-white mb-4">🚨 START TODAY - ZERO COST</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <button className="bg-green-600/20 hover:bg-green-600/30 border border-green-500 text-white px-6 py-3 rounded-lg font-semibold transition-all">
            🆓 Launch FREE Affiliate Blitz
          </button>
          <button className="bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500 text-white px-6 py-3 rounded-lg font-semibold transition-all">
            📧 Start Manual Outreach
          </button>
          <button className="bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500 text-white px-6 py-3 rounded-lg font-semibold transition-all">
            📝 Create FREE Lead Magnets
          </button>
          <button className="bg-orange-600/20 hover:bg-orange-600/30 border border-orange-500 text-white px-6 py-3 rounded-lg font-semibold transition-all">
            📊 Track Everything (FREE)
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default EmergencyMonetization;

