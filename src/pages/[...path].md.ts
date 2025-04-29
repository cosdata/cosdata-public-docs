import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

// Make this a server-side rendered route
export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  try {
    // Remove .md from the path if it exists
    const path = params.path?.replace(/\.md$/, '');
    
    if (!path) {
      return new Response('Not found', { status: 404 });
    }

    // Get all content collections
    const collections = await getCollection('docs');
    
    // Find the matching document
    const doc = collections.find(doc => doc.slug === path);
    
    if (!doc) {
      return new Response('Not found', { status: 404 });
    }

    // Return the raw markdown content
    return new Response(doc.body, {
      headers: {
        'Content-Type': 'text/markdown',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error) {
    console.error('Error serving markdown:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}; 