"use client";
import Link from "next/link";
import { useState } from "react";

interface ApiResponse {
  success: boolean;
  error?: string;
  message?: string;
  id?: number;
  imageUrl?: string;
}

export default function SchoolForm() {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    contact: "",
    email_id: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
     
      if (file.size > 10 * 1024 * 1024) {
        alert("File size too large. Maximum size is 10MB.");
        return;
      }

   
      if (!file.type.startsWith('image/')) {
        alert("Please select an image file.");
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setUploadStatus("Preparing upload...");

    try {
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("address", formData.address);
      submitData.append("city", formData.city);
      submitData.append("state", formData.state);
      submitData.append("contact", formData.contact);
      submitData.append("email_id", formData.email_id);
      
      if (selectedFile) {
        setUploadStatus("Uploading image...");
        submitData.append("image", selectedFile);
      }

      setUploadStatus("Saving school data...");

      const res = await fetch("/api/schools", {
        method: "POST",
        body: submitData,
      });

      const result: ApiResponse = await res.json();

      if (res.ok && result.success) {
        setUploadStatus("Success!");
        alert(result.message || "School added successfully!");

        // Reset form
        setFormData({
          name: "",
          address: "",
          city: "",
          state: "",
          contact: "",
          email_id: "",
        });
        setSelectedFile(null);
        setImagePreview("");
        setUploadStatus("");
      } else {
        throw new Error(result.error || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "Something went wrong";
      alert(errorMessage);
      setUploadStatus("Upload failed");
    } finally {
      setLoading(false);
      setTimeout(() => setUploadStatus(""), 3000);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-8 space-y-4"
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Add School
        </h2>

        <input
          type="text"
          name="name"
          placeholder="School Name *"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
        />

        <textarea
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300 h-20"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="city"
            placeholder="City *"
            value={formData.city}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
          />
          <input
            type="text"
            name="state"
            placeholder="State *"
            value={formData.state}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="tel"
            name="contact"
            placeholder="Contact Number"
            value={formData.contact}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
          />
          <input
            type="email"
            name="email_id"
            placeholder="Email"
            value={formData.email_id}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            School Image (Max 10MB)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border p-2 rounded-lg"
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-1">
            Supported formats: JPG, PNG, GIF, WebP
          </p>
        </div>

        {imagePreview && (
          <div className="flex justify-center">
            <img
              src={imagePreview}
              alt="Preview"
              className="h-24 w-24 object-cover rounded-lg border"
            />
          </div>
        )}

        {uploadStatus && (
          <div className="text-center">
            <p className={`text-sm font-medium ${
              uploadStatus.includes('failed') ? 'text-red-600' : 
              uploadStatus === 'Success!' ? 'text-green-600' : 'text-blue-600'
            }`}>
              {uploadStatus}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Processing..." : "Add School"}
        </button>

        <div className="underline text-blue-700 font-bold text-center">
          <Link href="/view-schools">
            <span>View Schools</span>
          </Link>
        </div>
      </form>
    </div>
  );
}