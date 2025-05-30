// src/app/timezone/page.tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image"; // Import Next.js Image component

// Define TimeZone Travelers specific colors (or ensure they are in globals.css)
// Note: We are now using the global gradient, but keep these for potential future use or specific elements
const timeZonePrimary = "hsl(var(--deep-teal))"; // Example: Using deep-teal
const timeZoneAccent = "hsl(var(--muted-gold))";  // Example: Using muted-gold

export default function TimeZonePage() {
  return (
    <div className="timezone-travelers">
      {/* Hero Section for TimeZone Travelers */}
      <section 
        className="hero-section flex items-center justify-center text-white relative"
      >
        <Image 
          src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" // Placeholder image
          alt="TimeZone background" 
          layout="fill" 
          objectFit="cover" 
          quality={80} 
          className="absolute inset-0 z-0" 
          priority // Prioritize loading hero image
        />
        <div className="absolute inset-0 bg-black opacity-60 z-10"></div>
        <div className="container mx-auto px-6 py-24 text-center hero-content relative z-20">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">TimeZone Travelers</h1> {/* Ensure white text */}
          <p className="text-xl md:text-2xl mb-8 text-white text-opacity-90">Exploring history, culture, and the passage of time across the globe.</p>
          <Button style={{ backgroundColor: timeZonePrimary }} className="button-primary hover:opacity-90"> {/* Keep primary button style */}
            Join the Journey
          </Button>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-soft-cream">
        <div className="container mx-auto px-6">
          {/* Use the global section-title gradient */}
          <h2 className="section-title text-center mb-12">
            Across Eras and Continents
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Example Content Card 1 */}
            <Card className="p-6 shadow-lg overflow-hidden border border-gray-200">
              <div className="relative w-full h-48 mb-4">
                <Image 
                  src="https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                  alt="Ancient Ruins" 
                  layout="fill" 
                  objectFit="cover" 
                  className="rounded-md" 
                />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-gradient">Ancient Wonders</h3>
              <p className="text-charcoal text-opacity-80 mb-4">Uncovering the secrets of past civilizations and their monuments.</p>
              <Button className="button-outline-gradient">
                Explore History
              </Button>
            </Card>
            {/* Example Content Card 2 */}
            <Card className="p-6 shadow-lg overflow-hidden border border-gray-200">
              <div className="relative w-full h-48 mb-4">
                <Image 
                  src="https://images.unsplash.com/photo-1534351590666-13e3e96b5017?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                  alt="Cultural Festival" 
                  layout="fill" 
                  objectFit="cover" 
                  className="rounded-md" 
                />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-gradient">Cultural Immersion</h3>
              <p className="text-charcoal text-opacity-80 mb-4">Experiencing the vibrant traditions and lifestyles of different cultures.</p>
              <Button className="button-outline-gradient">
                Discover Cultures
              </Button>
            </Card>
            {/* Example Content Card 3 */}
            <Card className="p-6 shadow-lg overflow-hidden border border-gray-200">
              <div className="relative w-full h-48 mb-4">
                <Image 
                  src="https://images.unsplash.com/photo-1505159940484-eb2b9f2588e2?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                  alt="Historical Map" 
                  layout="fill" 
                  objectFit="cover" 
                  className="rounded-md" 
                />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-gradient">Mapping Time</h3>
              <p className="text-charcoal text-opacity-80 mb-4">Connecting historical events and their impact across different locations.</p>
              <Button className="button-outline-gradient">
                See Connections
              </Button>
            </Card>
          </div>
          
          <div className="text-center">
             <Button style={{ backgroundColor: timeZonePrimary }} className="button-primary hover:opacity-90"> {/* Keep primary button style */}
                View All TimeZone Posts
             </Button>
          </div>
        </div>
      </section>

      {/* Add more sections specific to TimeZone Travelers */}
    </div>
  );
}
