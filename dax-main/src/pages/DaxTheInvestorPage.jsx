<<<<<<< HEAD
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { TrendingUp, DollarSign, BarChart3, Brain, Target, Zap, Building, PieChart, Activity, Cpu, } from 'lucide-react';
import BrandGallery from '../components/BrandGallery'; // Added import

const DaxTheInvestorPage = () => {
  const [hoveredMetric, setHoveredMetric] = useState(null);
  const [activeTab, setActiveTab] = useState('financial');
=======
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { TrendingUp, DollarSign, BarChart3, Brain, Target, Zap, Building, PieChart, Activity, Cpu } from 'lucide-react'

const DaxTheInvestorPage = () => {
  const [hoveredMetric, setHoveredMetric] = useState(null)
  const [activeTab, setActiveTab] = useState('financial')
>>>>>>> 5a8663fecde2d35c1194c25223400ef23ec4724c

  // Financial Metrics (Private/Internal)
  const financialStats = [
    {
      id: 'revenue',
      value: '$50K+',
      label: 'Revenue Target',
      gradient: 'from-green-400 to-emerald-500',
      icon: DollarSign,
      description: 'Annual revenue goal across all brands'
    },
    {
      id: 'profit',
      value: '35%',
      label: 'Profit Margin',
      gradient: 'from-blue-400 to-cyan-500',
      icon: TrendingUp,
      description: 'Average profit margin per brand'
    },
    {
      id: 'properties',
      value: '12',
      label: 'Properties Tracked',
      gradient: 'from-orange-400 to-red-500',
      icon: Building,
      description: 'Real estate opportunities in pipeline'
    },
    {
      id: 'roi',
      value: '250%',
      label: 'Target ROI',
      gradient: 'from-purple-400 to-pink-500',
      icon: Target,
      description: 'Expected return on investment'
    }
<<<<<<< HEAD
  ];
=======
  ]
>>>>>>> 5a8663fecde2d35c1194c25223400ef23ec4724c

  // AI & Automation Metrics
  const aiStats = [
    {
      id: 'automation',
      value: '24/7',
      label: 'AI Automation',
      gradient: 'from-indigo-400 to-purple-500',
      icon: Cpu,
      description: 'Continuous automated processes'
    },
    {
      id: 'efficiency',
      value: '85%',
      label: 'Process Efficiency',
      gradient: 'from-teal-400 to-green-500',
      icon: Zap,
      description: 'Automation efficiency rate'
    },
    {
      id: 'models',
      value: '15+',
      label: 'AI Models',
      gradient: 'from-pink-400 to-rose-500',
      icon: Brain,
      description: 'Active AI models deployed'
    },
    {
      id: 'optimization',
      value: '∞',
      label: 'Growth Potential',
      gradient: 'from-amber-400 to-orange-500',
      icon: Activity,
      description: 'Unlimited scaling possibilities'
    }
<<<<<<< HEAD
  ];
=======
  ]
>>>>>>> 5a8663fecde2d35c1194c25223400ef23ec4724c

  // Growth Tracking
  const growthMetrics = [
    {
      id: 'brands',
      value: '5',
      label: 'Total Brands',
      gradient: 'from-violet-400 to-purple-500',
      icon: PieChart,
      description: 'Including Dax the Investor'
    },
    {
      id: 'platforms',
      value: '12+',
      label: 'Platforms',
      gradient: 'from-cyan-400 to-blue-500',
      icon: BarChart3,
      description: 'Multi-platform presence'
    },
    {
      id: 'automation_rate',
      value: '90%',
      label: 'Automation Rate',
      gradient: 'from-emerald-400 to-teal-500',
      icon: Zap,
      description: 'Processes automated'
    },
    {
      id: 'scaling',
      value: '∞',
      label: 'Scale Factor',
      gradient: 'from-rose-400 to-pink-500',
      icon: TrendingUp,
      description: 'Infinite scaling potential'
    }
<<<<<<< HEAD
  ];
=======
  ]
>>>>>>> 5a8663fecde2d35c1194c25223400ef23ec4724c

  const tabs = [
    { id: 'financial', label: 'Financial', stats: financialStats },
    { id: 'ai', label: 'AI & Automation', stats: aiStats },
    { id: 'growth', label: 'Growth Metrics', stats: growthMetrics }
<<<<<<< HEAD
  ];

  const currentStats = tabs.find(tab => tab.id === activeTab)?.stats || financialStats;
=======
  ]

  const currentStats = tabs.find(tab => tab.id === activeTab)?.stats || financialStats
>>>>>>> 5a8663fecde2d35c1194c25223400ef23ec4724c

  return (
    <>
      {/* ----- SEO and Meta Tags ----- */}
      <Helmet>
        <title>Dax the Investor – Private Financial Dashboard</title>
        <meta name="description" content="Private financial dashboard and AI-powered investment tracking for The Dax Collective empire." />
        <meta name="robots" content="noindex, nofollow" />
        <meta property="og:title" content="Dax the Investor – Private Dashboard" />
        <meta property="og:description" content="Internal financial metrics and investment tracking." />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* --- Main Dashboard Content --- */}
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
        {/* Background Effects */}
        <div className="fixed inset-0 pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"
            animate={{ 
              x: [0, 50, 0],
              y: [0, -30, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-green-500/10 to-teal-500/10 rounded-full blur-3xl"
            animate={{ 
              x: [0, -40, 0],
              y: [0, 20, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          />
        </div>

        <div className="relative z-10 px-6 py-12">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <motion.h1 
                className="text-5xl md:text-7xl font-bold mb-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                <span className="text-white">Dax the</span>{' '}
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
                  Investor
                </span>
              </motion.h1>
              
              <motion.p
                className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Private financial dashboard and AI-powered investment tracking for The Dax Collective empire.
              </motion.p>

              <motion.div
                className="inline-flex items-center px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-full text-red-300 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                🔒 Internal Use Only - Confidential Metrics
              </motion.div>
            </motion.div>

            {/* Tab Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex justify-center mb-12"
            >
              <div className="flex bg-gray-800/50 backdrop-blur-sm rounded-2xl p-2 border border-gray-700/50">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
            >
              {currentStats.map((stat, index) => {
<<<<<<< HEAD
                const IconComponent = stat.icon;
=======
                const IconComponent = stat.icon
>>>>>>> 5a8663fecde2d35c1194c25223400ef23ec4724c
                return (
                  <motion.div
                    key={stat.id}
                    className="group cursor-default"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: index * 0.1,
                      ease: "easeInOut"
                    }}
                    onMouseEnter={() => setHoveredMetric(stat.id)}
                    onMouseLeave={() => setHoveredMetric(null)}
                    whileHover={{ 
                      y: -8,
                      transition: { duration: 0.3, ease: "easeInOut" }
                    }}
                  >
                    <div className={`
                      relative overflow-hidden rounded-2xl p-6 h-48
                      bg-gradient-to-br ${stat.gradient}
                      transition-all duration-300 ease-in-out
                      group-hover:shadow-2xl group-hover:shadow-black/20
                      border border-white/10
                    `}>
                      {/* Subtle overlay */}
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-300" />
                      
                      {/* Content */}
                      <div className="relative z-10 h-full flex flex-col justify-between">
                        {/* Icon */}
                        <div className="flex justify-between items-start">
                          <motion.div
                            whileHover={{ 
                              scale: 1.1,
                              transition: { duration: 0.2, ease: "easeInOut" }
                            }}
                            className="p-3 bg-white/15 backdrop-blur-sm rounded-xl border border-white/10"
                          >
                            <IconComponent 
                              size={28} 
                              className="text-white drop-shadow-sm"
                            />
                          </motion.div>
                          
                          {/* Status indicator */}
                          <motion.div
                            className="w-2 h-2 bg-white/50 rounded-full"
                            animate={{ 
                              scale: [1, 1.2, 1],
                              opacity: [0.5, 0.8, 0.5]
                            }}
                            transition={{ 
                              duration: 2, 
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: index * 0.5
                            }}
                          />
                        </div>

                        {/* Stats */}
                        <div>
                          <motion.div
                            className="text-3xl font-bold text-white mb-2"
                            animate={hoveredMetric === stat.id ? {
                              scale: [1, 1.05, 1],
                            } : {}}
                            transition={{ 
                              duration: 0.4, 
                              ease: "easeInOut"
                            }}
                          >
                            {stat.value}
                          </motion.div>
                          
                          <p className="text-white/90 text-sm font-medium mb-2">
                            {stat.label}
                          </p>
                          
                          <p className="text-white/70 text-xs leading-relaxed">
                            {stat.description}
                          </p>
                        </div>
                      </div>

                      {/* Hover glow */}
                      <motion.div
                        className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                        initial={{ opacity: 0 }}
                      />
                    </div>
                  </motion.div>
<<<<<<< HEAD
                );
              })}
            </motion.div>

            {/* BrandGallery insertion */}
            <section className="py-16 px-4">
              <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-white mb-6 text-center">
                  Investor Gallery
                </h2>
                <BrandGallery folderId={process.env.REACT_APP_DRIVE_DAX_ANALYTICS_IMAGES} />
              </div>
            </section>

=======
                )
              })}
            </motion.div>

>>>>>>> 5a8663fecde2d35c1194c25223400ef23ec4724c
            {/* Brand Integration Notice */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="text-center"
            >
              <div className="relative">
                <div className="relative bg-gray-900/40 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/30">
                  <motion.h3 
                    className="text-2xl font-bold text-white mb-4"
                  >
                    🏠 Real Estate Investment Pipeline
                  </motion.h3>
                  
                  <motion.p 
                    className="text-gray-300 mb-6 max-w-2xl mx-auto"
                  >
                    Advanced AI automation for property tracking, tax liens, wholesale deals, 
                    and seller outreach. Integrated with The Dax Collective ecosystem for 
                    maximum synergy and growth potential.
                  </motion.p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <div className="text-blue-400 font-semibold mb-1">Property Tracking</div>
                      <div className="text-gray-400">Automated lead generation</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <div className="text-green-400 font-semibold mb-1">Deal Analysis</div>
                      <div className="text-gray-400">AI-powered ROI calculations</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <div className="text-purple-400 font-semibold mb-1">Portfolio Growth</div>
                      <div className="text-gray-400">Strategic expansion planning</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
<<<<<<< HEAD
  );
};

export default DaxTheInvestorPage;
=======
  )
}

export default DaxTheInvestorPage

>>>>>>> 5a8663fecde2d35c1194c25223400ef23ec4724c
