#!/bin/bash
# Verification Script - Check Image Folder Structure

echo "🔍 Verifying Image Folder Structure..."
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: You're not in the Dax-Main directory!"
    echo "Please navigate to your Dax-Main folder first:"
    echo "cd path/to/your/Dax-Main"
    exit 1
fi

echo "✅ Found package.json - You're in the right directory!"
echo ""

# Check if public/images exists
if [ ! -d "public/images" ]; then
    echo "❌ public/images directory doesn't exist"
    echo "Creating it now..."
    mkdir -p public/images
else
    echo "✅ public/images directory exists"
fi

# Check for existing brand images
echo ""
echo "📋 Checking for existing brand images:"

existing_images=()
if [ -f "public/images/dax-collective.jpg" ]; then
    echo "✅ Found: dax-collective.jpg"
    existing_images+=("dax-collective.jpg")
fi

if [ -f "public/images/dax-the-travaler.jpg" ]; then
    echo "✅ Found: dax-the-travaler.jpg"
    existing_images+=("dax-the-traveler.jpg")
fi

if [ -f "public/images/ani-dax.jpg" ]; then
    echo "✅ Found: ani-dax.jpg"
    existing_images+=("ani-dax.jpg")
fi

if [ -f "public/images/gods-vessel.jpg" ]; then
    echo "✅ Found: gods-vessel.jpg"
    existing_images+=("gods-vessel.jpg")
fi

if [ -f "public/images/timezone-travelers.jpg" ]; then
    echo "✅ Found: timezone-travelers.jpg"
    existing_images+=("timezone-travelers.jpg")
fi

if [ ${#existing_images[@]} -eq 0 ]; then
    echo "⚠️  No existing brand images found in public/images/"
    echo "   This is okay - the script will still create the folder structure"
else
    echo "📊 Found ${#existing_images[@]} existing brand images"
fi

echo ""
echo "🎯 Ready to run the image collection script!"
echo ""
echo "Next steps:"
echo "1. Run: ./collect-brand-images.sh"
echo "2. Check the created folder structure"
echo "3. Verify your images were moved correctly"
