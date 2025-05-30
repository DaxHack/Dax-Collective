// src/app/travels/page.tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image"; // Import Next.js Image component

export default function TravelsPage() {
  return (
    <div className="dax-travels">
      {/* Hero Section for Travels */}
      <section 
        className="hero-section flex items-center justify-center text-white relative"
      >
        <Image 
          src="/images/1000003327.jpg" 
          alt="Travel background" 
          layout="fill" 
          objectFit="cover" 
          quality={80} 
          className="absolute inset-0 z-0" 
          priority // Prioritize loading hero image
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
        
        <div className="container mx-auto px-6 py-24 text-center hero-content relative z-20"> 
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">Dax Travels</h1> {/* Ensure white text */} 
          <p className="text-xl md:text-2xl mb-8 text-white text-opacity-90">Exploring the world, one adventure at a time.</p>
          <Button className="button-primary bg-ocean-blue hover:bg-ocean-blue/90"> {/* Keep primary button style for main CTA */}
            View Latest Trip
          </Button>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-soft-cream">
        <div className="container mx-auto px-6">
          <h2 className="section-title text-center mb-12">Discover My Journeys</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Example Content Card 1 */}
            <Card className="p-6 shadow-lg overflow-hidden border border-gray-200"> 
              <div className="relative w-full h-48 mb-4">
                <Image 
                  src="/images/1000003330.jpg" 
                  alt="Coastal View" 
                  layout="fill" 
                  objectFit="cover" 
                  className="rounded-md" 
                />
              </div>
              {/* Use text-gradient for card titles? Or keep brand color? Let's try gradient */}
              <h3 className="text-2xl font-bold mb-2 text-gradient">Coastal Escapes</h3> 
              <p className="text-charcoal text-opacity-80 mb-4">Sun, sand, and sea. Recounting my latest beach adventures.</p>
              {/* Use new gradient outline button */}
              <Button className="button-outline-gradient">
                Read More
              </Button>
            </Card>
            {/* Example Content Card 2 */}
            <Card className="p-6 shadow-lg overflow-hidden border border-gray-200">
              <div className="relative w-full h-48 mb-4">
                <Image 
                  src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                  alt="Mountain View" 
                  layout="fill" 
                  objectFit="cover" 
                  className="rounded-md" 
                />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-gradient">Mountain Highs</h3>
              <p className="text-charcoal text-opacity-80 mb-4">Hiking trails and breathtaking views from elevated perspectives.</p>
              <Button className="button-outline-gradient">
                Read More
              </Button>
            </Card>
            {/* Example Content Card 3 */}
            <Card className="p-6 shadow-lg overflow-hidden border border-gray-200">
              <div className="relative w-full h-48 mb-4">
                <Image 
                  src="https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                  alt="Cityscape" 
                  layout="fill" 
                  objectFit="cover" 
                  className="rounded-md" 
                />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-gradient">Urban Explorations</h3>
              <p className="text-charcoal text-opacity-80 mb-4">Navigating bustling cities and uncovering hidden gems.</p>
              <Button className="button-outline-gradient">
                Read More
              </Button>
            </Card>
          </div>
          
          <div className="text-center">
             {/* Keep primary button style for main section CTA */}
             <Button className="button-primary bg-ocean-blue hover:bg-ocean-blue/90">
                View All Travel Posts
             </Button>
          </div>
        </div>
      </section>

      {/* Add more sections like gallery, specific trip details etc. */}
    </div>
  );
}
