'use client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState, useRef } from 'react'

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
    
    // Add click ripple effect
    document.addEventListener('click', function(e) {
      const clickables = document.querySelectorAll('.clickable');
      clickables.forEach(element => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
          const ripple = document.createElement('span');
          ripple.classList.add('click-ripple');
          ripple.style.left = `${x}px`;
          ripple.style.top = `${y}px`;
          
          // Set ripple color based on element's primary color
          if (element.classList.contains('dax-travels')) {
            ripple.style.backgroundColor = 'rgba(77, 169, 255, 0.7)'; // ocean-blue
          } else if (element.classList.contains('dax-creates')) {
            ripple.style.backgroundColor = 'rgba(255, 51, 153, 0.7)'; // creative-pink
          } else if (element.classList.contains('dax-tech')) {
            ripple.style.backgroundColor = 'rgba(128, 51, 255, 0.7)'; // tech-purple
          } else if (element.classList.contains('dax-anime')) {
            ripple.style.backgroundColor = 'rgba(255, 77, 169, 0.7)'; // anime-pink
          } else {
            // More colorful ripple with random colors
            const colors = [
              'rgba(255, 51, 153, 0.7)',  // pink
              'rgba(77, 169, 255, 0.7)',  // blue
              'rgba(255, 209, 102, 0.7)', // gold
              'rgba(102, 204, 102, 0.7)', // green
              'rgba(128, 51, 255, 0.7)',  // purple
              'rgba(255, 107, 51, 0.7)',  // orange
            ];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            ripple.style.backgroundColor = randomColor;
          }
          
          element.appendChild(ripple);
          
          setTimeout(() => {
            ripple.remove();
          }, 600);
        }
      });
    });
    
    return () => {
      document.removeEventListener('click', () => {});
    };
  }, []);

  return (
    <main className="min-h-screen">
      {/* Hero Section with Background Image */}
      <section className="hero-section flex items-center justify-center clickable" style={{backgroundImage: 'url("https://placehold.co/1920x1080/00A0C1/FFFFFF/png?text=Your+Photo+Here")', backgroundPosition: 'center top'}}>
        <div className="container mx-auto px-6 py-24 text-center hero-content">
          <h1 className={`text-5xl md:text-7xl font-bold mb-6 text-white ${isLoaded ? 'fade-in' : 'opacity-0'}`} style={{animationDelay: '0.2s', textShadow: '0 0 15px rgba(0,0,0,0.5)'}}>Dax Collective</h1>
          <p className={`text-xl md:text-2xl mb-8 text-white ${isLoaded ? 'fade-in' : 'opacity-0'}`} style={{animationDelay: '0.4s', textShadow: '0 0 10px rgba(0,0,0,0.5)'}}>Creativity Without Boundaries</p>
          <div className={`faith-text text-white text-xl mb-8 ${isLoaded ? 'fade-in' : 'opacity-0'}`} style={{animationDelay: '0.5s', textShadow: '0 0 10px rgba(0,0,0,0.5)'}}>
            "For I know the plans I have for you," declares the LORD, "plans to prosper you and not to harm you, plans to give you hope and a future." <span className="font-semibold">- Jeremiah 29:11</span>
          </div>
          <Button className={`button-primary bg-white text-deep-teal hover:bg-white/90 ${isLoaded ? 'fade-in' : 'opacity-0'}`} style={{animationDelay: '0.6s'}}>
            Explore My World
          </Button>
        </div>
      </section>

      {/* Colorful Divider */}
      <div className="h-2 bg-gradient-to-r from-ocean-blue via-creative-pink to-tech-purple"></div>

      {/* Sub-brands Section with Animation */}
      <section className="py-20 bg-soft-cream">
        <div className="container mx-auto px-6">
          <h2 className={`section-title text-center mb-16 ${isLoaded ? 'fade-in' : 'opacity-0'}`}>My Creative Universe</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Dax Travels */}
            <Card className={`card p-6 dax-travels border-t-4 border-ocean-blue clickable card-3d ${isLoaded ? 'slide-in-left' : 'opacity-0'}`} style={{animationDelay: '0.2s', boxShadow: '0 10px 25px -5px rgba(77, 169, 255, 0.3)'}}>
              <div className="h-48 mb-4 rounded-md overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1488085061387-422e29b40080?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1031&q=80" 
                  alt="Travel" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-ocean-blue">Dax Travels</h3>
              <p className="mb-6">Explore the world through my travel blogs, videos, and photography.</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-sunset-orange">Travel Content</span>
                <Button variant="outline" className="text-ocean-blue border-ocean-blue hover:bg-ocean-blue hover:text-white">
                  Discover
                </Button>
              </div>
            </Card>

            {/* Dax Creates */}
            <Card className={`card p-6 dax-creates border-t-4 border-creative-pink clickable card-3d ${isLoaded ? 'slide-in-left' : 'opacity-0'}`} style={{animationDelay: '0.4s', boxShadow: '0 10px 25px -5px rgba(255, 51, 153, 0.3)'}}>
              <div className="h-48 mb-4 rounded-md overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80" 
                  alt="Creative Products" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-creative-pink">Dax Creates</h3>
              <p className="mb-6">Browse my creative products including journals, stickers, and faith-based t-shirts.</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-sage-green">Creative Products</span>
                <Button variant="outline" className="text-creative-pink border-creative-pink hover:bg-creative-pink hover:text-white">
                  Shop Now
                </Button>
              </div>
            </Card>

            {/* Dax Tech */}
            <Card className={`card p-6 dax-tech border-t-4 border-tech-purple clickable card-3d ${isLoaded ? 'slide-in-right' : 'opacity-0'}`} style={{animationDelay: '0.6s', boxShadow: '0 10px 25px -5px rgba(128, 51, 255, 0.3)'}}>
              <div className="h-48 mb-4 rounded-md overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1172&q=80" 
                  alt="Tech Projects" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-tech-purple">Dax Tech</h3>
              <p className="mb-6">Explore my app development projects and productivity tools.</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-electric-blue">Tech Projects</span>
                <Button variant="outline" className="text-tech-purple border-tech-purple hover:bg-tech-purple hover:text-white">
                  View Apps
                </Button>
              </div>
            </Card>

            {/* Dax Anime */}
            <Card className={`card p-6 dax-anime border-t-4 border-anime-pink clickable card-3d ${isLoaded ? 'slide-in-right' : 'opacity-0'}`} style={{animationDelay: '0.8s', boxShadow: '0 10px 25px -5px rgba(255, 77, 169, 0.3)'}}>
              <div className="h-48 mb-4 rounded-md overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80" 
                  alt="Anime Content" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-anime-pink">Dax Anime</h3>
              <p className="mb-6">Dive into my anime content, focusing on Re:Zero and other series.</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-sky-blue">Anime Content</span>
                <Button variant="outline" className="text-anime-pink border-anime-pink hover:bg-anime-pink hover:text-white">
                  Watch Now
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Colorful Divider */}
      <div className="h-2 bg-gradient-to-r from-tech-purple via-sunset-orange to-ocean-blue"></div>

      {/* Bible Verse Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <div className="bible-verse">
            <p className="bible-verse-text">"Whatever you do, work at it with all your heart, as working for the Lord, not for human masters."</p>
            <p className="bible-verse-reference">Colossians 3:23</p>
          </div>
        </div>
      </section>

      {/* Instagram Feed Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="section-title text-center mb-16">Instagram Highlights</h2>
          
          <div className="social-feed">
            {/* Instagram Post 1 */}
            <div className="social-post clickable glow-on-hover">
              <div className="social-header">
                <img 
                  src="https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1031&q=80" 
                  alt="Profile" 
                  className="social-avatar"
                />
                <div className="social-username">daxthetraveler</div>
                <div className="social-platform">📸</div>
              </div>
              <div className="social-content">
                <img 
                  src="https://images.unsplash.com/photo-1530521954074-e64f6810b32d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                  alt="Travel Photo" 
                  className="social-image"
                />
                <div className="social-text">
                  <p>Exploring beautiful destinations and sharing my adventures! #travel #adventure</p>
                </div>
              </div>
              <div className="social-footer">
                <span>❤️ 124</span>
                <span>💬 23</span>
              </div>
            </div>
            
            {/* Instagram Post 2 */}
            <div className="social-post clickable glow-on-hover">
              <div className="social-header">
                <img 
                  src="https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1031&q=80" 
                  alt="Profile" 
                  className="social-avatar"
                />
                <div className="social-username">daxthetraveler</div>
                <div className="social-platform">📸</div>
              </div>
              <div className="social-content">
                <img 
                  src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80" 
                  alt="Journal" 
                  className="social-image"
                />
                <div className="social-text">
                  <p>New journal designs coming soon! Stay tuned for the release. #creativity #journals</p>
                </div>
              </div>
              <div className="social-footer">
                <span>❤️ 98</span>
                <span>💬 15</span>
              </div>
            </div>
            
            {/* Instagram Post 3 */}
            <div className="social-post clickable glow-on-hover">
              <div className="social-header">
                <img 
                  src="https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1031&q=80" 
                  alt="Profile" 
                  className="social-avatar"
                />
                <div className="social-username">daxthetraveler</div>
                <div className="social-platform">📸</div>
              </div>
              <div className="social-content">
                <img 
                  src="https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                  alt="Coding" 
                  className="social-image"
                />
                <div className="social-text">
                  <p>Working on a new travel app! Can't wait to share more details. #coding #appdevelopment</p>
                </div>
              </div>
              <div className="social-footer">
                <span>❤️ 76</span>
                <span>💬 12</span>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Button className="bg-gradient-primary text-white hover:opacity-90 clickable">
              Follow on Instagram
            </Button>
          </div>
        </div>
      </section>

      {/* Colorful Divider */}
      <div className="h-2 bg-gradient-to-r from-creative-pink via-muted-gold to-sage-green"></div>

      {/* Scripture Cards Section */}
      <section className="py-16 bg-soft-cream">
        <div className="container mx-auto px-6">
          <h2 className="section-title text-center mb-12">Daily Inspiration</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="scripture-card bg-white clickable floating">
              <p className="scripture-text">"Trust in the LORD with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight."</p>
              <p className="scripture-reference">Proverbs 3:5-6</p>
            </div>
            
            <div className="scripture-card bg-white clickable floating" style={{animationDelay: '0.2s'}}>
              <p className="scripture-text">"I can do all this through him who gives me strength."</p>
              <p className="scripture-reference">Philippians 4:13</p>
            </div>
            
            <div className="scripture-card bg-white clickable floating" style={{animationDelay: '0.4s'}}>
              <p className="scripture-text">"I will give you more than you asked for. Be patient and trust me."</p>
              <p className="scripture-reference">Ephesians 3:20</p>
            </div>
          </div>
        </div>
      </section>

      {/* Parallax Section */}
      <section className="parallax clickable" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")'}}>
        <div className="parallax-content">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Adventure Awaits</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Join me on a journey of exploration, creativity, and innovation.</p>
          <div className="faith-text text-xl mb-8">
            "The world is a book and those who do not travel read only one page." <span className="font-semibold">- Saint Augustine</span>
          </div>
          <Button className="bg-white text-deep-teal hover:bg-white/90 clickable">
            Start Your Journey
          </Button>
        </div>
      </section>

      {/* Colorful Divider */}
      <div className="h-2 bg-gradient-to-r from-anime-pink via-sky-blue to-electric-blue"></div>

      {/* Featured Content Section with Animation */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="section-title text-center mb-16">Featured Content</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Featured Travel Content */}
            <div className={`space-y-6 ${isLoaded ? 'slide-in-left' : 'opacity-0'}`} style={{animationDelay: '0.4s'}}>
              <div className="panoramic-container rounded-lg overflow-hidden clickable">
                <img 
                  src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1121&q=80" 
                  alt="Travel Panorama" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="sub-section-title text-ocean-blue">Latest Adventures</h3>
              <p>Follow my journey as I explore new destinations and share travel tips, photography, and stories from around the world.</p>
              <div className="bible-verse">
                <p className="bible-verse-text">"Go into all the world and preach the gospel to all creation."</p>
                <p className="bible-verse-reference">Mark 16:15</p>
              </div>
              <Button className="bg-ocean-blue text-white hover:bg-ocean-blue/90 clickable">
                View Travel Blog
              </Button>
            </div>
            
            {/* Featured Product */}
            <div className={`space-y-6 ${isLoaded ? 'slide-in-right' : 'opacity-0'}`} style={{animationDelay: '0.6s'}}>
              <div className="aspect-square rounded-lg overflow-hidden clickable">
                <img 
                  src="https://images.unsplash.com/photo-1603252109303-2751441dd157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80" 
                  alt="T-shirt Design" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="sub-section-title text-creative-pink">New Arrivals</h3>
              <p>Check out my latest creative products, including chibi AI travel stickers and Christian-inspired t-shirts.</p>
              <div className="bible-verse">
                <p className="bible-verse-text">"So whether you eat or drink or whatever you do, do it all for the glory of God."</p>
                <p className="bible-verse-reference">1 Corinthians 10:31</p>
              </div>
              <Button className="bg-creative-pink text-white hover:bg-creative-pink/90 clickable">
                Shop Collection
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* App Showcase Section with Animation */}
      <section className="py-20 bg-tech-purple/10">
        <div className="container mx-auto px-6">
          <h2 className="section-title text-center mb-16">App Showcase</h2>
          
          <div className="max-w-4xl mx-auto">
            <Card className={`p-8 border-none shadow-lg clickable card-3d ${isLoaded ? 'fade-in' : 'opacity-0'}`} style={{animationDelay: '0.4s', boxShadow: '0 15px 30px -10px rgba(128, 51, 255, 0.3)'}}>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/2">
                  <h3 className="text-2xl font-bold mb-4 text-tech-purple">Travel Game App</h3>
                  <p className="mb-6">An interactive travel-themed game with multiple modes:</p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start">
                      <span className="text-electric-blue mr-2">•</span>
                      <span>GeoGuesser - Guess countries based on clues</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-electric-blue mr-2">•</span>
                      <span>Travel Matchmaker - Find your perfect destination</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-electric-blue mr-2">•</span>
                      <span>Global Adventure - Choose-your-own-path stories</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-electric-blue mr-2">•</span>
                      <span>World Detective - Carmen-style question game</span>
                    </li>
                  </ul>
                  <div className="bible-verse">
                    <p className="bible-verse-text">"Whatever you have learned or received or heard from me, or seen in me—put it into practice."</p>
                    <p className="bible-verse-reference">Philippians 4:9</p>
                  </div>
                  <Button className="bg-tech-purple text-white hover:bg-tech-purple/90 clickable">
                    Coming Soon
                  </Button>
                </div>
                <div className="md:w-1/2 rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                    alt="App Mockup" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Colorful Divider */}
      <div className="h-2 bg-gradient-to-r from-sunset-orange via-deep-teal to-vibrant-pink"></div>

      {/* Gallery Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="section-title text-center mb-16">Photo Gallery</h2>
          
          <div className="gallery-container">
            {/* Gallery Item 1 */}
            <div className="gallery-item clickable">
              <img 
                src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                alt="Mountain Landscape" 
                className="w-full h-full object-cover"
              />
              <div className="gallery-overlay">
                <h3 className="text-lg font-bold">Amazing Destination</h3>
                <p className="text-sm">Exploring the wonders of nature</p>
              </div>
            </div>
            
            {/* Gallery Item 2 */}
            <div className="gallery-item clickable">
              <img 
                src="https://images.unsplash.com/photo-1502085026254-c9a0a31a7ee9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                alt="Sunset Beach" 
                className="w-full h-full object-cover"
              />
              <div className="gallery-overlay">
                <h3 className="text-lg font-bold">Sunset Views</h3>
                <p className="text-sm">Capturing the perfect moment</p>
              </div>
            </div>
            
            {/* Gallery Item 3 */}
            <div className="gallery-item clickable">
              <img 
                src="https://images.unsplash.com/photo-1531346878377-a5be20888e57?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80" 
                alt="Journal" 
                className="w-full h-full object-cover"
              />
              <div className="gallery-overlay">
                <h3 className="text-lg font-bold">Journal Collection</h3>
                <p className="text-sm">Handcrafted designs for your thoughts</p>
              </div>
            </div>
            
            {/* Gallery Item 4 */}
            <div className="gallery-item clickable">
              <img 
                src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                alt="Coding" 
                className="w-full h-full object-cover"
              />
              <div className="gallery-overlay">
                <h3 className="text-lg font-bold">App Development</h3>
                <p className="text-sm">Creating innovative solutions</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Bible Verse */}
      <section className="py-12 bg-soft-cream">
        <div className="container mx-auto px-6">
          <div className="bible-verse">
            <p className="bible-verse-text">"Let your light shine before others, that they may see your good deeds and glorify your Father in heaven."</p>
            <p className="bible-verse-reference">Matthew 5:16</p>
          </div>
        </div>
      </section>

      {/* Colorful Divider */}
      <div className="h-2 bg-gradient-to-r from-muted-gold via-soft-purple to-coral"></div>

      {/* Newsletter Section with Gradient Background */}
      <section className="py-20 bg-gradient-primary text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Stay Connected</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Subscribe to my newsletter to receive updates on new content, products, and travel adventures.</p>
          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-grow px-4 py-3 rounded-md text-charcoal focus:outline-none focus:ring-2 focus:ring-soft-cream"
            />
            <Button className="bg-white text-deep-teal hover:bg-white/90 whitespace-nowrap clickable">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      {/* Social Media Links */}
      <section className="py-12 bg-soft-cream">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-8">Connect With Me</h2>
          <div className="flex justify-center space-x-6">
            <a href="#" className="text-3xl hover:text-ocean-blue transition-colors clickable">📸</a>
            <a href="#" className="text-3xl hover:text-sunset-orange transition-colors clickable">🎬</a>
            <a href="#" className="text-3xl hover:text-creative-pink transition-colors clickable">📚</a>
            <a href="#" className="text-3xl hover:text-tech-purple transition-colors clickable">💻</a>
          </div>
        </div>
      </section>

      {/* Footer with Gradient Background */}
      <footer className="py-12 bg-gradient-to-r from-charcoal to-deep-teal text-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Dax Collective</h3>
              <p className="text-white/70">Creativity Without Boundaries</p>
              <p className="text-white/70 mt-4 faith-text">"And whatever you do, whether in word or deed, do it all in the name of the Lord Jesus." - Colossians 3:17</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-white/70 hover:text-white">Home</Link></li>
                <li><Link href="#" className="text-white/70 hover:text-white">About</Link></li>
                <li><Link href="#" className="text-white/70 hover:text-white">Shop</Link></li>
                <li><Link href="#" className="text-white/70 hover:text-white">Blog</Link></li>
                <li><Link href="#" className="text-white/70 hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Sub-brands</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-white/70 hover:text-white">Dax Travels</Link></li>
                <li><Link href="#" className="text-white/70 hover:text-white">Dax Creates</Link></li>
                <li><Link href="#" className="text-white/70 hover:text-white">Dax Tech</Link></li>
                <li><Link href="#" className="text-white/70 hover:text-white">Dax Anime</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-white/70 hover:text-white">Instagram</Link></li>
                <li><Link href="#" className="text-white/70 hover:text-white">YouTube</Link></li>
                <li><Link href="#" className="text-white/70 hover:text-white">TikTok</Link></li>
                <li><Link href="#" className="text-white/70 hover:text-white">Amazon</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/20 text-center text-white/50">
            <p>&copy; {new Date().getFullYear()} Dax Collective. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
