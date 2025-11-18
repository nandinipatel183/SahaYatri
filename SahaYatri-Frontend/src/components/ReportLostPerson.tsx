import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Mic, User, MapPin } from "lucide-react";
import Header from "./UserNavbar";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";


const ReportLostPerson: React.FC = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); // prevent flash redirect
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    lastSeenLocation: "",
    lastSeenTime: "",
    description: "",
    contactPerson: "",
    contactPhone: "",
    clothingDescription: "",
    medicalConditions: "",
    languages: "",
  });

  const [photo, setPhoto] = useState<File | null>(null);
  const [voiceRecording, setVoiceRecording] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("sahayatri_token");
    console.log("🔍 Token from localStorage:", storedToken);

    if (!storedToken) {
      alert("Please login first.");
      navigate("/login");
    } else {
      setToken(storedToken);
    }
    setIsCheckingAuth(false);
  }, [navigate]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleVoiceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVoiceRecording(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!token) {
    alert("Please login first.");
    return;
  }

  setIsSubmitting(true);

  try {
    // Ensure API_BASE_URL is defined
    const baseUrl = API_BASE_URL;
    console.log("Using API base URL:", baseUrl);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    if (photo) data.append("photo", photo);
    if (voiceRecording) data.append("voiceRecording", voiceRecording);

    const response = await fetch(`${baseUrl}/api/reports/lost`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // only Authorization header; do NOT set Content-Type for FormData
      },
      body: data,
    });

    if (response.ok) {
      alert("✅ Lost person report submitted successfully.");
      navigate("/dashboard");
    } else if (response.status === 404) {
      console.error("Backend endpoint not found (404). Check API URL and routes.");
      alert("❌ API endpoint not found. Contact admin or check your URL.");
    } else if (response.status === 403) {
      alert("❌ Forbidden: You are not authorized. Please login again.");
    } else {
      const errorText = await response.text();
      console.error("Backend error:", errorText);
      alert("❌ Submission failed: " + errorText);
    }
  } catch (error) {
    console.error("Error submitting lost person report:", error);
    alert("⚠️ Error submitting report. Check console for details.");
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-t-2xl p-6 text-white">
            <h1 className="text-3xl font-bold mb-2">Report Lost Person</h1>
            <p className="text-pink-100">
              Please provide accurate details to help in search efforts
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Personal Info */}
            <div className="bg-red-50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-red-600" />
                Personal Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <input
                  type="number"
                  name="age"
                  placeholder="Age"
                  value={formData.age}
                  onChange={(e) =>
                    setFormData({ ...formData, age: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Last Seen Info */}
            <div className="bg-green-50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-green-600" />
                Last Seen Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  name="lastSeenLocation"
                  placeholder="Last Seen Location"
                  value={formData.lastSeenLocation}
                  onChange={(e) =>
                    setFormData({ ...formData, lastSeenLocation: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <input
                  type="datetime-local"
                  name="lastSeenTime"
                  value={formData.lastSeenTime}
                  onChange={(e) =>
                    setFormData({ ...formData, lastSeenTime: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Description */}
            <div className="bg-purple-50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
              <textarea
                name="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="General appearance, height, weight, etc."
              />
              <input
                type="text"
                name="clothingDescription"
                placeholder="Clothing Description"
                value={formData.clothingDescription}
                onChange={(e) =>
                  setFormData({ ...formData, clothingDescription: e.target.value })
                }
                className="mt-4 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <input
                type="text"
                name="medicalConditions"
                placeholder="Medical Conditions"
                value={formData.medicalConditions}
                onChange={(e) =>
                  setFormData({ ...formData, medicalConditions: e.target.value })
                }
                className="mt-4 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <input
                type="text"
                name="languages"
                placeholder="Languages Known"
                value={formData.languages}
                onChange={(e) =>
                  setFormData({ ...formData, languages: e.target.value })
                }
                className="mt-4 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Contact Info */}
            <div className="bg-orange-50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  name="contactPerson"
                  placeholder="Your Name"
                  value={formData.contactPerson}
                  onChange={(e) =>
                    setFormData({ ...formData, contactPerson: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <input
                  type="tel"
                  name="contactPhone"
                  placeholder="Contact Phone"
                  value={formData.contactPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, contactPhone: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* File Uploads */}
            <div className="bg-indigo-50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Upload Media
              </h2>
              <div className="space-y-6">
                {/* Photos */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Photos *
                  </label>
                  <div className="border-2 border-dashed border-indigo-300 rounded-lg p-8 text-center">
                    <Camera className="h-16 w-16 text-indigo-400 mx-auto mb-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      id="person-photo-upload"
                      required
                    />
                    <label
                      htmlFor="person-photo-upload"
                      className="cursor-pointer text-indigo-600 hover:text-indigo-500 text-lg font-medium"
                    >
                      Click to upload photos
                    </label>
                  {photo && (
  <p className="text-sm text-green-600 mt-2">
    {photo.name} selected
  </p>
)}
                  </div>
                </div>

                {/* Voice Recording */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Voice Recording (optional)
                  </label>
                  <div className="border-2 border-dashed border-purple-300 rounded-lg p-8 text-center">
                    <Mic className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleVoiceUpload}
                      className="hidden"
                      id="voice-upload"
                    />
                    <label
                      htmlFor="voice-upload"
                      className="cursor-pointer text-purple-600 hover:text-purple-500 text-lg font-medium"
                    >
                      Click to upload voice file
                    </label>
                    {voiceRecording && (
                      <p className="text-green-600 mt-2">✓ Voice file uploaded</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-12 py-4 rounded-xl text-lg font-semibold hover:from-red-600 hover:to-pink-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isSubmitting ? "Submitting..." : "Submit Lost Person Report"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportLostPerson;
