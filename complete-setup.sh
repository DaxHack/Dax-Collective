#!/bin/bash
# Complete Setup Script - Move brand images and add missing folders

echo "🎯 Completing Your Perfect Folder Structure..."
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this from your Dax-Main directory"
    exit 1
fi

echo "✅ Running from Dax-Main directory"
echo ""

# Move brand images to organized structure
echo "📋 Moving brand images to organized folders..."

if [ -f "public/images/ani-dax.jpg" ]; then
    mv "public/images/ani-dax.jpg" "public/images/brands/ani-dax/hero/"
    echo "✅ Moved ani-dax.jpg → brands/ani-dax/hero/"
else
    echo "ℹ️  ani-dax.jpg not found (may already be moved)"
fi

if [ -f "public/images/daxt-the-traveler.jpg" ]; then
    mv "public/images/daxt-the-traveler.jpg" "public/images/brands/dax-the-traveler/hero/"
    echo "✅ Moved daxt-the-traveler.jpg → brands/dax-the-traveler/hero/"
else
    echo "ℹ️  daxt-the-traveler.jpg not found (may already be moved)"
fi

if [ -f "public/images/gods-vessel.jpg" ]; then
    mv "public/images/gods-vessel.jpg" "public/images/brands/gods-vessel/hero/"
    echo "✅ Moved gods-vessel.jpg → brands/gods-vessel/hero/"
else
    echo "ℹ️  gods-vessel.jpg not found (may already be moved)"
fi

# Add missing subfolders for ani-dax
echo ""
echo "📁 Adding missing ani-dax subfolders..."
mkdir -p "public/images/brands/ani-dax/anime-covers"
mkdir -p "public/images/brands/ani-dax/characters"
mkdir -p "public/images/brands/ani-dax/reviews"
echo "✅ Added: anime-covers, characters, reviews"

# Add missing subfolders for timezone-travelers
echo ""
echo "📁 Adding missing timezone-travelers subfolders..."
mkdir -p "public/images/brands/timezone-travelers/guides"
mkdir -p "public/images/brands/timezone-travelers/itineraries"
mkdir -p "public/images/brands/timezone-travelers/maps"
echo "✅ Added: guides, itineraries, maps"

# Create a simple image index for each brand
echo ""
echo "📊 Creating image indexes..."

brands=("dax-collective" "dax-the-traveler" "timezone-travelers" "ani-dax" "gods-vessel")

for brand in "${brands[@]}"; do
    brand_dir="public/images/brands/$brand"
    if [ -d "$brand_dir" ]; then
        # Count images in each subfolder
        hero_count=$(find "$brand_dir/hero" -name "*.jpg" -o -name "*.png" -o -name "*.jpeg" 2>/dev/null | wc -l)
        
        cat > "$brand_dir/index.json" << EOF
{
  "brand": "$brand",
  "lastUpdated": "$(date -Iseconds)",
  "folders": {
    "hero": {
      "path": "/images/brands/$brand/hero/",
      "imageCount": $hero_count
    }
  }
}
EOF
        echo "📋 Created index for $brand (hero: $hero_count images)"
    fi
done

echo ""
echo "🎉 Setup Complete!"
echo ""
echo "📁 Your folder structure is now perfect:"
echo "   ✅ Brand images moved to organized folders"
echo "   ✅ All subfolders created"
echo "   ✅ Image indexes generated"
echo ""
echo "🚀 Ready for:"
echo "   • EnhancedBrandGallery components"
echo "   • Automated image sourcing"
echo "   • Professional image management"
echo ""
echo "🎯 Next: Update your React components to use the new image paths!"
