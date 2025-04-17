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
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredPosts = posts.filter((post) => {
    const lowerQuery = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(lowerQuery) ||
      post.content.toLowerCase().includes(lowerQuery)
    );
  });

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;

    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="bg-yellow-300 text-black px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

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
        <div className="container mx-auto px-4 md:px-10">
          <h2 className="text-center text-xl md:text-2xl xl:text-3xl font-bold my-4">
            My Blogs
          </h2>
          <div className="main-input-cst py-7 pb-10">
            <div className="grid-cst"></div>
            <div id="poda">
              <div className="glow"></div>
              <div className="darkBorderBg"></div>
              <div className="darkBorderBg"></div>
              <div className="darkBorderBg"></div>

              <div className="white"></div>

              <div className="border"></div>

              <div id="main">
                <input
                  placeholder="Search..."
                  type="text"
                  name="text"
                  className="input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />

                <div id="input-mask"></div>
                <div id="pink-mask"></div>
                <div className="filterBorder"></div>
                <div id="filter-icon">
                  <svg
                    preserveAspectRatio="none"
                    height="27"
                    width="27"
                    viewBox="4.8 4.56 14.832 15.408"
                    fill="none"
                  >
                    <path
                      d="M8.16 6.65002H15.83C16.47 6.65002 16.99 7.17002 16.99 7.81002V9.09002C16.99 9.56002 16.7 10.14 16.41 10.43L13.91 12.64C13.56 12.93 13.33 13.51 13.33 13.98V16.48C13.33 16.83 13.1 17.29 12.81 17.47L12 17.98C11.24 18.45 10.2 17.92 10.2 16.99V13.91C10.2 13.5 9.97 12.98 9.73 12.69L7.52 10.36C7.23 10.08 7 9.55002 7 9.20002V7.87002C7 7.17002 7.52 6.65002 8.16 6.65002Z"
                      stroke="#d6d6e6"
                      stroke-width="1"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </svg>
                </div>
                <div id="search-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    height="24"
                    fill="none"
                    className="feather feather-search"
                  >
                    <circle
                      stroke="url(#search)"
                      r="8"
                      cy="11"
                      cx="11"
                    ></circle>
                    <line
                      stroke="url(#searchl)"
                      y2="16.65"
                      y1="22"
                      x2="16.65"
                      x1="22"
                    ></line>
                    <defs>
                      <linearGradient
                        gradientTransform="rotate(50)"
                        id="search"
                      >
                        <stop stop-color="#f8e7f8" offset="0%"></stop>
                        <stop stop-color="#b6a9b7" offset="50%"></stop>
                      </linearGradient>
                      <linearGradient id="searchl">
                        <stop stop-color="#b6a9b7" offset="0%"></stop>
                        <stop stop-color="#837484" offset="50%"></stop>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-7">
            {/* {posts.map((post) => ( */}
            {filteredPosts.map((post) => (
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
                      {/* {post.title} */}
                      {highlightMatch(post.title, searchQuery)}
                    </CardItem>
                    <CardItem
                      as="p"
                      translateZ="5"
                      className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
                    >
                      {/* {post.content} */}
                      {highlightMatch(post.content, searchQuery)}
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
                    <div className="flex justify-end items-center mt-14">
                      <CardItem
                        translateZ={5}
                        as="button"
                        className="px-5 py-2.5 dark:active:bg-white/50 active:bg-black/50 rounded-lg bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
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
