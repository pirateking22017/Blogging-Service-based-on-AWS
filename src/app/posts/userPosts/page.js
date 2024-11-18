"use client"; 
import { useState, useEffect } from "react";
import { getCurrentUser } from "aws-amplify/auth"; // Get current authenticated user
import { generateClient } from "aws-amplify/api";
import { postsByUsername } from "../../../../graphql/queries"; // Query to fetch posts by username
import { deletePost } from "../../../../graphql/mutations"; // Import delete mutation
import { useRouter } from "next/navigation"; // For routing to the Edit page
import awsmobile from "../../../../aws-exports"; // AWS config file
import { Amplify } from "aws-amplify";

Amplify.configure(awsmobile); // Configure Amplify with AWS settings

const client = generateClient();

export default function UserPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState(null);
  const router = useRouter(); // For redirecting to Edit page

  // Fetch user data and posts on component mount
  useEffect(() => {
    const fetchUserAndPosts = async () => {
      try {
        // Fetch current user to get the username
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          setError("User is not logged in.");
          return;
        }

        const { username } = currentUser;
        setUsername(username);

        // Query the posts for the fetched username
        const variables = {
          username,
          limit: 10,
          nextToken: null,
        };

        const postData = await client.graphql({
          query: postsByUsername,
          variables,
        });

        const { items } = postData.data.postsByUsername;
        setPosts(items); // Store posts in state
        setLoading(false);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Error fetching posts: " + err.message);
        setLoading(false);
      }
    };

    fetchUserAndPosts();
  }, []); // Run only once when the component mounts

  // Handle post deletion
  const handleDelete = async (id) => {
    console.log('Deleting post with ID:', id);
    try {
      const response = await client.graphql({
        query: deletePost,
        variables: { input: { id } },
      });
      console.log('Delete response:', response); // Log the full response
      // Remove the deleted post from the local state
      setPosts(posts.filter(post => post.id !== id));
    } catch (err) {
      console.error("Error deleting post:", err);
      setError("Error deleting post: " + err.message);
    }
  };
  

  // Render loading, error, or posts
  if (loading) {
    return <div>Loading your posts...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (posts.length === 0) {
    return <div>No posts found for user {username}</div>;
  }

  return (
    <div>
      <h1>Posts by {username}</h1>
      {posts.map((post) => (
        <div key={post.id} className="post-card">
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <p><strong>Created At:</strong> {new Date(post.createdAt).toLocaleString()}</p>
          <div className="post-actions">
            {/* Edit Button */}
            <button onClick={() => router.push(`/edit-post/${post.id}`)}>Edit</button>
            {/* Delete Button */}
            <button onClick={() => handleDelete(post.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
