import React, { useState } from "react";
import {
  Upload,
  Camera,
  Mic,
  MapPin,
  User,
  Calendar,
  Ruler,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import Header from "./UserNavbar";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ReportFoundPerson: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    approxAge: "",
    gender: "",
    foundLocation: "",
    foundTime: "",
    description: "",
    clothingDescription: "",
    languages: "",
    reporterName: "",
    reporterPhone: "",
  });

  const [photo, setPhoto] = useState<File | null>(null);
  const [voiceRecording, setVoiceRecording] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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

const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const chunks: BlobPart[] = [];

    mediaRecorder.ondataavailable = (event) => {
      chunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: "audio/wav" });
      const file = new File([blob], "recording.wav", { type: "audio/wav" });
      setVoiceRecording(file);
      setIsRecording(false);
    };

    mediaRecorder.start();
    setIsRecording(true);

    setTimeout(() => {
      mediaRecorder.stop();
    }, 5000); // record for 5 seconds
  } catch (err) {
    console.error("Recording error:", err);
    alert("Microphone permission denied.");
  }
};

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  setIsSubmitting(true);

  try {
    const token = localStorage.getItem("sahayatri_token");
    if (!token) {
      alert("❌ Please login first.");
      setIsSubmitting(false);
      return;
    }

    // Ensure API_BASE_URL is defined
    const baseUrl = API_BASE_URL || "http://localhost:8080";
    console.log("Using API base URL:", baseUrl);

    // Prepare FormData
    const formPayload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formPayload.append(key, value);
    });
    if (photo) formPayload.append("photo", photo);
    if (voiceRecording) formPayload.append("voiceRecording", voiceRecording);

    // Fetch request
    const response = await fetch(`${baseUrl}/api/reports/found`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // Only auth header, do NOT set Content-Type with FormData
      },
      body: formPayload,
    });

    if (response.ok) {
      alert("✅ Found person report submitted successfully!");
      // Reset form
      setFormData({
        approxAge: "",
        gender: "",
        foundLocation: "",
        foundTime: "",
        description: "",
        clothingDescription: "",
        languages: "",
        reporterName: "",
        reporterPhone: "",
      });
      setPhoto(null);
      setVoiceRecording(null);
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
    console.error("Error submitting found person report:", error);
    alert("⚠️ Error submitting report. Check console for details.");
  } finally {
    setIsSubmitting(false);
  }
};

return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-t-2xl p-6 text-white">
            <h1 className="text-3xl font-bold mb-2">
              {t("reportFoundPerson") || "Report Found Person"}
            </h1>
            <p className="text-green-100">
              Provide details about the person you found to help match them with
              missing reports
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Found Information */}
            <div className="bg-blue-50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                Found Location & Time
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Found Location *
                  </label>
                  <input
                    type="text"
                    name="foundLocation"
                    value={formData.foundLocation}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Near railway station, bus stop, etc."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Found Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    name="foundTime"
                    value={formData.foundTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-green-50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Ruler className="h-5 w-5 mr-2 text-green-600" />
                Person Description
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Approximate Age
                  </label>
                  <input
                    type="number"
                    name="approxAge"
                    value={formData.approxAge}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g. 35"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-6 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Clothing Description *
                  </label>
                  <textarea
                    name="clothingDescription"
                    value={formData.clothingDescription}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Blue shirt, grey trousers, black shoes..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Other Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Height, build, special marks, behavior..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Languages (if spoken)
                  </label>
                  <input
                    type="text"
                    name="languages"
                    value={formData.languages}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Hindi, English..."
                  />
                </div>
              </div>
            </div>

            {/* Media Upload */}
            <div className="bg-indigo-50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Photo & Voice (if available)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Photo *
                  </label>
                  <div className="border-2 border-dashed border-indigo-300 rounded-lg p-6 text-center">
                    <Camera className="h-12 w-12 text-indigo-400 mx-auto mb-4" />

                    {/* Hidden Input */}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      id="photo-upload"
                      required
                    />

                    {/* 👇 Clickable Label */}
                    <label
                      htmlFor="photo-upload"
                      className="cursor-pointer text-indigo-600 hover:text-indigo-500 font-medium"
                    >
                      Click to upload a photo
                    </label>

                    {photo && (
                      <p className="text-sm text-green-600 mt-2">
                        ✅ {photo.name} selected
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Voice Recording (Optional)
                  </label>
                  <div className="border-2 border-dashed border-indigo-300 rounded-lg p-6 text-center">
                    <Mic className="h-12 w-12 text-indigo-400 mx-auto mb-4" />
                    {!voiceRecording ? (
                      <div className="space-y-3">
                        <button
                          type="button"
                          onClick={startRecording}
                          disabled={isRecording}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:opacity-50"
                        >
                          {isRecording ? "Recording..." : "Start Recording"}
                        </button>
                        <p className="text-sm text-gray-500">OR</p>
                        <input
                          type="file"
                          accept="audio/*"
                          onChange={handleVoiceUpload}
                          className="hidden"
                          id="voice-upload"
                        />
                        <label
                          htmlFor="voice-upload"
                          className="cursor-pointer text-indigo-600 hover:text-indigo-500"
                        >
                          Upload voice file
                        </label>
                      </div>
                    ) : (
                      <div>
                        <p className="text-green-600 font-medium">
                          ✓ Voice recording uploaded
                        </p>
                        <button
                          type="button"
                          onClick={() => setVoiceRecording(null)}
                          className="text-red-600 text-sm mt-2"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Reporter Contact */}
            <div className="bg-purple-50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Your Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="reporterName"
                    value={formData.reporterName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="reporterPhone"
                    value={formData.reporterPhone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="+91 9876543210"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-green-600 to-emerald-500 text-white px-12 py-4 rounded-xl text-lg font-semibold hover:from-green-700 hover:to-emerald-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Submitting Report...</span>
                  </div>
                ) : (
                  <>Submit Found Person Report</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportFoundPerson;
