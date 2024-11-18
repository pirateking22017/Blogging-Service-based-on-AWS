"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from 'next/dynamic';
import { generateClient } from "aws-amplify/api";
import * as mutations from "../../../graphql/mutations";
import { getCurrentUser } from "aws-amplify/auth";
import { uploadData } from "aws-amplify/storage";
import { Amplify } from "aws-amplify";
import awsmobile from "../../../aws-exports";

// Dynamically import ReactQuill with SSR disabled
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import "react-quill/dist/quill.snow.css";

Amplify.configure(awsmobile);

const client = generateClient();

const CreatePost = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const hiddenFileInput = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [isSessionLoaded, setIsSessionLoaded] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const fetchUserSession = async () => {
      try {
        const currentUser = await getCurrentUser();
        const { username } = currentUser;
        setUser({ username });
      } catch (err) {
        setError("Authentication failed: " + (err.message || err));
      } finally {
        setIsSessionLoaded(true);
      }
    };

    fetchUserSession();
  }, []);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const imagePath = `public/album/2024/${file.name}`;

    try {
      const result = await uploadData({
        path: imagePath,
        data: file,
        options: {
          onProgress: (progress) =>
            setUploadProgress((progress.loaded / progress.total) * 100),
        },
      });

      console.log("Upload succeeded:", result);
      setImage(imagePath);
    } catch (err) {
      console.error("Error uploading file:", err);
      setError(`Error uploading image: ${err.message || JSON.stringify(err)}`);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!user) {
      setError("You must be logged in to create a post");
      setIsLoading(false);
      return;
    }

    const postDetails = {
      title,
      content,
      username: user.username,
      coverImage: image,
    };

    console.log("Parameters for createPost mutation:", postDetails);

    try {
      const newPost = await client.graphql({
        query: mutations.createPost,
        variables: { input: postDetails },
      });

      console.log("New Post Response:", newPost);

      const postId = newPost?.data?.createPost?.id;
      if (postId) {
        router.push(`/posts?pageId=${postId}`);
      } else {
        setError("Post creation failed. No ID returned.");
      }
    } catch (err) {
      setError(`Error creating post: ${err.message || JSON.stringify(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadClick = () => {
    hiddenFileInput.current.click();
  };

  if (!isSessionLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundImage: "url('/placeholder.svg')", backgroundSize: "cover", backgroundPosition: "center" }}>
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="px-6 py-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Create a New Post
          </h1>

          {error && (
            <p className="text-red-500 text-center mb-4 bg-red-100 p-2 rounded">
              {error}
            </p>
          )}

          {!user ? (
            <div className="text-center">
              <h3 className="text-xl mb-4">You must log in to create a post</h3>
              <button
                onClick={() => router.push("/login")}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
              >
                Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={handleCreatePost} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your post title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                <ReactQuill
                  value={content}
                  onChange={setContent}
                  theme="snow"
                  className="bg-white rounded-md shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image Upload
                </label>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={handleUploadClick}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Upload Image
                  </button>
                  <input
                    type="file"
                    ref={hiddenFileInput}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                {uploadProgress > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-1">
                      Upload Progress: {uploadProgress.toFixed(2)}%
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-500 h-2.5 rounded-full"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                }`}
              >
                {isLoading ? "Creating..." : "Create Post"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePost;