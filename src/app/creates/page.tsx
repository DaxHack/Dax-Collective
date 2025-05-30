// src/app/creates/page.tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image"; // Import Next.js Image component

export default function CreatesPage() {
  return (
    <div className="dax-creates">
      {/* Hero Section for Creates */}
      <section 
        className="hero-section flex items-center justify-center text-white relative"
      >
        <Image 
          src="/images/1000003325.jpg" 
          alt="Creative background" 
          layout="fill" 
          objectFit="cover" 
          quality={80} 
          className="absolute inset-0 z-0" 
          priority // Prioritize loading hero image
        />
        <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
        <div className="container mx-auto px-6 py-24 text-center hero-content relative z-20">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">Dax Creates</h1> {/* Ensure white text */}
          <p className="text-xl md:text-2xl mb-8 text-white text-opacity-90">Bringing ideas to life through journals, stickers, and apparel.</p>
          <Button className="button-primary bg-creative-pink hover:bg-creative-pink/90"> {/* Keep primary button style */}
            Shop Latest Products
          </Button>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-soft-cream">
        <div className="container mx-auto px-6">
          <h2 className="section-title text-center mb-12">Featured Creations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Example Product Card 1 */}
            <Card className="p-6 shadow-lg overflow-hidden border border-gray-200">
              <div className="relative w-full h-48 mb-4">
                <Image 
                  src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                  alt="Journal" 
                  layout="fill" 
                  objectFit="cover" 
                  className="rounded-md" 
                />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-gradient">Guided Journals</h3>
              <p className="text-charcoal text-opacity-80 mb-4">Beautifully designed journals to inspire reflection and creativity.</p>
              <Button className="button-outline-gradient">
                View Details
              </Button>
            </Card>
            {/* Example Product Card 2 */}
            <Card className="p-6 shadow-lg overflow-hidden border border-gray-200">
              <div className="relative w-full h-48 mb-4">
                <Image 
                  src="https://images.unsplash.com/photo-1629907739894-5454935a697c?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                  alt="Stickers" 
                  layout="fill" 
                  objectFit="cover" 
                  className="rounded-md" 
                />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-gradient">Unique Stickers</h3>
              <p className="text-charcoal text-opacity-80 mb-4">Add personality to your belongings with custom sticker designs.</p>
              <Button className="button-outline-gradient">
                View Details
              </Button>
            </Card>
            {/* Example Product Card 3 */}
            <Card className="p-6 shadow-lg overflow-hidden border border-gray-200">
              <div className="relative w-full h-48 mb-4">
                <Image 
                  src="https://images.unsplash.com/photo-1523381294911-8d3cead13475?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                  alt="T-shirt" 
                  layout="fill" 
                  objectFit="cover" 
                  className="rounded-md" 
                />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-gradient">Faith-Based Apparel</h3>
              <p className="text-charcoal text-opacity-80 mb-4">Wear your faith with inspiring and stylish t-shirt designs.</p>
              <Button className="button-outline-gradient">
                View Details
              </Button>
            </Card>
          </div>
          
          <div className="text-center">
             <Button className="button-primary bg-creative-pink hover:bg-creative-pink/90"> {/* Keep primary button style */}
                Visit Shop
             </Button>
          </div>
        </div>
      </section>

      {/* Add more sections like product categories, design process etc. */}
    </div>
  );
}
