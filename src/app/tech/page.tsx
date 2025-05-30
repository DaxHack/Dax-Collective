// src/app/tech/page.tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image"; // Import Next.js Image component

export default function TechPage() {
  return (
    <div className="dax-tech">
      {/* Hero Section for Tech */}
      <section 
        className="hero-section flex items-center justify-center text-white relative"
      >
        <Image 
          src="/images/1000003328.jpg" 
          alt="Tech background" 
          layout="fill" 
          objectFit="cover" 
          quality={80} 
          className="absolute inset-0 z-0" 
          priority // Prioritize loading hero image
        />
        <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
        <div className="container mx-auto px-6 py-24 text-center hero-content relative z-20">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">Dax Tech</h1> {/* Ensure white text */}
          <p className="text-xl md:text-2xl mb-8 text-white text-opacity-90">Building innovative apps and exploring the world of technology.</p>
          <Button className="button-primary bg-tech-purple hover:bg-tech-purple/90"> {/* Keep primary button style */}
            View My Projects
          </Button>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-soft-cream">
        <div className="container mx-auto px-6">
          <h2 className="section-title text-center mb-12">Featured Tech Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Example Project Card 1 */}
            <Card className="p-6 shadow-lg overflow-hidden border border-gray-200">
              <div className="relative w-full h-48 mb-4">
                <Image 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                  alt="App Screenshot" 
                  layout="fill" 
                  objectFit="cover" 
                  className="rounded-md" 
                />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-gradient">Productivity App</h3>
              <p className="text-charcoal text-opacity-80 mb-4">A mobile application designed to help users manage tasks and boost productivity.</p>
              <Button className="button-outline-gradient">
                Learn More
              </Button>
            </Card>
            {/* Example Project Card 2 */}
            <Card className="p-6 shadow-lg overflow-hidden border border-gray-200">
              <div className="relative w-full h-48 mb-4">
                <Image 
                  src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                  alt="Code on Screen" 
                  layout="fill" 
                  objectFit="cover" 
                  className="rounded-md" 
                />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-gradient">Open Source Tool</h3>
              <p className="text-charcoal text-opacity-80 mb-4">Contributing to the developer community with useful open-source libraries.</p>
              <Button className="button-outline-gradient">
                View on GitHub
              </Button>
            </Card>
            {/* Example Project Card 3 */}
            <Card className="p-6 shadow-lg overflow-hidden border border-gray-200">
              <div className="relative w-full h-48 mb-4">
                <Image 
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                  alt="AI Concept" 
                  layout="fill" 
                  objectFit="cover" 
                  className="rounded-md" 
                />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-gradient">AI Experiments</h3>
              <p className="text-charcoal text-opacity-80 mb-4">Exploring the possibilities of artificial intelligence and machine learning.</p>
              <Button className="button-outline-gradient">
                Read Blog Post
              </Button>
            </Card>
          </div>
          
          <div className="text-center">
             <Button className="button-primary bg-tech-purple hover:bg-tech-purple/90"> {/* Keep primary button style */}
                See All Tech Content
             </Button>
          </div>
        </div>
      </section>

      {/* Add more sections like skills, specific project details etc. */}
    </div>
  );
}
