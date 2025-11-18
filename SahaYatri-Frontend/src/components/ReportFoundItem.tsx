import React, { useState } from 'react';
import { Upload, Camera, MapPin, Package, Tag } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import Header from './UserNavbar';

const ReportFoundItem: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    itemName: '',
    category: '',
    brand: '',
    color: '',
    size: '',
    uniqueFeatures: '',
    foundLocation: '',
    foundTime: '',
    description: '',
    contactPerson: '',
    contactPhone: ''
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
    formDataToSend.append("itemName", formData.itemName);
formDataToSend.append("category", formData.category);
formDataToSend.append("color", formData.color);
formDataToSend.append("brand", formData.brand);
formDataToSend.append("size", formData.size);
formDataToSend.append("uniqueFeatures", formData.uniqueFeatures);
formDataToSend.append("foundLocation", formData.foundLocation);
formDataToSend.append("foundTime", formData.foundTime);
formDataToSend.append("description", formData.description);
formDataToSend.append("contactPerson", formData.contactPerson);
formDataToSend.append("contactPhone", formData.contactPhone);
if (photo) {
  formDataToSend.append("photo", photo);
}


      const response = await fetch("http://localhost:8080/api/items/found", {
        method: "POST",
        body: formDataToSend,
        credentials: "include",
      });

      if (response.ok) {
        alert("✅ Found item report submitted successfully!");
        setFormData({
          itemName: "",
          category: "",
          brand: "",
          color: "",
          size: "",
          uniqueFeatures: "",
          foundLocation: "",
          foundTime: "",
          description: "",
          contactPerson: "",
          contactPhone: "",
        });
        setPhoto(null);
      } else {
        alert("❌ Failed to submit found item report. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting found item:", error);
      alert("⚠️ Something went wrong while submitting the form.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-emerald-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-t-2xl p-6 text-white">
            <h1 className="text-3xl font-bold mb-2">{t('reportFoundItem') || 'Report Found Item'}</h1>
            <p className="text-green-100">Provide details to help reunite this item with its rightful owner</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Item Information */}
            <div className="bg-green-50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Package className="h-5 w-5 mr-2 text-green-600" />
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Watch, Mobile Phone, Bag, etc."
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Apple, Titan, Nike, etc."
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Black, Brown, Red, etc."
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Small, Medium, Large, or exact size"
                  />
                </div>
              </div>
            </div>

            {/* Found Information */}
            <div className="bg-yellow-50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-yellow-600" />
                Found Information
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Temple gate, Park, Bus stop, etc."
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-purple-50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Tag className="h-5 w-5 mr-2 text-purple-600" />
                Description
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
                    placeholder="Scratches, marks, engravings, stickers, etc."
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
                    placeholder="Any extra details that might help identify the item"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-orange-50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Your Contact Information</h2>
              
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
                    id="found-item-photo-upload"
                    required
                  />
                  <label
                    htmlFor="found-item-photo-upload"
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
                className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-12 py-4 rounded-xl text-lg font-semibold hover:from-green-600 hover:to-teal-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Submitting Report...</span>
                  </div>
                ) : (
                  <>Submit Found Item Report</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportFoundItem;
