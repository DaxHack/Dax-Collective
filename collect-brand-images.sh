#!/bin/bash
# Image Collection Script for Dax Collective Brands

echo "🎨 Starting Image Collection for Dax Collective Brands..."

# Create directory structure if it doesn't exist
echo "📁 Creating directory structure..."
mkdir -p public/images/brands/{dax-collective,dax-the-traveler,timezone-travelers,ani-dax,gods-vessel}/{hero,content,gallery}
mkdir -p public/images/shared/{backgrounds,patterns,icons,ui-elements}
mkdir -p public/images/temp/auto-sourced

# Function to search and download images
search_and_download() {
    local brand=$1
    local category=$2
    local query=$3
    local count=${4:-5}
    
    echo "🔍 Searching for $brand $category images: '$query'"
    
    # This would integrate with your actual image search
    # For now, we'll create placeholder structure
    local target_dir="public/images/brands/$brand/$category"
    
    # Create index file for this category
    cat > "$target_dir/index.json" << EOF
{
  "brand": "$brand",
  "category": "$category", 
  "query": "$query",
  "images": [],
  "lastUpdated": "$(date -Iseconds)",
  "totalImages": 0
}
EOF
}

# Dax Collective Brand Images
echo "🏢 Processing Dax Collective images..."
search_and_download "dax-collective" "hero" "entrepreneur travel faith creativity"
search_and_download "dax-collective" "content" "business adventure inspiration"
search_and_download "dax-collective" "gallery" "portfolio projects achievements"

# Dax the Traveler Images  
echo "✈️ Processing Dax the Traveler images..."
search_and_download "dax-the-traveler" "hero" "travel adventure wanderlust"
search_and_download "dax-the-traveler" "content" "destinations journey exploration"
search_and_download "dax-the-traveler" "gallery" "travel photography adventure photos"

# Timezone Travelers Images
echo "🌍 Processing Timezone Travelers images..."
search_and_download "timezone-travelers" "hero" "travel guides itinerary planning"
search_and_download "timezone-travelers" "content" "destination guides travel tips"
search_and_download "timezone-travelers" "gallery" "world destinations travel maps"

# Ani-Dax Images
echo "🎌 Processing Ani-Dax images..."
search_and_download "ani-dax" "hero" "anime manga otaku culture"
search_and_download "ani-dax" "content" "anime reviews analysis characters"
search_and_download "ani-dax" "gallery" "anime collection manga art"

# God's Vessel Images
echo "✝️ Processing God's Vessel images..."
search_and_download "gods-vessel" "hero" "faith christian inspiration"
search_and_download "gods-vessel" "content" "bible verses spiritual quotes"
search_and_download "gods-vessel" "gallery" "christian art faith imagery"

# Copy existing brand images to organized structure
echo "📋 Organizing existing brand images..."

# Check if images exist and copy them
if [ -f "public/images/dax-collective.jpg" ]; then
    cp "public/images/dax-collective.jpg" "public/images/brands/dax-collective/hero/"
    echo "✅ Moved dax-collective.jpg to organized structure"
fi

if [ -f "public/images/dax-the travaler.jpg" ]; then
    cp "public/images/dax-the travaler.jpg" "public/images/brands/dax-the-traveler/hero/"
    echo "✅ Moved dax-the travaler.jpg to organized structure"
fi

if [ -f "public/images/ani-dax.jpg" ]; then
    cp "public/images/ani-dax.jpg" "public/images/brands/ani-dax/hero/"
    echo "✅ Moved ani-dax.jpg to organized structure"
fi

if [ -f "public/images/gods-vessel.jpg" ]; then
    cp "public/images/gods-vessel.jpg" "public/images/brands/gods-vessel/hero/"
    echo "✅ Moved gods-vessel.jpg to organized structure"
fi

if [ -f "public/images/timezone-travelers.jpg" ]; then
    cp "public/images/timezone-travelers.jpg" "public/images/brands/timezone-travelers/hero/"
    echo "✅ Moved timezone-travelers.jpg to organized structure"
fi

# Create master image index
echo "📊 Creating master image index..."
cat > "public/images/image-index.json" << EOF
{
  "lastUpdated": "$(date -Iseconds)",
  "brands": {
    "dax-collective": {
      "hero": "/images/brands/dax-collective/hero/",
      "content": "/images/brands/dax-collective/content/",
      "gallery": "/images/brands/dax-collective/gallery/"
    },
    "dax-the-traveler": {
      "hero": "/images/brands/dax-the-traveler/hero/",
      "content": "/images/brands/dax-the-traveler/content/",
      "gallery": "/images/brands/dax-the-traveler/gallery/"
    },
    "timezone-travelers": {
      "hero": "/images/brands/timezone-travelers/hero/",
      "content": "/images/brands/timezone-travelers/content/",
      "gallery": "/images/brands/timezone-travelers/gallery/"
    },
    "ani-dax": {
      "hero": "/images/brands/ani-dax/hero/",
      "content": "/images/brands/ani-dax/content/",
      "gallery": "/images/brands/ani-dax/gallery/"
    },
    "gods-vessel": {
      "hero": "/images/brands/gods-vessel/hero/",
      "content": "/images/brands/gods-vessel/content/",
      "gallery": "/images/brands/gods-vessel/gallery/"
    }
  },
  "shared": {
    "backgrounds": "/images/shared/backgrounds/",
    "patterns": "/images/shared/patterns/",
    "icons": "/images/shared/icons/",
    "ui-elements": "/images/shared/ui-elements/"
  }
}
EOF

echo "✅ Image collection and organization complete!"
echo "📁 Directory structure created in public/images/"
echo "📋 Image index created at public/images/image-index.json"
echo ""
echo "🎯 Next steps:"
echo "1. Update your components to use the new image paths"
echo "2. Implement actual image search and download functionality"
echo "3. Test the BrandGallery components with the new structure"
