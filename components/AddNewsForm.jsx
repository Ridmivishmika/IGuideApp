"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./AddNewsForm.module.css";

const CLOUDINARY_CLOUD_NAME = "dwq5xfmci";
const UPLOAD_PRESET = "iguide_past_papers";

const extractYouTubeID = (url) => {
  const regExp =
    /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]{11}).*/;
  const match = url.match(regExp);
  return match ? match[1] : null;
};

const AddNewsForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    youtubeLink: "",
    image: null,
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const editIdFromQuery = searchParams.get("editId");

  const backendUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

  useEffect(() => {
    setEditId(editIdFromQuery);
    if (editIdFromQuery) {
      const fetchNewsDetails = async () => {
        try {
          const res = await fetch(`${backendUrl}/api/news/${editIdFromQuery}`);
          if (!res.ok) throw new Error("Failed to fetch news details");
          const data = await res.json();
          setFormData({
            name: data.name,
            description: data.description,
            youtubeLink: data.youtubeLink || "",
            image: data.image || null,
          });
          setPreviewImage(data.image || null);
          setIsUpdating(true);
        } catch (error) {
          setError("Failed to load news data.");
        }
      };
      fetchNewsDetails();
    }
  }, [editIdFromQuery]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setError("");
    setSuccess("");

    if (name === "image") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, image: file }));
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const uploadImageToCloudinary = async () => {
    if (!formData.image || typeof formData.image === "string")
      return formData.image;

    const form = new FormData();
    form.append("file", formData.image);
    form.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: form,
        }
      );
      if (!res.ok) throw new Error("Image upload failed");
      const data = await res.json();
      return data.secure_url;
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (!formData.name || !formData.description) {
      setError("Please fill in all required fields.");
      setIsLoading(false);
      return;
    }

    try {
      let imageUrl = await uploadImageToCloudinary();
      if (formData.image && !imageUrl) {
        setError("Image upload failed.");
        setIsLoading(false);
        return;
      }

      const payload = {
        name: formData.name,
        description: formData.description,
        youtubeLink: formData.youtubeLink || "",
        image:
          imageUrl ||
          (typeof formData.image === "string" ? formData.image : null),
      };

      const res = await fetch(
        `${backendUrl}/api/news${isUpdating ? `/${editId}` : ""}`,
        {
          method: isUpdating ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Failed to submit news");

      setSuccess(
        isUpdating ? "News updated successfully" : "News added successfully"
      );
      setFormData({ name: "", description: "", youtubeLink: "", image: null });
      setPreviewImage(null);
      setTimeout(() => router.push("/news"), 1000);
    } catch (err) {
      console.error("Submit error:", err);
      setError("Something went wrong. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const videoId = extractYouTubeID(formData.youtubeLink);

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1 className={styles.heading}>
          {isUpdating ? "Update News" : "Add News"}
        </h1>

        <input
          name="name"
          placeholder="Title"
          value={formData.name}
          onChange={handleChange}
          required
          className={styles.input}
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className={styles.textarea}
        />

        <input
          type="text"
          name="youtubeLink"
          placeholder="YouTube video URL (optional)"
          value={formData.youtubeLink}
          onChange={handleChange}
          className={styles.input}
        />

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className={styles.fileInput}
        />

        {/* YouTube Preview */}
        {videoId && (
          <div
            className={styles.youtubeThumbnailWrapper}
            onClick={() =>
              window.open(
                `https://www.youtube.com/watch?v=${videoId}`,
                "_blank"
              )
            }
            title="Open YouTube Video"
          >
            <img
              src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
              alt="YouTube Thumbnail"
              className={styles.youtubeThumbnail}
            />
            <div className={styles.playIcon}>▶</div>
          </div>
        )}

        {/* Image Preview */}
        {previewImage && (
          <img
            src={
              typeof previewImage === "string"
                ? previewImage
                : URL.createObjectURL(previewImage)
            }
            alt="Preview"
            className={styles.previewImage}
          />
        )}

        {/* Messages */}
        {error && <p className={`${styles.message} ${styles.error}`}>{error}</p>}
        {success && (
          <p className={`${styles.message} ${styles.success}`}>{success}</p>
        )}

        <button type="submit" className={styles.button} disabled={isLoading}>
          {isLoading
            ? isUpdating
              ? "Updating..."
              : "Submitting..."
            : isUpdating
            ? "Update"
            : "Add"}
        </button>
      </form>
    </div>
  );
};

export default AddNewsForm;
