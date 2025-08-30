"use client";
import Link from "next/link";
import { useState } from "react";

export default function SchoolForm() {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    contact: "",
    email_id: "",
    Image: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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
    try {
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("address", formData.address);
      submitData.append("city", formData.city);
      submitData.append("state", formData.state);
      submitData.append("contact", formData.contact);
      submitData.append("email_id", formData.email_id);
      if (selectedFile) {
        submitData.append("image", selectedFile);
      }

      const res = await fetch("/api/schools", {
        method: "POST",
        body: submitData,
      });

      const result = await res.json();

      if (res.ok) {
        alert("School added successfully!");

        setFormData({
          name: "",
          address: "",
          city: "",
          state: "",
          contact: "",
          email_id: "",
          Image: "",
        });
        setSelectedFile(null);
        setImagePreview("");
      } else {
        alert(result.error || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
   <>
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
          placeholder="School Name"
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
          className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            value={formData.state}
            onChange={handleChange}
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
            School Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border p-2 rounded-lg"
          />
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

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>

        <div className="underline text-blue-700 font-bold text-center">
           <Link href="/view-schools">
          <span>
            View Schools
          </span>
           </Link>
        </div>
      </form>
    </div>
      
   </>
  );
}
