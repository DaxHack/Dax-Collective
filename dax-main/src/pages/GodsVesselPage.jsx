// src/pages/GodsVesselPage.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const GodsVesselPage = () => {
  const [activeSection, setActiveSection] = useState('faith');

  const faithContent = [
    {
      id: 1,
      title: "Walking in Purpose",
      verse: "Jeremiah 29:11",
      content: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, to give you hope and a future.",
      category: "Purpose",
      readTime: "3 min"
    },
    {
      id: 2,
      title: "Strength in Trials",
      verse: "Romans 8:28",
      content: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
      category: "Encouragement",
      readTime: "4 min"
    },
    {
      id: 3,
      title: "Faith Over Fear",
      verse: "Isaiah 41:10",
      content: "So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand.",
      category: "Courage",
      readTime: "2 min"
    }
  ];

  const apparelItems = [
    {
      name: "Faith Over Fear Hoodie",
      price: "$45",
      description: "Premium comfort with a powerful message",
      image: "/api/placeholder/300/300",
      colors: ["Black", "White", "Navy"]
    },
    {
      name: "Blessed & Grateful Tee",
      price: "$25",
      description: "Soft cotton blend with inspiring design",
      image: "/api/placeholder/300/300",
      colors: ["Heather Gray", "White", "Sage Green"]
    },
    {
      name: "Scripture Verse Cap",
      price: "$30",
      description: "Adjustable cap with embroidered verse",
      image: "/api/placeholder/300/300",
      colors: ["Black", "Khaki", "Navy"]
    }
  ];

  const testimonies = [
    {
      name: "Sarah M.",
      testimony: "God's Vessel content has been such a blessing in my daily walk. The scripture reminders and encouraging words always come at the perfect time.",
      location: "Atlanta, GA"
    },
    {
      name: "Marcus T.",
      testimony: "Wearing my Faith Over Fear hoodie has opened so many conversations about faith. It's amazing how God uses simple things to reach others.",
      location: "Dallas, TX"
    },
    {
      name: "Jennifer L.",
      testimony: "The daily devotionals have transformed my morning routine. Starting each day with God's word sets the tone for everything else.",
      location: "Phoenix, AZ"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black/40"></div>
        <div 
          className="h-96 bg-cover bg-center bg-no-repeat flex items-center justify-center"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url('/api/placeholder/1920/600')`
          }}
        >
          <div className="text-center max-w-4xl px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                ✝️ GOD'S VESSEL
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-6">
                Truth. Testimony. Transformation.
              </p>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                A space of truth, testimony, and transformation. From scriptures to apparel, this page is your anchor. 
                Support the brand, wear your faith proudly, or get content to bless your feed and your spirit.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center mb-8 bg-gray-800/30 backdrop-blur-sm rounded-full p-2 border border-gray-700">
            {[
              { id: 'faith', label: 'Faith Content' },
              { id: 'apparel', label: 'Faith Apparel' },
              { id: 'testimonies', label: 'Testimonies' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeSection === tab.id
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Faith Content Section */}
          {activeSection === 'faith' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {faithContent.map((content) => (
                <div key={content.id} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-purple-600/30 text-purple-300 px-3 py-1 rounded-full text-sm font-semibold">
                      {content.category}
                    </span>
                    <span className="text-gray-400 text-sm">{content.readTime}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2">{content.title}</h3>
                  <p className="text-purple-300 font-semibold mb-3">{content.verse}</p>
                  <p className="text-gray-300 mb-4 leading-relaxed italic">"{content.content}"</p>
                  
                  <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                    Read Devotional
                  </button>
                </div>
              ))}
            </motion.div>
          )}

          {/* Apparel Section */}
          {activeSection === 'apparel' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {apparelItems.map((item, index) => (
                <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 hover:border-purple-500 transition-all duration-300">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-64 object-cover"
                  />
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">{item.name}</h3>
                    <p className="text-gray-300 mb-3">{item.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-purple-400">{item.price}</span>
                      <div className="flex gap-2">
                        {item.colors.map((color, idx) => (
                          <div 
                            key={idx}
                            className="w-6 h-6 rounded-full border-2 border-gray-600"
                            style={{ 
                              backgroundColor: color.toLowerCase() === 'white' ? '#ffffff' : 
                                             color.toLowerCase() === 'black' ? '#000000' :
                                             color.toLowerCase() === 'navy' ? '#1e3a8a' :
                                             color.toLowerCase() === 'heather gray' ? '#9ca3af' :
                                             color.toLowerCase() === 'sage green' ? '#84cc16' :
                                             color.toLowerCase() === 'khaki' ? '#d2b48c' : '#6b7280'
                            }}
                          ></div>
                        ))}
                      </div>
                    </div>
                    
                    <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-2 rounded-lg font-semibold transition-all duration-300">
                      Shop Now
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Testimonies Section */}
          {activeSection === 'testimonies' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {testimonies.map((testimony, index) => (
                <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {testimony.name.charAt(0)}
                    </div>
                    
                    <div className="flex-1">
                      <blockquote className="text-gray-300 text-lg italic mb-4 leading-relaxed">
                        "{testimony.testimony}"
                      </blockquote>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-white font-semibold">{testimony.name}</p>
                          <p className="text-gray-400 text-sm">{testimony.location}</p>
                        </div>
                        
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="text-center mt-8">
                <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
                  Share Your Testimony
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-black/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Walk by Faith, Not by Sight</h2>
          <p className="text-gray-300 mb-8 text-lg">
            Join our community of believers and let your faith shine through every aspect of your life.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">10K+</div>
              <div className="text-gray-400">Faithful Followers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">500+</div>
              <div className="text-gray-400">Lives Transformed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">∞</div>
              <div className="text-gray-400">God's Love</div>
            </div>
          </div>
          
          <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
            Join the Movement
          </button>
        </div>
      </section>
    </div>
  );
};

export default GodsVesselPage;

