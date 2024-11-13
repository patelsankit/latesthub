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
        if (postId) {
          const postRef = doc(db, "posts", postId);
          await updateDoc(postRef, { title, content, imageUrl });
          setMessage("Post updated successfully!");
        } else {
          await addDoc(collection(db, "posts"), { title, content, imageUrl });
          setMessage("New post added successfully!");
        }
        // Reset fields after saving/updating
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
        <h2 className="text-center">Admin - Manage Blog</h2>

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
            className="bg-blue-500 text-white p-2 rounded"
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

        {/* Display All Posts */}
        <h3 className="text-center mb-4">All Posts</h3>
        <div className="grid gap-4">
          {posts.map((post) => (
            <div key={post.id} className="p-4 bg-white rounded shadow-md">
              <h3 className="font-bold">{post.title}</h3>
              <p>{post.content}</p>
              {post.imageUrl && (
                <img src={post.imageUrl} alt={post.title} className="mt-2" />
              )}
              <div className="mt-2 flex justify-between">
                <button
                  onClick={() => editPost(post)}
                  className="bg-yellow-500 text-white p-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => deletePost(post.id)}
                  className="bg-red-500 text-white p-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdminPage;
