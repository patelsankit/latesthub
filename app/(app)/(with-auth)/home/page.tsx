"use client";
import { useEffect, useState } from "react";
import { db } from "../../../../lib/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import CardComponentspage from "../nextcomponents/card/page";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import Image from "next/image";
import Link from "next/link";

interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
}

const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const querySnapshot = await getDocs(collection(db, "posts"));
      const postsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Post[];
      setPosts(postsData);
      setLoading(false);
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <>
        <div
          id="loader"
          className="fixed inset-0 flex items-center justify-center h-screen w-screen bg-black/70 z-10"
        >
          <svg className="pl" width="240" height="240" viewBox="0 0 240 240">
            <circle
              className="pl__ring pl__ring--a"
              cx="120"
              cy="120"
              r="105"
              fill="none"
              stroke="#000"
              strokeWidth="20"
              strokeDasharray="0 660"
              strokeDashoffset="-330"
              strokeLinecap="round"
            ></circle>
            <circle
              className="pl__ring pl__ring--b"
              cx="120"
              cy="120"
              r="35"
              fill="none"
              stroke="#000"
              strokeWidth="20"
              strokeDasharray="0 220"
              strokeDashoffset="-110"
              strokeLinecap="round"
            ></circle>
            <circle
              className="pl__ring pl__ring--c"
              cx="85"
              cy="120"
              r="70"
              fill="none"
              stroke="#000"
              strokeWidth="20"
              strokeDasharray="0 440"
              strokeLinecap="round"
            ></circle>
            <circle
              className="pl__ring pl__ring--d"
              cx="155"
              cy="120"
              r="70"
              fill="none"
              stroke="#000"
              strokeWidth="20"
              strokeDasharray="0 440"
              strokeLinecap="round"
            ></circle>
          </svg>
        </div>
      </>
    );
  }

  return (
    <>
      <section className="py-1 sm:py-6 bg-primary-to-green">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-xl md:text-2xl xl:text-3xl font-bold my-4">
            My Blogs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post) => (
              <>
                {/* <div key={post.id}> */}
                <CardContainer
                  key={post.id}
                  className="inter-var w-full h-full"
                >
                  <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full h-full rounded-xl p-4 sm:p-6 border  ">
                    <CardItem
                      translateZ="5"
                      className="text-xl font-bold text-neutral-600 dark:text-white"
                    >
                      {post.title}
                    </CardItem>
                    <CardItem
                      as="p"
                      translateZ="5"
                      className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
                    >
                      {post.content}
                    </CardItem>
                    <CardItem translateZ="5" className="w-full mt-4">
                      {post.imageUrl && (
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl mt-2"
                        />
                      )}
                    </CardItem>
                    <div className="flex justify-between items-center mt-20">
                      <CardItem
                        translateZ={5}
                        as={Link}
                        href="https://twitter.com/mannupaaji"
                        target="__blank"
                        className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white"
                      >
                        &nbsp;
                        {/* Try now → */}
                      </CardItem>
                      <CardItem
                        translateZ={5}
                        as="button"
                        className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                      >
                        Read more{" "}
                      </CardItem>
                    </div>
                  </CardBody>
                </CardContainer>
                {/* </div> */}
              </>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
