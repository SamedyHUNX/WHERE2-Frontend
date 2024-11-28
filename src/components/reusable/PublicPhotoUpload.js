import React, {useEffect, useState} from "react";
import { Edit2  , Image} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { useFetchPublicPhoto, useUploadPublicPhoto } from "./../../hooks/useFetchPublicPhoto";
import { LoadingOverlay } from "./Loading";
import { useDispatch, useSelector } from "react-redux";
import { setImageUrl } from "../../features/slices/universitySlice";
import { setCompanyImage } from "../../features/slices/jobSlice";

const MAX_FILE_SIZE = 500 * 1024;


const PublicPhotoUpload = ({ postId }) => {
  const { userId } = useAuth();
  const formType = localStorage.getItem('formType');
  const dispatch = useDispatch();
  
  // Add state for the current image
  const [currentImage, setCurrentImage] = useState(null);

  const { imageUrl, isLoading, fetchPhoto } = useFetchPublicPhoto(userId, postId);
  const { uploadPublicPhoto, isUploading, uploadError } = useUploadPublicPhoto();
  const { imageLink } = useSelector(state => state.universities);
  const { companyImage } = useSelector(state => state.job);

  // Effect to update currentImage when imageUrl changes
  useEffect(() => {
    if (imageUrl) {
      setCurrentImage(imageUrl);
    }
  }, [imageUrl]);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    console.log("single Photo",selectedFile)

    // CHECK FILE SIZE BEFORE UPLOADING
    if (selectedFile.size > MAX_FILE_SIZE) {
      alert("File size exceeds the maximum allowed (500 KB).");
      return;
    }

    try {
      // Upload the photo and get the response
      const result = await uploadPublicPhoto(selectedFile, "public", formType, postId);
      
      if (result.success) {
        if (formType === 'University') {
          dispatch(setImageUrl(result.imageUrl));
        } else if (formType === 'Company') {
          dispatch(setCompanyImage(result.imageUrl))
        }
   
        // Update the current image immediately
        console.log("imageUrl",result.imageUrl)
        // setCurrentImage(result.imageUrl);
        // Refresh the data from server
        await fetchPhoto();
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
console.log("currentImage",currentImage)
  return (
    <div className="relative">
      {formType === 'Company'?
      <img
        src={companyImage || '/where2.jpg'}
        alt="Public photo"
        className="w-[100px] h-[100px] object-cover rounded-full "
        onError={(e) => {
          e.target.src = "/where2.jpg";
        }}
      /> : <img
      src={imageLink || '/where2.jpg'}
      alt="Public photo"
      className="w-full h-[400px] object-cover"
      onError={(e) => {
        e.target.src = "/where2.jpg";
      }}
    />}
  
      <label
        htmlFor="public"
        className="absolute bottom-0 left-0 bg-white p-1 shadow-md cursor-pointer hover:bg-gray-100 transition-colors"
      >
        <Edit2 size={16} />
      </label>
      <input
        id="public"
        type="file"
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

export default PublicPhotoUpload;
