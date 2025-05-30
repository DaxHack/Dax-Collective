// src/app/blog/[slug]/page.tsx
import { getAllPostIds, getPostData, PostData } from "@/lib/posts";
import { notFound } from "next/navigation";

// Define params type
interface PageProps {
  params: {
    slug: string;
  };
}

// Generate static paths for all posts
export async function generateStaticParams() {
  const paths = getAllPostIds();
  return paths.map(path => ({ slug: path.params.slug }));
}

// Fetch data for a specific post
async function getData(slug: string): Promise<PostData | null> {
  try {
    const postData = await getPostData(slug);
    return postData;
  } catch (error) {
    // If the file doesn't exist or there's an error reading it
    return null;
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const postData = await getData(params.slug);

  if (!postData) {
    notFound(); // Return 404 if post not found
  }

  // Determine brand color based on post.brand
  let brandColor = "hsl(var(--deep-teal))"; // Default color
  if (postData.brand === "travels") {
    brandColor = "hsl(var(--ocean-blue))";
  } else if (postData.brand === "creates") {
    brandColor = "hsl(var(--creative-pink))";
  } else if (postData.brand === "tech") {
    brandColor = "hsl(var(--tech-purple))";
  } else if (postData.brand === "anime") {
    brandColor = "hsl(var(--anime-pink))";
  } else if (postData.brand === "timezone") {
    brandColor = "hsl(var(--deep-teal))"; // Example: Use deep-teal for timezone
  }

  return (
    <article className="container mx-auto px-6 py-12 max-w-3xl">
      <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: brandColor }}>
        {postData.title}
      </h1>
      <p className="text-gray-600 mb-8">{postData.date} by {postData.author}</p>
      
      {/* Render the HTML content */}
      <div 
        className="prose lg:prose-xl max-w-none prose-headings:font-bold prose-a:text-blue-600 hover:prose-a:text-blue-800 prose-img:rounded-md prose-img:shadow-md"
        dangerouslySetInnerHTML={{ __html: postData.contentHtml || "" }} 
      />

      {/* Tags */}
      <div className="mt-12 pt-4 border-t border-gray-200">
        <span className="font-semibold">Tags:</span>
        <div className="flex flex-wrap gap-2 mt-2">
          {postData.tags.map((tag) => (
            <span key={tag} className="text-sm bg-gray-200 text-gray-700 px-3 py-1 rounded-full">{tag}</span>
          ))}
        </div>
      </div>
    </article>
  );
}
