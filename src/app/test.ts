"use client";

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/api";
import * as queries from "../../../../graphql/queries";  // GraphQL query
import awsmobile from "../../../../aws-exports";  // AWS config
import { Amplify } from "aws-amplify";
import { getUrl } from 'aws-amplify/storage';  // Import getUrl for S3 image fetching

Amplify.configure(awsmobile);  // Configure Amplify
const client = generateClient();

const PostPage = () => {
  const searchParams = useSearchParams();
  const pageId = searchParams.get('pageId');

  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState(null);  // State to store image URL

  const fallbackImage = "https://via.placeholder.com/600x400?text=No+Image+Available";  // Fallback image URL

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
          setError("Post not found");
          return;
        }

        setPost(fetchedPost);

        // Fetch image URL if the post has an image
        if (fetchedPost.coverImage) {
          try {
            const result = await getUrl({
              path: fetchedPost.coverImage,  // Assuming 'coverImage' field contains the S3 path
              options: {
                expiresIn: 900,  // URL validity (15 minutes)
              },
            });

            setImageUrl(result.url);  // Store the signed URL
          } catch (err) {
            console.warn("Error fetching image from S3:", err);
            setImageUrl(fallbackImage);  // Set fallback image if there is an error
          }
        } else {
          setImageUrl(fallbackImage);  // Set fallback image if no coverImage is provided
        }
      } catch (err) {
        setError("Error fetching post: " + err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [pageId]);

  if (isLoading) {
    return <div>Loading post details...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  if (post) {
    return (
      <div>
        <h1>{post.title}</h1>
        <p>{post.content}</p>
        <p><strong>Posted by:</strong> {post.username}</p>
        <p><strong>Created at:</strong> {new Date(post.createdAt).toLocaleString()}</p>

        {/* Display image if available, otherwise show fallback image */}
        <div>
          <h3>Image:</h3>
          <img src={imageUrl || fallbackImage} alt="Post Image" style={{ maxWidth: "100%", height: "auto" }} />
        </div>
      </div>
    );
  }

  return <div>No post found</div>;
};

export default PostPage;



