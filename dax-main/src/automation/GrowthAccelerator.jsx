// src/automation/GrowthAccelerator.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  RocketLaunchIcon,
  BoltIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  GlobeAltIcon,
  LightBulbIcon,
  FireIcon
} from '@heroicons/react/24/outline';

const GrowthAccelerator = () => {
  const [currentPhase, setCurrentPhase] = useState(1);
  const [metrics, setMetrics] = useState({
    revenue: 2847,
    subscribers: 1250,
    views: 45000,
    engagement: 8.5,
    brands: 4,
    automations: 12
  });

  const phases = [
    {
      id: 1,
      name: "Foundation & Launch",
      target: "$0-$500",
      duration: "Month 1-2",
      color: "from-blue-500 to-cyan-500",
      icon: RocketLaunchIcon,
      tasks: [
        "✅ Website with automation hub",
        "✅ Content automation across 4 brands", 
        "🔄 Analytics tracking setup",
        "🔄 Workflow automation for posting"
      ],
      accelerators: [
        "Multi-brand content strategy",
        "Automated posting schedules",
        "Cross-platform syndication",
        "Basic monetization setup"
      ]
    },
    {
      id: 2,
      name: "Monetization",
      target: "$500-$5K",
      duration: "Month 3-4",
      color: "from-green-500 to-emerald-500",
      icon: CurrencyDollarIcon,
      tasks: [
        "💳 Automated affiliate marketing",
        "📧 Email list automation (1K+ subs)",
        "🛍️ Digital product sales",
        "💰 Sponsorship tracking"
      ],
      accelerators: [
        "AI-powered affiliate recommendations",
        "Automated email sequences",
        "Dynamic pricing optimization",
        "Sponsor outreach automation"
      ]
    },
    {
      id: 3,
      name: "Scale & Optimize",
      target: "$5K-$25K",
      duration: "Month 5-8",
      color: "from-purple-500 to-pink-500",
      icon: ChartBarIcon,
      tasks: [
        "🤖 AI content generation",
        "📈 Advanced analytics & A/B testing",
        "🎯 Automated audience targeting",
        "💼 Brand partnership automation"
      ],
      accelerators: [
        "Machine learning optimization",
        "Predictive analytics",
        "Automated A/B testing",
        "Smart audience segmentation"
      ]
    },
    {
      id: 4,
      name: "Maximize",
      target: "$25K-$50K+",
      duration: "Month 9-12",
      color: "from-orange-500 to-red-500",
      icon: FireIcon,
      tasks: [
        "🏢 Multi-platform automation",
        "📱 Mobile app integration",
        "🌐 International expansion",
        "💎 Premium subscription tiers"
      ],
      accelerators: [
        "Global market automation",
        "Multi-language content",
        "Premium tier optimization",
        "Enterprise partnerships"
      ]
    }
  ];

  const currentPhaseData = phases.find(p => p.id === currentPhase);

  const keyMultipliers = [
    {
      name: "4-Brand Strategy",
      multiplier: "4x",
      description: "Content output across multiple niches",
      icon: GlobeAltIcon,
      color: "text-blue-400"
    },
    {
      name: "Automation System",
      multiplier: "10x",
      description: "Efficiency through automated workflows",
      icon: BoltIcon,
      color: "text-yellow-400"
    },
    {
      name: "Data-Driven Decisions",
      multiplier: "3x",
      description: "Conversion rate optimization",
      icon: ChartBarIcon,
      color: "text-green-400"
    },
    {
      name: "AI Content Generation",
      multiplier: "8x",
      description: "Scalable content production",
      icon: LightBulbIcon,
      color: "text-purple-400"
    }
  ];

  const projectedTimeline = [
    { month: 1, revenue: 150, milestone: "Website Launch" },
    { month: 2, revenue: 500, milestone: "First Sales" },
    { month: 3, revenue: 1200, milestone: "Affiliate Success" },
    { month: 4, revenue: 2800, milestone: "Email List Growth" },
    { month: 5, revenue: 5500, milestone: "Sponsorship Deals" },
    { month: 6, revenue: 9200, milestone: "Product Launch" },
    { month: 7, revenue: 15000, milestone: "Scale Optimization" },
    { month: 8, revenue: 22000, milestone: "Brand Partnerships" },
    { month: 9, revenue: 32000, milestone: "International Expansion" },
    { month: 10, revenue: 41000, milestone: "Premium Tiers" },
    { month: 11, revenue: 47000, milestone: "Enterprise Deals" },
    { month: 12, revenue: 55000, milestone: "$50K+ Achieved!" }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4"
        >
          🚀 Growth Accelerator System
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-300"
        >
          Your roadmap from $0 to $50K in 6-12 months
        </motion.p>
      </div>

      {/* Current Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-2 md:grid-cols-6 gap-4"
      >
        {Object.entries(metrics).map(([key, value], index) => (
          <div key={key} className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">
              {key === 'revenue' ? `$${value.toLocaleString()}` : 
               key === 'engagement' ? `${value}%` :
               value.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400 capitalize">{key}</div>
          </div>
        ))}
      </motion.div>

      {/* Phase Navigation */}
      <div className="flex justify-center space-x-2">
        {phases.map((phase) => (
          <button
            key={phase.id}
            onClick={() => setCurrentPhase(phase.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              currentPhase === phase.id
                ? `bg-gradient-to-r ${phase.color} text-white`
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Phase {phase.id}
          </button>
        ))}
      </div>

      {/* Current Phase Details */}
      <motion.div
        key={currentPhase}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-gray-800 rounded-xl p-6"
      >
        <div className="flex items-center space-x-4 mb-6">
          <div className={`p-3 rounded-lg bg-gradient-to-r ${currentPhaseData.color}`}>
            <currentPhaseData.icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{currentPhaseData.name}</h2>
            <p className="text-gray-400">{currentPhaseData.duration} • {currentPhaseData.target}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Key Tasks</h3>
            <ul className="space-y-2">
              {currentPhaseData.tasks.map((task, index) => (
                <li key={index} className="text-gray-300">{task}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Growth Accelerators</h3>
            <ul className="space-y-2">
              {currentPhaseData.accelerators.map((accelerator, index) => (
                <li key={index} className="text-gray-300">• {accelerator}</li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Key Multipliers */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {keyMultipliers.map((multiplier, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + (index * 0.1) }}
            className="bg-gray-800 rounded-xl p-6 text-center"
          >
            <multiplier.icon className={`w-8 h-8 mx-auto mb-3 ${multiplier.color}`} />
            <div className="text-3xl font-bold text-white mb-2">{multiplier.multiplier}</div>
            <div className="text-lg font-semibold text-white mb-2">{multiplier.name}</div>
            <div className="text-sm text-gray-400">{multiplier.description}</div>
          </motion.div>
        ))}
      </div>

      {/* Revenue Projection Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gray-800 rounded-xl p-6"
      >
        <h3 className="text-xl font-bold text-white mb-6">12-Month Revenue Projection</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projectedTimeline.map((month, index) => (
            <div
              key={month.month}
              className={`p-4 rounded-lg border-2 transition-all ${
                month.month <= 2 ? 'border-green-500 bg-green-500/10' : 'border-gray-600 bg-gray-700/50'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Month {month.month}</span>
                <span className="text-lg font-bold text-white">${month.revenue.toLocaleString()}</span>
              </div>
              <div className="text-sm text-gray-300">{month.milestone}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="flex justify-center space-x-4"
      >
        <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all">
          Activate Next Phase
        </button>
        <button className="bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-all">
          View Detailed Plan
        </button>
      </motion.div>
    </div>
  );
};

export default GrowthAccelerator;

