"use client";
import { useState, useEffect } from "react";
import { db } from "../../../../lib/firebaseConfig";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import dynamic from "next/dynamic";

const QuillNoSSRWrapper = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import Link from "next/link";

interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
}

const AdminPage: React.FC = () => {
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [content, setContent] = useState("");
  const [postId, setPostId] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [message, setMessage] = useState("");

  // Fetch all posts from Firestore
  useEffect(() => {
    const fetchPosts = async () => {
      const querySnapshot = await getDocs(collection(db, "posts"));
      const postsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Post[];
      setPosts(postsData);
    };
    fetchPosts();
  }, [message]); // Re-fetch posts when a message is set (after adding/editing/deleting)

  // Save or update a post
  const savePost = async () => {
    if (title && content) {
      try {
        const plainTextContent = content.replace(/<[^>]*>?/gm, ""); // Strip HTML tags if needed

        if (postId) {
          const postRef = doc(db, "posts", postId);
          await updateDoc(postRef, {
            title,
            content: plainTextContent,
            imageUrl,
          });
          setMessage("Post updated successfully!");
        } else {
          await addDoc(collection(db, "posts"), {
            title,
            content: plainTextContent,
            imageUrl,
          });
          setMessage("New post added successfully!");
        }

        setTitle("");
        setContent("");
        setImageUrl("");
        setPostId(null);
      } catch (error) {
        setMessage("Error saving the post. Please try again.");
      }
    } else {
      alert("Title and content are required.");
    }
  };

  // Load a post into the form for editing
  const editPost = (post: Post) => {
    setTitle(post.title);
    setContent(post.content);
    setImageUrl(post.imageUrl);
    setPostId(post.id);
  };

  // Delete a post
  const deletePost = async (id: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      try {
        await deleteDoc(doc(db, "posts", id));
        setMessage("Post deleted successfully!");
      } catch (error) {
        setMessage("Error deleting the post. Please try again.");
      }
    }
  };

  return (
    <section className="py-20 bg-primary-to-green">
      <div className="container">
        <h2 class="text-center text-xl md:text-2xl xl:text-3xl font-bold my-4">
          My Blogs
        </h2>
        <div className="grid grid-cols-[300px_1fr] px-10 gap-4">
          <div>
            {/* Message Alert */}
            {message && (
              <div className="mb-4 text-center bg-green-200 text-green-800 p-2 rounded">
                {message}
              </div>
            )}

            {/* Form for Adding/Editing Posts */}
            <div className="grid gap-4 mb-8">
              <button
                onClick={savePost}
                className="rounded-md transition duration-200 ease-linear z-50 cursor-pointer px-4 py-3 hover:opacity-70 bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
              >
                {postId ? "Update Post" : "Save Post"}
              </button>
              <input
                type="text"
                placeholder="Blog Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="p-2 border rounded"
              />
              <QuillNoSSRWrapper
                value={content}
                onChange={setContent}
                theme="snow"
              />
            </div>
          </div>
          <div>
            <div className="grid grid-cols-2 gap-4">
              {posts.map((post) => (
                <>
                  <CardContainer
                    key={post.id}
                    className="inter-var w-full h-full !transform-none"
                  >
                    <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full h-full rounded-xl p-6 border  ">
                      <CardItem
                        translateZ="0"
                        translateX="0"
                        translateY="0"
                        className="w-full text-xl font-bold text-neutral-600 dark:text-white"
                      >
                        <div className="mt-2 flex justify-end gap-2">
                          <button
                            onClick={() => editPost(post)}
                            className="w-fit transition duration-200 ease-linear z-50 cursor-pointer px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deletePost(post.id)}
                            className="w-fit transition duration-200 ease-linear z-50 cursor-pointer px-4 py-2 rounded-xl bg-red-500 dark:bg-red-800 dark:text-white text-white text-xs font-bold"
                          >
                            Delete
                          </button>
                        </div>
                      </CardItem>
                      <CardItem
                        translateZ="0"
                        translateX="0"
                        translateY="0"
                        className="text-xl font-bold text-neutral-600 dark:text-white"
                      >
                        {post.title}
                      </CardItem>
                      <CardItem
                        translateZ="0"
                        translateX="0"
                        translateY="0"
                        className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
                      >
                        {post.content}
                      </CardItem>
                      <CardItem
                        translateZ="0"
                        translateX="0"
                        translateY="0"
                        className="w-full mt-4"
                      >
                        {post.imageUrl && (
                          <img
                            src={post.imageUrl}
                            alt={post.title}
                            className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl mt-2"
                          />
                        )}
                      </CardItem>
                    </CardBody>
                  </CardContainer>
                </>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminPage;
