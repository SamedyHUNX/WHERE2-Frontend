import React, {useEffect, useState} from "react";
import { Edit2  , Image} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { useFetchPublicPhoto, useUploadPublicPhoto } from "./../../hooks/useFetchPublicPhoto";
import { LoadingOverlay } from "./Loading";
import { useDispatch, useSelector } from "react-redux";


const MAX_FILE_SIZE = 500 * 1024;


const PublicMultipleUpload = ({ postId }) => {
  const { userId } = useAuth();
  const formType = localStorage.getItem('formType');
  const dispatch = useDispatch();
  
  // Add state for the current image
  const [currentImage, setCurrentImage] = useState(null);

  const { imageUrl, isLoading, fetchPhoto } = useFetchPublicPhoto(userId, postId);
  const { uploadPublicPhoto, isUploading, uploadError } = useUploadPublicPhoto();
  const { accommodationImages } = useSelector(state => state.accommodations);

  // Effect to update currentImage when imageUrl changes
  // useEffect(() => {
  //   if (accommodationImages) {
  //     setCurrentImage(accommodationImages);
  //   }
  // }, [accommodationImages]);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files;
    if (!selectedFile) return;
      
    // CHECK FILE SIZE BEFORE UPLOADING
    if (selectedFile.size > MAX_FILE_SIZE) {
      alert("File size exceeds the maximum allowed (500 KB).");
      return;
    }

    try {
      // Upload the photo and get the response
      const result = await uploadPublicPhoto(selectedFile, "public", formType, postId);
    
      if (result.success) {

        // Update the current image immediately
        setCurrentImage(accommodationImages);
        // Refresh the data from server
        // await fetchPhoto();
      } else {
        console.error('Upload failed:', result.error);
      }
    } catch (error) {
      console.error('Error during upload:', error);
    }
  };

  if (!userId) {
    return (
      <div className="text-red-500">
        User ID not found. Please log in again.
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-2">
      <img
        src={accommodationImages.img1 || '/where2.jpg'}
        alt="Public photo"
        className="flex-1 h-[400px] object-cover"
        onError={(e) => {
          e.target.src = "/where2.jpg";
        }}
      />
         <img
        src={accommodationImages.img2 || '/where2.jpg'}
        alt="Public photo"
        className="flex-1 h-[400px] object-cover"
        onError={(e) => {
          e.target.src = "/where2.jpg";
        }}
      />
         <img
        src={accommodationImages.img3 || '/where2.jpg'}
        alt="Public photo"
        className="flex-1 h-[400px] object-cover"
        onError={(e) => {
          e.target.src = "/where2.jpg";
        }}
      />
         <img
        src={accommodationImages.img4 || '/where2.jpg'}
        alt="Public photo"
        className="flex-1 h-[400px] object-cover"
        onError={(e) => {
          e.target.src = "/where2.jpg";
        }}
        />
        </div>
      <label
        htmlFor="public"
        className="absolute bottom-0 right-0 bg-white p-1 shadow-md cursor-pointer hover:bg-gray-100 transition-colors"
      >
        <Edit2 size={16} />
      </label>
      <input
        id="public"
              type="file"
              multiple
        onChange={handleFileChange}
        accept=".jpg,.jpeg"
        className="hidden"
      />
      {isUploading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="loader"></div>
        </div>
      )}
      {uploadError && (
        <div className="absolute inset-x-0 bottom-0 bg-red-500 text-white text-sm py-1 px-2 text-center">
          {uploadError}
        </div>
      )}
    </div>
  );
};

export default PublicMultipleUpload;
