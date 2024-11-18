"use client";

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from "react";
import { generateClient } from "aws-amplify/api";
import * as queries from "../../../graphql/queries";
import awsmobile from "../../../aws-exports";
import { Amplify } from "aws-amplify";
import { getUrl } from 'aws-amplify/storage';
import DOMPurify from 'dompurify';

Amplify.configure(awsmobile);
const client = generateClient();

const PostPage = () => {
  const searchParams = useSearchParams();
  const pageId = searchParams.get('pageId'); // Only available on client-side

  const [post, setPost] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!pageId) {
      console.log("pageId not yet available, skipping fetch...");
      return;
    }

    const fetchPost = async () => {
      try {
        console.log("Fetching post with ID:", pageId);
        setIsLoading(true);
        const postDetails = await client.graphql({
          query: queries.getPost,
          variables: { id: pageId },
        });

        const fetchedPost = postDetails?.data?.getPost;

        if (!fetchedPost) {
          console.log("Post not found for pageId:", pageId);
          setError("Post not found");
          return;
        }

        console.log("Fetched post:", fetchedPost);
        setPost(fetchedPost);

        if (fetchedPost.coverImage) {
          const getUrlResult = await getUrl({
            path: fetchedPost.coverImage,
            options: {
              expiresIn: 900,
              useAccelerateEndpoint: true,
            },
          });
          setImageUrl(getUrlResult.url);
          console.log('Image URL:', getUrlResult.url);
        }
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Error fetching post: " + err.message);
      } finally {
        console.log("Fetch complete for post:", pageId);
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [pageId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <article className="bg-white shadow-lg rounded-lg overflow-hidden">
          {imageUrl && (
            <div className="flex justify-center">
              <img 
                src={imageUrl} 
                alt="Post Cover" 
                className="max-w-full h-auto"
              />
            </div>
          )}
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
            />
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                <strong>Posted by:</strong> {post.username}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Created at:</strong> {new Date(post.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <p className="text-center text-gray-600">No post found</p>
    </div>
  );
};

export default function PostPageWithSuspense() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PostPage />
    </Suspense>
  );
}
