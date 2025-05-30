// src/lib/posts.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'content/blog');

export interface PostData {
  id: string;
  title: string;
  date: string;
  author: string;
  summary: string;
  tags: string[];
  brand: string;
  contentHtml?: string; // Optional for list view
}

export function getSortedPostsData(): PostData[] {
  // Get file names under /content/blog
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, '');

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Combine the data with the id
    return {
      id,
      title: matterResult.data.title || 'Untitled',
      date: matterResult.data.date || 'No date',
      author: matterResult.data.author || 'Unknown Author',
      summary: matterResult.data.summary || '',
      tags: matterResult.data.tags || [],
      brand: matterResult.data.brand || 'general',
      ...(matterResult.data as { title?: string; date?: string; author?: string; summary?: string; tags?: string[]; brand?: string }),
    };
  });

  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => {
    return {
      params: {
        slug: fileName.replace(/\.md$/, ''),
      },
    };
  });
}

export async function getPostData(slug: string): Promise<PostData> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // Combine the data with the id and contentHtml
  return {
    id: slug,
    contentHtml,
    title: matterResult.data.title || 'Untitled',
    date: matterResult.data.date || 'No date',
    author: matterResult.data.author || 'Unknown Author',
    summary: matterResult.data.summary || '',
    tags: matterResult.data.tags || [],
    brand: matterResult.data.brand || 'general',
    ...(matterResult.data as { title?: string; date?: string; author?: string; summary?: string; tags?: string[]; brand?: string }),
  };
}
