"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import "./page.css";

const CLOUDINARY_CLOUD_NAME = "dwq5xfmci";
const UPLOAD_PRESET = "iguide_past_papers";

const initialState = {
  name: "",
  photo: null,
  _id: null,
};

const AdsForm = () => {
  const [state, setState] = useState(initialState);
  const [ads, setAds] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const editIdFromQuery = searchParams.get("editId");

  const fetchAds = async () => {
    try {
      const res = await fetch("/api/ads");
      if (!res.ok) throw new Error("Failed to fetch ads");
      const data = await res.json();
      setAds(data);
    } catch {
      setError("Failed to fetch ads.");
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  useEffect(() => {
    if (ads.length > 0 && editIdFromQuery) {
      const toEdit = ads.find((ad) => ad._id === editIdFromQuery);
      if (toEdit) {
        setState({
          name: toEdit.name,
          photo: toEdit.image?.url || null,
          _id: toEdit._id,
        });
      }
    }
  }, [ads, editIdFromQuery]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setError("");
    if (type === "file") {
      setState((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setState((prev) => ({ ...prev, [name]: value }));
    }
  };

  const uploadImage = async () => {
    if (!state.photo || typeof state.photo === "string") return null;

    const formData = new FormData();
    formData.append("file", state.photo);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (!res.ok) throw new Error("Cloudinary upload failed");
      const data = await res.json();
      return { url: data.secure_url };
    } catch (err) {
      console.error("Upload error:", err);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!state.name) {
      setError("Please enter ad name.");
      return;
    }

    if (
      state.photo &&
      typeof state.photo !== "string" &&
      state.photo.size > 5 * 1024 * 1024
    ) {
      setError("Max file size is 5MB.");
      return;
    }

    setIsLoading(true);

    try {
      let image = null;
      if (typeof state.photo !== "string") {
        image = await uploadImage();
        if (!image) {
          setError("Failed to upload image.");
          setIsLoading(false);
          return;
        }
      }

      const adData = {
        name: state.name,
        image:
          image ||
          (typeof state.photo === "string" ? { url: state.photo } : null),
      };

      const response = await fetch(
        state._id ? `/api/ads/${state._id}` : "/api/ads",
        {
          method: state._id ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(adData),
        }
      );

      if (response.ok) {
        setSuccess(
          state._id ? "Ad updated successfully." : "Ad created successfully."
        );
        setState(initialState);
        fetchAds();
        router.push("/news");
      } else {
        setError("Submission failed.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <section className="formSection">
        <h1 className="heading">{state._id ? "Update" : "Create"} Ad</h1>
        <form className="form" onSubmit={handleSubmit}>
          <label className="label" htmlFor="name">
            Name:
          </label>
          <input
            id="name"
            className="input"
            type="text"
            name="name"
            placeholder="Enter ad title"
            value={state.name}
            onChange={handleChange}
            required
          />

          <label className="label" htmlFor="photo">
            Upload Image:
          </label>
          <input
            id="photo"
            className="fileInput"
            type="file"
            name="photo"
            accept="image/*"
            onChange={handleChange}
          />

          {state.photo && typeof state.photo !== "string" && (
            <img
              src={URL.createObjectURL(state.photo)}
              alt="Preview"
              style={{ marginTop: 15, borderRadius: 8, maxWidth: "100%" }}
            />
          )}
          {typeof state.photo === "string" && (
            <img
              src={state.photo}
              alt="Existing"
              style={{ marginTop: 15, borderRadius: 8, maxWidth: "100%" }}
            />
          )}

          {error && <p className="message error">{error}</p>}
          {success && <p className="message success">{success}</p>}

          <button type="submit" className="button" disabled={isLoading}>
            {isLoading ? "Submitting..." : state._id ? "Update Ad" : "Create Ad"}
          </button>
        </form>
      </section>
    </div>
  );
};

const AdsPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <AdsForm />
  </Suspense>
);

export default AdsPage;
