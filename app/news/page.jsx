// "use client";

// import React, { useEffect, useState } from "react";
// import Image from "next/image";
// import { Pencil, Trash2 } from "lucide-react";
// import { useRouter } from "next/navigation";
// import "./page.css";
// import Footer from "@/components/footer";

// const News = () => {
//   const [newsList, setNewsList] = useState([]);
//   const [leftAdsList, setLeftAdsList] = useState([]);
//   const [rightAdsList, setRightAdsList] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const router = useRouter();

//   const backendUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

//   useEffect(() => {
//     fetchNews();
//     fetchLeftAds();
//     fetchRightAds();

//     const token = localStorage.getItem("accessToken");
//     setIsLoggedIn(!!token);

//     const handleStorage = () => {
//       const updatedToken = localStorage.getItem("accessToken");
//       setIsLoggedIn(!!updatedToken);
//     };

//     window.addEventListener("storage", handleStorage);
//     return () => window.removeEventListener("storage", handleStorage);
//   }, []);

//   const fetchNews = async () => {
//     try {
//       const res = await fetch(`${backendUrl}/api/news`, { cache: "no-store" });
//       if (!res.ok) throw new Error("Failed to fetch news");
//       const data = await res.json();
//       setNewsList(data);
//     } catch (error) {
//       console.error("Error fetching news:", error);
//     }
//   };

//   const fetchLeftAds = async () => {
//     try {
//       const res = await fetch(`${backendUrl}/api/ads?position=left`, {
//         cache: "no-store",
//       });
//       if (!res.ok) throw new Error("Failed to fetch left ads");
//       const data = await res.json();
//       setLeftAdsList(data);
//     } catch (error) {
//       console.error("Error fetching left ads:", error);
//     }
//   };

//   const fetchRightAds = async () => {
//     try {
//       const res = await fetch(`${backendUrl}/api/ads?position=right`, {
//         cache: "no-store",
//       });
//       if (!res.ok) throw new Error("Failed to fetch right ads");
//       const data = await res.json();
//       setRightAdsList(data);
//     } catch (error) {
//       console.error("Error fetching right ads:", error);
//     }
//   };

//   const handleDeleteNews = async (id) => {
//     if (!confirm("Are you sure you want to delete this news?")) return;
//     try {
//       const token = localStorage.getItem("accessToken");
//       const res = await fetch(`${backendUrl}/api/news/${id}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       if (!res.ok) throw new Error("Failed to delete news");
//       setNewsList((prev) => prev.filter((item) => item._id !== id));
//     } catch (error) {
//       console.error("Delete error:", error);
//     }
//   };

//   const handleDeleteAd = async (id) => {
//     if (!confirm("Are you sure you want to delete this ad?")) return;
//     try {
//       const token = localStorage.getItem("accessToken");
//       const res = await fetch(`${backendUrl}/api/ads/${id}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       if (!res.ok) throw new Error("Failed to delete ad");

//       setLeftAdsList((prev) => prev.filter((item) => item._id !== id));
//       setRightAdsList((prev) => prev.filter((item) => item._id !== id));
//     } catch (error) {
//       console.error("Delete ad error:", error);
//     }
//   };

//   const handleEditNews = (id) => {
//     router.push(`/addnews?editId=${id}`);
//   };

//   const handleEditAd = (id) => {
//     router.push(`/addad?editId=${id}`);
//   };

//   const getYouTubeID = (url) => {
//     const regExp =
//       /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]{11}).*/;
//     const match = url.match(regExp);
//     return match ? match[1] : null;
//   };

//   const filteredNews = newsList.filter(
//     (news) =>
//       news.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       news.description.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div>
//       <div className="news-page">
//         {/* Left Ads */}
//         <aside className="news-ads left-ads">
//           {leftAdsList.length > 0 ? (
//             leftAdsList.map((ad) => (
//               <div key={ad._id} className="ad-card">
//                 <h4>{ad.name}</h4>
//                 {ad.image?.url ? (
//                   <Image
//                     src={ad.image.url}
//                     alt={ad.name}
//                     width={150}
//                     height={100}
//                     className="rounded object-cover"
//                   />
//                 ) : (
//                   <p className="no-data">No image available</p>
//                 )}
//                 {isLoggedIn && (
//                   <div className="news-actions">
//                     <button
//                       className="edit-btn"
//                       onClick={() => handleEditAd(ad._id)}
//                       title="Edit Ad"
//                     >
//                       <Pencil size={16} />
//                     </button>
//                     <button
//                       className="delete-btn"
//                       onClick={() => handleDeleteAd(ad._id)}
//                       title="Delete Ad"
//                     >
//                       <Trash2 size={16} />
//                     </button>
//                   </div>
//                 )}
//               </div>
//             ))
//           ) : (
//             <p className="no-data">No ads available.</p>
//           )}
//         </aside>

//         {/* Main News Section */}
//         <main className="news-main">
//           <h2
//             style={{ textAlign: "center", margin: "1rem 0", color: "#640259" }}
//           >
//             News
//           </h2>
//           <div className="news-grid">
//             {filteredNews.length > 0 ? (
//               filteredNews.map((news) => (
//                 <div key={news._id} className="news-card">
//                   <h2>{news.name}</h2>

//                   {/* YouTube Thumbnail */}
//                   {news.youtubeLink && (
//                     <div
//                       style={{
//                         marginTop: "0.5rem",
//                         cursor: "pointer",
//                         position: "relative",
//                         width: "100%",
//                         maxWidth: "400px",
//                         height: "225px", // 16:9 aspect ratio fixed height
//                         borderRadius: "1rem",
//                         overflow: "hidden",
//                       }}
//                       onClick={() => window.open(news.youtubeLink, "_blank")}
//                       title="Open YouTube Video"
//                     >
//                       <img
//                         src={`https://img.youtube.com/vi/${getYouTubeID(
//                           news.youtubeLink
//                         )}/hqdefault.jpg`}
//                         alt="YouTube Video Thumbnail"
//                         style={{
//                           width: "100%",
//                           height: "100%",
//                           objectFit: "cover",
//                           objectPosition: "center center", // center crop thumbnail
//                           display: "block",
//                         }}
//                       />
//                       <div
//                         style={{
//                           position: "absolute",
//                           top: "50%",
//                           left: "50%",
//                           transform: "translate(-50%, -50%)",
//                           fontSize: "3rem",
//                           color: "rgba(255, 255, 255, 0.8)",
//                           pointerEvents: "none",
//                         }}
//                       >
//                         ▶
//                       </div>
//                     </div>
//                   )}

//                   {/* News Image */}
//                   {!news.youtubeLink && news.image && (
//                     <div
//                       style={{
//                         width: "100%",
//                         maxHeight: "200px", // crop top and bottom by limiting height
//                         overflow: "hidden",
//                         borderRadius: "1rem",
//                         marginBottom: "0.5rem",
//                       }}
//                     >
//                       <img
//                         src={news.image}
//                         alt="News"
//                         style={{
//                           width: "100%",
//                           height: "300px", // taller than container for vertical cropping
//                           objectFit: "cover",
//                           objectPosition: "center center",
//                           display: "block",
//                         }}
//                       />
//                     </div>
//                   )}

//                   <p>{news.description}</p>
//                   {isLoggedIn && (
//                     <div className="news-actions">
//                       <button
//                         className="edit-btn"
//                         onClick={() => handleEditNews(news._id)}
//                         title="Edit"
//                       >
//                         <Pencil size={16} />
//                       </button>
//                       <button
//                         className="delete-btn"
//                         onClick={() => handleDeleteNews(news._id)}
//                         title="Delete"
//                       >
//                         <Trash2 size={16} />
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               ))
//             ) : (
//               <p className="no-data">No news found.</p>
//             )}
//           </div>
//         </main>

//         {/* Right Ads */}
//         <aside className="news-ads right-ads">
//           {rightAdsList.length > 0 ? (
//             rightAdsList.map((ad) => (
//               <div key={ad._id} className="ad-card">
//                 <h4>{ad.name}</h4>
//                 {ad.image?.url ? (
//                   <Image
//                     src={ad.image.url}
//                     alt={ad.name}
//                     width={150}
//                     height={100}
//                     className="rounded object-cover"
//                   />
//                 ) : (
//                   <p className="no-data">No image available</p>
//                 )}
//                 {isLoggedIn && (
//                   <div className="news-actions">
//                     <button
//                       className="edit-btn"
//                       onClick={() => handleEditAd(ad._id)}
//                       title="Edit Ad"
//                     >
//                       <Pencil size={16} />
//                     </button>
//                     <button
//                       className="delete-btn"
//                       onClick={() => handleDeleteAd(ad._id)}
//                       title="Delete Ad"
//                     >
//                       <Trash2 size={16} />
//                     </button>
//                   </div>
//                 )}
//               </div>
//             ))
//           ) : (
//             <p className="no-data">No ads available.</p>
//           )}
//         </aside>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default News;

"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import "./page.css";
import Footer from "@/components/footer";

const News = () => {
  const [newsList, setNewsList] = useState([]);
  const [leftAdsList, setLeftAdsList] = useState([]);
  const [rightAdsList, setRightAdsList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  const backendUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

  useEffect(() => {
    fetchNews();
    fetchLeftAds();
    fetchRightAds();

    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);

    const handleStorage = () => {
      const updatedToken = localStorage.getItem("accessToken");
      setIsLoggedIn(!!updatedToken);
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const fetchNews = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/news`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch news");
      const data = await res.json();
      setNewsList(data);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  const fetchLeftAds = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/ads?position=left`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch left ads");
      const data = await res.json();
      setLeftAdsList(data);
    } catch (error) {
      console.error("Error fetching left ads:", error);
    }
  };

  const fetchRightAds = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/ads?position=right`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch right ads");
      const data = await res.json();
      setRightAdsList(data);
    } catch (error) {
      console.error("Error fetching right ads:", error);
    }
  };

  const handleDeleteNews = async (id) => {
    if (!confirm("Are you sure you want to delete this news?")) return;
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${backendUrl}/api/news/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete news");
      setNewsList((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleDeleteAd = async (id) => {
    if (!confirm("Are you sure you want to delete this ad?")) return;
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${backendUrl}/api/ads/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete ad");

      setLeftAdsList((prev) => prev.filter((item) => item._id !== id));
      setRightAdsList((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Delete ad error:", error);
    }
  };

  const handleEditNews = (id) => {
    router.push(`/addnews?editId=${id}`);
  };

  const handleEditAd = (id) => {
    router.push(`/addad?editId=${id}`);
  };

  const getYouTubeID = (url) => {
    const regExp =
      /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]{11}).*/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  const filteredNews = newsList.filter(
    (news) =>
      news.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      news.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="news-page">
        {/* Left Ads */}
        <aside className="news-ads left-ads">
          {leftAdsList.length > 0 ? (
            leftAdsList.map((ad) => (
              <div key={ad._id} className="ad-card">
                <h4>{ad.name}</h4>
                {ad.image?.url ? (
                  <Image
                    src={ad.image.url}
                    alt={ad.name}
                    width={150}
                    height={100}
                    className="rounded object-cover"
                  />
                ) : (
                  <p className="no-data">No image available</p>
                )}
                {isLoggedIn && (
                  <div className="news-actions">
                    <button
                      className="edit-btn"
                      onClick={() => handleEditAd(ad._id)}
                      title="Edit Ad"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteAd(ad._id)}
                      title="Delete Ad"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="no-data">No ads available.</p>
          )}
        </aside>

        {/* Main News Section */}
        <main className="news-main">
          <h2
            style={{ textAlign: "center", margin: "1rem 0", color: "#640259" }}
          >
            News
          </h2>
          <div className="news-grid">
            {filteredNews.length > 0 ? (
              filteredNews.map((news) => (
                <div key={news._id} className="news-card">
                  <h2>{news.name}</h2>

                  {/* YouTube Thumbnail */}
                  {news.youtubeLink && (
                    <div
                      className="youtube-thumbnail-container"
                      onClick={() => window.open(news.youtubeLink, "_blank")}
                      title="Open YouTube Video"
                    >
                      <img
                        src={`https://img.youtube.com/vi/${getYouTubeID(
                          news.youtubeLink
                        )}/hqdefault.jpg`}
                        alt="YouTube Video Thumbnail"
                      />
                      <div className="youtube-play-icon">▶</div>
                    </div>
                  )}

                  {/* News Image */}
                  {!news.youtubeLink && news.image && (
                    <div className="news-image-container">
                      <img src={news.image} alt="News" />
                    </div>
                  )}

                  <p>{news.description}</p>
                  {isLoggedIn && (
                    <div className="news-actions">
                      <button
                        className="edit-btn"
                        onClick={() => handleEditNews(news._id)}
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteNews(news._id)}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="no-data">No news found.</p>
            )}
          </div>
        </main>

        {/* Right Ads */}
        <aside className="news-ads right-ads">
          {rightAdsList.length > 0 ? (
            rightAdsList.map((ad) => (
              <div key={ad._id} className="ad-card">
                <h4>{ad.name}</h4>
                {ad.image?.url ? (
                  <Image
                    src={ad.image.url}
                    alt={ad.name}
                    width={150}
                    height={100}
                    className="rounded object-cover"
                  />
                ) : (
                  <p className="no-data">No image available</p>
                )}
                {isLoggedIn && (
                  <div className="news-actions">
                    <button
                      className="edit-btn"
                      onClick={() => handleEditAd(ad._id)}
                      title="Edit Ad"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteAd(ad._id)}
                      title="Delete Ad"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="no-data">No ads available.</p>
          )}
        </aside>
      </div>
      <Footer />
    </div>
  );
};

export default News;
