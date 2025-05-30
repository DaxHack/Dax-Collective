// src/app/blog/page.tsx
import { getSortedPostsData, PostData } from "@/lib/posts";
import BlogPostCard from "@/components/BlogPostCard";

export default function BlogListPage() {
  const allPostsData: PostData[] = getSortedPostsData();

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-12 text-center section-title">Dax Collective Blog</h1>
      
      {allPostsData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allPostsData.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-center text-xl text-gray-600">No blog posts yet. Stay tuned!</p>
      )}
    </div>
  );
}
