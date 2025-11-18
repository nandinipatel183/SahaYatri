import React, { useState } from 'react';
import { Upload, Camera, MapPin, Package, Tag, Palette } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import Header from './UserNavbar';

const ReportLostItem: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    itemName: '',
    category: '',
    brand: '',
    color: '',
    size: '',
    uniqueFeatures: '',
    lastSeenLocation: '',
    lastSeenTime: '',
    description: '',
    contactPerson: '',
    contactPhone: '',
    estimatedValue: '',
    purchaseDate: ''
  });
  
 const [photo, setPhoto] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'Electronics', 'Clothing', 'Jewelry', 'Documents', 'Bags', 
    'Religious Items', 'Books', 'Accessories', 'Toys', 'Others'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

   const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPhoto(e.target.files[0]); // ✅ Only one image
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    const formDataToSend = new FormData();

formDataToSend.append("itemName", formData.itemName);  // ✅ correct key
formDataToSend.append("category", formData.category);  // ✅ added
formDataToSend.append("color", formData.color);
formDataToSend.append("brand", formData.brand);
formDataToSend.append("size", formData.size);
formDataToSend.append("uniqueFeatures", formData.uniqueFeatures);
formDataToSend.append("lastSeenLocation", formData.lastSeenLocation);
formDataToSend.append("lastSeenTime", formData.lastSeenTime);
formDataToSend.append("description", formData.description);
formDataToSend.append("contactPerson", formData.contactPerson);
formDataToSend.append("contactPhone", formData.contactPhone);
formDataToSend.append("estimatedValue", formData.estimatedValue || "");
formDataToSend.append("purchaseDate", formData.purchaseDate || "");

if (photo) {
  formDataToSend.append("photo", photo);
}


const response = await fetch("http://localhost:8080/api/items/lost", {
  method: "POST",
  body: formDataToSend,
  credentials: "include", // ✅ ADD THIS LINE
});


    if (response.ok) {
      alert("✅ Lost item report submitted successfully!");
      setFormData({
        itemName: "",
        category: "",
        brand: "",
        color: "",
        size: "",
        uniqueFeatures: "",
        lastSeenLocation: "",
        lastSeenTime: "",
        description: "",
        contactPerson: "",
        contactPhone: "",
        estimatedValue: "",
        purchaseDate: ""
      });
      setPhoto(null);
    } else {
      alert("❌ Failed to submit report. Please try again.");
    }
  } catch (error) {
    console.error("Error submitting lost item report:", error);
    alert("⚠️ Something went wrong. Check console for details.");
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
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-t-2xl p-6 text-white">
            <h1 className="text-3xl font-bold mb-2">{t('reportLostItem')}</h1>
            <p className="text-blue-100">Provide detailed information about your lost item</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Item Information */}
            <div className="bg-blue-50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Package className="h-5 w-5 mr-2 text-blue-600" />
                Item Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    name="itemName"
                    value={formData.itemName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="iPhone 13, Blue Handbag, etc."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand/Make
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Apple, Samsung, Nike, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Color *
                  </label>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Blue, Red, Black, etc."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Size/Dimensions
                  </label>
                  <input
                    type="text"
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Small, Medium, Large, or specific measurements"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Value (₹)
                  </label>
                  <input
                    type="number"
                    name="estimatedValue"
                    value={formData.estimatedValue}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="10000"
                  />
                </div>
              </div>
            </div>

            {/* Last Seen Information */}
            <div className="bg-green-50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-green-600" />
                Last Seen Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Seen Location *
                  </label>
                  <input
                    type="text"
                    name="lastSeenLocation"
                    value={formData.lastSeenLocation}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Ram Ghat, Food Court, Parking Area, etc."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Seen Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    name="lastSeenTime"
                    value={formData.lastSeenTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Detailed Description */}
            <div className="bg-purple-50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Tag className="h-5 w-5 mr-2 text-purple-600" />
                Detailed Description
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unique Features/Identifiers
                  </label>
                  <textarea
                    name="uniqueFeatures"
                    value={formData.uniqueFeatures}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Scratches, stickers, engravings, serial numbers, unique patterns, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Any additional details that might help identify the item"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Purchase Date (if remembered)
                  </label>
                  <input
                    type="date"
                    name="purchaseDate"
                    value={formData.purchaseDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-orange-50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Phone *
                  </label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="+91 9876543210"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Photo Upload */}
            <div className="bg-indigo-50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Item Photos</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Item Photos *
                </label>
                <div className="border-2 border-dashed border-indigo-300 rounded-lg p-8 text-center">
                  <Camera className="h-16 w-16 text-indigo-400 mx-auto mb-4" />
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="item-photo-upload"
                    required
                  />
                  <label
                    htmlFor="item-photo-upload"
                    className="cursor-pointer text-indigo-600 hover:text-indigo-500 text-lg font-medium"
                  >
                    Click to upload item photos
                  </label>
                 {photo && (
                  <div className="mt-4 p-3 bg-green-100 rounded-lg">
                    <p className="text-sm text-green-800 font-medium">
                      ✓ {photo.name} uploaded successfully
                    </p>
                  </div>
                )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-12 py-4 rounded-xl text-lg font-semibold hover:from-blue-600 hover:to-indigo-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Submitting Report...</span>
                  </div>
                ) : (
                  <>Submit Lost Item Report</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportLostItem;