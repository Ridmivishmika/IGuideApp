// "use client";

// // import { useEffect, useState } from "react";
// // import { useRouter } from "next/navigation";
// // import './page.css';

// // const AddNews = () => {
// //   const [formData, setFormData] = useState({ name: "", description: "" });
// //   const [isUpdating, setIsUpdating] = useState(false);
// //   const [editId, setEditId] = useState(null);
// //   const router = useRouter();

// //   const backendUrl = process.env.NEXT_PUBLIC_URL;

// //   useEffect(() => {
// //     const urlParams = new URLSearchParams(window.location.search);
// //     const id = urlParams.get("editId");
// //     setEditId(id);

// //     if (id) {
// //       const fetchNewsDetails = async () => {
// //         try {
// //           const res = await fetch(`${backendUrl}/api/news/${id}`);
// //           if (!res.ok) throw new Error("Failed to fetch news details");
// //           const data = await res.json();
// //           setFormData({ name: data.name, description: data.description });
// //           setIsUpdating(true);
// //         } catch (error) {
// //           console.error("Error loading news:", error);
// //         }
// //       };

// //       fetchNewsDetails();
// //     }
// //   }, []);

// //   const handleChange = (e) => {
// //     setFormData({ ...formData, [e.target.name]: e.target.value });
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     try {
// //       const res = await fetch(`${backendUrl}/api/news${isUpdating ? `/${editId}` : ""}`, {
// //         method: isUpdating ? "PUT" : "POST",
// //         headers: {
// //           "Content-Type": "application/json"
// //           // ❌ No Authorization header
// //         },
// //         body: JSON.stringify(formData),
// //       });

// //       if (!res.ok) throw new Error("Failed to submit news");

// //       router.push("/news"); // ✅ Redirect after submit
// //     } catch (err) {
// //       console.error("Submission error:", err);
// //     }
// //   };

// //   return (
// //     <div className="form-container">
// //       <h1>{isUpdating ? "Update News" : "Add News"}</h1>
// //       <form onSubmit={handleSubmit}>
// //         <input
// //           name="name"
// //           placeholder="Title"
// //           value={formData.name}
// //           onChange={handleChange}
// //           required
// //         />
// //         <textarea
// //           name="description"
// //           placeholder="Description"
// //           value={formData.description}
// //           onChange={handleChange}
// //           required
// //         />
// //         <button type="submit">{isUpdating ? "Update" : "Add"}</button>
// //       </form>
// //     </div>
// //   );
// // };

// // export default AddNews;

// import { useEffect, useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import "./page.css";

// // Extract YouTube video ID from link
// const extractYouTubeID = (url) => {
//   const regExp =
//     /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]{11}).*/;
//   const match = url.match(regExp);
//   return match ? match[1] : null;
// };

// const CLOUDINARY_CLOUD_NAME = "dwq5xfmci";
// const UPLOAD_PRESET = "iguide_past_papers";

// const AddNews = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     youtubeLink: "",
//     image: null,
//   });

//   const [previewImage, setPreviewImage] = useState(null);
//   const [isUpdating, setIsUpdating] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const editIdFromQuery = searchParams.get("editId");

//   const backendUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

//   // Fetch existing news if in edit mode
//   useEffect(() => {
//     setEditId(editIdFromQuery);
//     if (editIdFromQuery) {
//       const fetchNewsDetails = async () => {
//         try {
//           const res = await fetch(`${backendUrl}/api/news/${editIdFromQuery}`);
//           if (!res.ok) throw new Error("Failed to fetch news details");
//           const data = await res.json();
//           setFormData({
//             name: data.name,
//             description: data.description,
//             youtubeLink: data.youtubeLink || "",
//             image: data.image || null,
//           });
//           setPreviewImage(data.image || null);
//           setIsUpdating(true);
//         } catch (error) {
//           setError("Failed to load news data.");
//         }
//       };
//       fetchNewsDetails();
//     }
//   }, [editIdFromQuery]);

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     setError("");
//     setSuccess("");

//     if (name === "image") {
//       const file = files[0];
//       setFormData((prev) => ({ ...prev, image: file }));
//       setPreviewImage(URL.createObjectURL(file));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   // Upload image to Cloudinary
//   const uploadImageToCloudinary = async () => {
//     if (!formData.image || typeof formData.image === "string")
//       return formData.image;

//     const form = new FormData();
//     form.append("file", formData.image);
//     form.append("upload_preset", UPLOAD_PRESET);

//     try {
//       const res = await fetch(
//         `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
//         {
//           method: "POST",
//           body: form,
//         }
//       );
//       if (!res.ok) throw new Error("Image upload failed");
//       const data = await res.json();
//       return data.secure_url;
//     } catch (err) {
//       console.error("Cloudinary upload error:", err);
//       return null;
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");
//     setIsLoading(true);

//     if (!formData.name || !formData.description) {
//       setError("Please fill in all required fields.");
//       setIsLoading(false);
//       return;
//     }

//     try {
//       let imageUrl = await uploadImageToCloudinary();
//       if (formData.image && !imageUrl) {
//         setError("Image upload failed.");
//         setIsLoading(false);
//         return;
//       }

//       const payload = {
//         name: formData.name,
//         description: formData.description,
//         youtubeLink: formData.youtubeLink || "",
//         image:
//           imageUrl ||
//           (typeof formData.image === "string" ? formData.image : null),
//       };

//       const res = await fetch(
//         `${backendUrl}/api/news${isUpdating ? `/${editId}` : ""}`,
//         {
//           method: isUpdating ? "PUT" : "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(payload),
//         }
//       );

//       if (!res.ok) throw new Error("Failed to submit news");

//       setSuccess(
//         isUpdating ? "News updated successfully" : "News added successfully"
//       );
//       setFormData({ name: "", description: "", youtubeLink: "", image: null });
//       setPreviewImage(null);
//       setTimeout(() => router.push("/news"), 1000);
//     } catch (err) {
//       console.error("Submit error:", err);
//       setError("Something went wrong. Try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const videoId = extractYouTubeID(formData.youtubeLink);

//   return (
//     <div className="form-container">
//       <h1>{isUpdating ? "Update News" : "Add News"}</h1>
//       <form onSubmit={handleSubmit}>
//         <input
//           name="name"
//           placeholder="Title"
//           value={formData.name}
//           onChange={handleChange}
//           required
//         />

//         <textarea
//           name="description"
//           placeholder="Description"
//           value={formData.description}
//           onChange={handleChange}
//         />

//         <input
//           type="text"
//           name="youtubeLink"
//           placeholder="YouTube video URL (optional)"
//           value={formData.youtubeLink}
//           onChange={handleChange}
//         />

//         <input
//           type="file"
//           name="image"
//           accept="image/*"
//           onChange={handleChange}
//         />

//         {/* YouTube Preview */}
//         {videoId && (
//           <div
//             style={{
//               marginTop: "1rem",
//               cursor: "pointer",
//               position: "relative",
//               width: "100%",
//               maxWidth: "400px",
//               borderRadius: "1rem",
//               overflow: "hidden",
//             }}
//             onClick={() =>
//               window.open(
//                 `https://www.youtube.com/watch?v=${videoId}`,
//                 "_blank"
//               )
//             }
//             title="Open YouTube Video"
//           >
//             <img
//               src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
//               alt="YouTube Video Thumbnail"
//               style={{ width: "100%", display: "block" }}
//             />
//             <div
//               style={{
//                 position: "absolute",
//                 top: "50%",
//                 left: "50%",
//                 transform: "translate(-50%, -50%)",
//                 fontSize: "3rem",
//                 color: "rgba(255, 255, 255, 0.8)",
//                 pointerEvents: "none",
//               }}
//             >
//               ▶
//             </div>
//           </div>
//         )}

//         {/* Image Preview */}
//         {previewImage && (
//           <div style={{ marginTop: "1rem" }}>
//             <img
//               src={
//                 typeof previewImage === "string"
//                   ? previewImage
//                   : URL.createObjectURL(previewImage)
//               }
//               alt="Preview"
//               style={{
//                 maxWidth: "100%",
//                 maxHeight: "300px",
//                 borderRadius: "1rem",
//               }}
//             />
//           </div>
//         )}

//         {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
//         {success && (
//           <p style={{ color: "green", marginTop: "1rem" }}>{success}</p>
//         )}

//         <button type="submit" disabled={isLoading}>
//           {isLoading
//             ? isUpdating
//               ? "Updating..."
//               : "Submitting..."
//             : isUpdating
//             ? "Update"
//             : "Add"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AddNews;
"use client"; // 👈 mark the page as a client component

import { Suspense } from "react";
import AddNewsForm from "../../components/AddNewsForm";

export default function AddNewsPage() {
  return (
    <Suspense fallback={<div>Loading Add News form...</div>}>
      <AddNewsForm />
    </Suspense>
  );
}
