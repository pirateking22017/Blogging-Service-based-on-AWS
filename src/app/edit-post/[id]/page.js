"use client";
import { useEffect, useState, useRef } from "react";
//import { API, Storage } from 'aws-amplify'
import { useRouter } from "next/navigation";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { v4 as uuid } from "uuid";
import { updatePost } from "../../../../graphql/mutations";
import { getPost } from "../../../../graphql/queries";
import { getCurrentUser } from "aws-amplify/auth";
import { Amplify } from "aws-amplify"; // Combined imports for clarity
import awsmobile from "../../../../aws-exports"; // Configuration file for AWS Amplify
import { generateClient } from "aws-amplify/api";
import { useParams } from 'next/navigation'; // Instead of useRouter


// Configure Amplify with the exported settings
Amplify.configure(awsmobile);

const client = generateClient();


export default function EditPost() {
  
  const [post, setPost] = useState(null);
  const router = useRouter();
  
  const [coverImage, setCoverImage] = useState(null);
  const [localImage, setLocalImage] = useState(null);
  const fileInput = useRef(null);
  const { id } = useParams(); 

  useEffect(() => {
    fetchPost()
    async function fetchPost() {
      if (!id) return
      const postData = await client.graphql({ query: getPost, variables: { id }})
      console.log('postData: ', postData)
      setPost(postData.data.getPost)
      if (postData.data.getPost.coverImage) {
        updateCoverImage(postData.data.getPost.coverImage)
      }
    }
  }, [id])
  
  
  if (!post) return null;
  async function updateCoverImage(coverImage) {
    const imageKey = await client.get(coverImage);
    setCoverImage(imageKey);
  }
  async function uploadImage() {
    fileInput.current.click();
  }
  function handleChange(e) {
    const fileUploaded = e.target.files[0];
    if (!fileUploaded) return;
    setCoverImage(fileUploaded);
    setLocalImage(URL.createObjectURL(fileUploaded));
  }
  function onChange(e) {
    setPost(() => ({ ...post, [e.target.name]: e.target.value }));
  }
  const { title, content } = post;
  async function updateCurrentPost() {
    if (!title || !content) return;
    const postUpdated = {
      id,
      content,
      title,
    };
    // check to see if there is a cover image and that it has been updated
    if (coverImage && localImage) {
      const fileName = `${coverImage.name}_${uuid()}`;
      postUpdated.coverImage = fileName;
      await client.put(fileName, coverImage);
    }
    await client.graphql({
      query: updatePost,
      variables: { input: postUpdated }
    });
    console.log("post successfully updated!");
    router.push("/myPosts");
  }
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-wide mt-6 mb-2">
        Edit post
      </h1>
      {coverImage && (
        <img src={localImage ? localImage : coverImage} className="mt-4" />
      )}
      <input
        onChange={onChange}
        name="title"
        placeholder="Title"
        value={post.title}
        className="border-b pb-2 text-lg my-4 focus:outline-none w-full font-light text-gray-500 placeholder-gray-500 y-2"
      />
      <SimpleMDE
        value={post.content}
        onChange={(value) => setPost({ ...post, content: value })}
      />
      <input
        type="file"
        ref={fileInput}
        className="absolute w-0 h-0"
        onChange={handleChange}
      />
      <button
        className="bg-purple-600 text-white font-semibold px-8 py-2 rounded-lg mr-2"
        onClick={uploadImage}
      >
        Upload Cover Image
      </button>
      <button
        className="mb-4 bg-blue-600 text-white font-semibold px-8 py-2 rounded-lg"
        onClick={updateCurrentPost}
      >
        Update Post
      </button>
    </div>
  );
}
