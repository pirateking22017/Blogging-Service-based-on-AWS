// pages/my-posts.js
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getCurrentUser } from "aws-amplify/auth";
import { postsByUsername } from "../../../graphql/queries";
import { deletePost as deletePostMutation } from "../../../graphql/mutations";

import { Amplify } from "aws-amplify"; // Combined imports for clarity
import awsmobile from "../../../aws-exports"; // Configuration file for AWS Amplify
import { generateClient } from "aws-amplify/api";
import { Card } from "../../components/ui/card";

// Configure Amplify with the exported settings
Amplify.configure(awsmobile);

const client = generateClient();

export default function MyPosts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    const username = await currentAuthenticatedUser(); // Fetch the username
    const postData = await client.graphql({
      query: postsByUsername,
      variables: { username },
    });
    setPosts(postData.data.postsByUsername.items);
  }

  async function currentAuthenticatedUser() {
    try {
      const user = await getCurrentUser();
      return user.username; // Return the username
    } catch (err) {
      console.error("Error getting current user:", err);
      return null; // Handle error case
    }
  }

  async function deletePost(id) {
    await client.graphql({
      // Use the client to execute the delete mutation
      query: deletePostMutation,
      variables: { input: { id } },
      //authMode: "AMAZON_COGNITO_USER_POOLS",
    });

    fetchPosts(); // Refresh posts after deletion
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-wide mt-6 mb-2">
        My Posts
      </h1>
      {posts.map((post, index) => (
        <div key={index} className="border-b border-gray-300 mt-8 pb-4">
          <Card className="my-6 p-10 w-full shadow-md hover:shadow-lg transition-shadow duration-200">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="text-gray-500 mt-2 mb-2">Author: {post.username}</p>
            <Link href={`/edit-post/${post.id}`} legacyBehavior>
              <a className="text-sm mr-4 text-blue-500">Edit Post</a>
            </Link>
            <Link href={`/posts?pageId=${post.id}`} legacyBehavior>
              <a className="text-sm mr-4 text-blue-500">View Post</a>
            </Link>
            <button
              className="text-sm mr-4 text-red-500"
              onClick={() => {
                console.log(`Deleting post with id: ${post.id}`);
                deletePost(post.id);
              }}
            >
              Delete Post
            </button>
          </Card>
        </div>
      ))}
    </div>
  );
}
