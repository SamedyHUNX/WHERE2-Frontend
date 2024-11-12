import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchAccommodation } from "./../features/slices/accommodationSlice";
import { LoadingOverlay } from "./reusable/Loading";
import { MapPin, Phone, Home, DollarSign, Bed, Square, Calendar } from "lucide-react";
import { convertToHTML } from "./../utility/markdownConverter/markdownConverter";
import DiscussionContainer from "./reusable/DiscussionContainer";
import ButtonComponent from "./reusable/Button";
const AccommodationDetail = () => {
  const param = useParams();
  const dispatch = useDispatch();
  const { loading, error, accommodation } = useSelector(
    (state) => state.accommodations
  );
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    dispatch(fetchAccommodation(param.id));
  }, []);

  const images = accommodation?.image_url 
    ? [
        accommodation.image_url.img1,
        accommodation.image_url.img2,
        accommodation.image_url.img3,
        accommodation.image_url.img4,
      ]
    : [];

  if (loading) return <LoadingOverlay />;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (

    <main>    
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 mt-[10vh]">
            {accommodation.type}
          </h1>
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-1 ml-3" />
            <span>{accommodation.location}</span>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="mb-8">
          <div className="relative h-[500px] rounded-xl overflow-hidden mb-4">
            <img
              src={images[activeImage]}
              alt={`View ${activeImage + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {images.map((img, index) => (
              <div
                key={index}
                className={`relative h-24 rounded-lg overflow-hidden cursor-pointer transition-all ${
                  activeImage === index
                    ? "ring-2 ring-blue-500"
                    : "hover:opacity-75"
                }`}
                onClick={() => setActiveImage(index)}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Details */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
              <h2 className="text-xl font-semibold mb-4">Property Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <DollarSign className="w-5 h-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="font-medium">{accommodation.price}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Square className="w-5 h-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Size</p>
                    <p className="font-medium">{accommodation.size}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Bed className="w-5 h-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Beds</p>
                    <p className="font-medium">1</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Availability</p>
                    <p className="font-medium">{accommodation.availability}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <p className="text-gray-600 leading-relaxed">
                {convertToHTML(accommodation.description)}
              </p>
            </div>
          </div>

          {/* Contact Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-6">
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{accommodation.location}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{accommodation.contact}</p>
                  </div>
                </div>
              </div>
              <ButtonComponent className="w-full bg-blue-600 text-white py-3 rounded-lg mt-6 hover:bg-blue-700 transition-colors">
                Contact Owner
              </ButtonComponent>
            </div>
          </div>
        </div>
        <DiscussionContainer/>
      </div>
    <div>
    </div>
    </div>
    </main>
  );
};

export default AccommodationDetail;