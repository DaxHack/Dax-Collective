// src/app/anime/page.tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image"; // Import Next.js Image component

export default function AnimePage() {
  return (
    <div className="dax-anime">
      {/* Hero Section for Anime */}
      <section 
        className="hero-section flex items-center justify-center text-white relative"
      >
        <Image 
          src="/images/1000003329.jpg" 
          alt="Anime background" 
          layout="fill" 
          objectFit="cover" 
          quality={80} 
          className="absolute inset-0 z-0" 
          priority // Prioritize loading hero image
        />
        <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
        <div className="container mx-auto px-6 py-24 text-center hero-content relative z-20">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">Dax Anime</h1> {/* Ensure white text */}
          <p className="text-xl md:text-2xl mb-8 text-white text-opacity-90">Exploring captivating stories and characters from the world of anime.</p>
          <Button className="button-primary bg-anime-pink hover:bg-anime-pink/90"> {/* Keep primary button style */}
            Watch Latest Video
          </Button>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-soft-cream">
        <div className="container mx-auto px-6">
          <h2 className="section-title text-center mb-12">Featured Anime Content</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Example Content Card 1 */}
            <Card className="p-6 shadow-lg overflow-hidden border border-gray-200">
              <div className="relative w-full h-48 mb-4">
                <Image 
                  src="https://images.unsplash.com/photo-1613376023733-0a7536f6d6b2?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                  alt="Re:Zero Characters" 
                  layout="fill" 
                  objectFit="cover" 
                  className="rounded-md" 
                />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-gradient">Re:Zero Deep Dive</h3>
              <p className="text-charcoal text-opacity-80 mb-4">Analyzing characters, plot points, and theories from Re:Zero.</p>
              <Button className="button-outline-gradient">
                Read Analysis
              </Button>
            </Card>
            {/* Example Content Card 2 */}
            <Card className="p-6 shadow-lg overflow-hidden border border-gray-200">
              <div className="relative w-full h-48 mb-4">
                <Image 
                  src="https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                  alt="Anime Scene" 
                  layout="fill" 
                  objectFit="cover" 
                  className="rounded-md" 
                />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-gradient">Seasonal Reviews</h3>
              <p className="text-charcoal text-opacity-80 mb-4">Sharing my thoughts on the latest anime releases each season.</p>
              <Button className="button-outline-gradient">
                Watch Review
              </Button>
            </Card>
            {/* Example Content Card 3 */}
            <Card className="p-6 shadow-lg overflow-hidden border border-gray-200">
              <div className="relative w-full h-48 mb-4">
                <Image 
                  src="https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                  alt="Anime Collection" 
                  layout="fill" 
                  objectFit="cover" 
                  className="rounded-md" 
                />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-gradient">Top Anime Lists</h3>
              <p className="text-charcoal text-opacity-80 mb-4">My personal recommendations and rankings for various anime genres.</p>
              <Button className="button-outline-gradient">
                See Lists
              </Button>
            </Card>
          </div>
          
          <div className="text-center">
             <Button className="button-primary bg-anime-pink hover:bg-anime-pink/90"> {/* Keep primary button style */}
                Explore All Anime Content
             </Button>
          </div>
        </div>
      </section>

      {/* Add more sections like character spotlights, episode reviews etc. */}
    </div>
  );
}
