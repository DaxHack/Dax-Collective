// src/components/BlogPostCard.tsx
import Link from "next/link";
import { PostData } from "@/lib/posts"; // Assuming PostData interface is exported from posts.ts
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface BlogPostCardProps {
  post: PostData;
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  // Determine brand color based on post.brand
  let brandColor = "hsl(var(--deep-teal))"; // Default color
  let hoverBgColor = "hover:bg-deep-teal/90";
  if (post.brand === "travels") {
    brandColor = "hsl(var(--ocean-blue))";
    hoverBgColor = "hover:bg-ocean-blue/90";
  } else if (post.brand === "creates") {
    brandColor = "hsl(var(--creative-pink))";
    hoverBgColor = "hover:bg-creative-pink/90";
  } else if (post.brand === "tech") {
    brandColor = "hsl(var(--tech-purple))";
    hoverBgColor = "hover:bg-tech-purple/90";
  } else if (post.brand === "anime") {
    brandColor = "hsl(var(--anime-pink))";
    hoverBgColor = "hover:bg-anime-pink/90";
  } else if (post.brand === "timezone") {
    brandColor = "hsl(var(--deep-teal))"; // Example: Use deep-teal for timezone
    hoverBgColor = "hover:bg-deep-teal/90";
  }

  return (
    <Card className="p-6 shadow-lg transition-all duration-300 hover:shadow-xl" style={{ borderTop: `4px solid ${brandColor}` }}>
      <h3 className="text-2xl font-bold mb-2" style={{ color: brandColor }}>
        <Link href={`/blog/${post.id}`} className="hover:underline">
          {post.title}
        </Link>
      </h3>
      <p className="text-sm text-gray-600 mb-3">{post.date} by {post.author}</p>
      <p className="text-charcoal mb-4">{post.summary}</p>
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          {post.tags.map((tag) => (
            <span key={tag} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">{tag}</span>
          ))}
        </div>
        <Button 
          variant="outline" 
          style={{ color: brandColor, borderColor: brandColor }} 
          className={`${hoverBgColor.replace("hover:bg-", "hover:bg-")} hover:text-white`} // Dynamically set hover background
          asChild
        >
          <Link href={`/blog/${post.id}`}>Read More</Link>
        </Button>
      </div>
    </Card>
  );
}
