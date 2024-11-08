import React, {useEffect} from "react";
import { Alert, AlertTitle } from "@mui/material";
import { Edit2, X } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { useFetchPhoto, useUploadPhoto } from "./../../hooks/useFetchPhoto";

const MAX_FILE_SIZE = 500 * 1024;
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg'];

const PictureUpload = () => {
  const { userId } = useAuth();
  const { photoUrl, isLoading, error, fetchPhoto } = useFetchPhoto(userId);
  const { uploadPhoto, isUploading, uploadError } = useUploadPhoto(userId);
  // const [showRequirements, setShowRequirements] = useState(false);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // setShowRequirements(true);
    
    // Check file type
    if (!ALLOWED_FILE_TYPES.includes(selectedFile.type)) {
      return;
    }

    // Check file size
    if (selectedFile.size > MAX_FILE_SIZE) {
      return;
    }

    const newPhotoUrl = await uploadPhoto(selectedFile, "profile-picture");
    if (newPhotoUrl) {
      fetchPhoto();
    }
  };

  useEffect(() => {
    if (photoUrl) {
      console.log("Photo URL updated:", photoUrl);
    }
  }, [photoUrl]);

  // Alert container styles
  const alertContainerStyles = "fixed top-[6vh] right-[4vw] z-50 space-y-2 max-w-md animate-in slide-in-from-right";

  const AlertContainer = () => (
    <div className={alertContainerStyles}>
      {isLoading && (
        <Alert>
          <AlertTitle className="flex items-center justify-between">
            Loading
            <button onClick={() => null} className="opacity-0">
              <X size={16} />
            </button>
          </AlertTitle>
          We are fetching your profile picture.
        </Alert>
      )}

      {isUploading && (
        <Alert>
          <AlertTitle className="flex items-center justify-between">
            Uploading
            <button onClick={() => null} className="opacity-0">
              <X size={16} />
            </button>
          </AlertTitle>
          We are uploading your profile picture.
        </Alert>
      )}

      {(error || uploadError) && (
        <Alert variant="destructive">
          <AlertTitle className="flex items-center justify-between">
            Error
            <button onClick={() => null} className="opacity-0">
              <X size={16} />
            </button>
          </AlertTitle>
          {error || uploadError}
        </Alert>
      )}

      {/* {showRequirements && (
        <Alert variant="info">
          <AlertTitle className="flex items-center justify-between">
            File Requirements
            <button 
              onClick={() => setShowRequirements(false)}
              className="hover:bg-gray-100 rounded p-1 transition-colors"
            >
              <X size={16} />
            </button>
          </AlertTitle>
          <ul className="list-disc pl-4 mt-2">
            <li>Only JPG/JPEG files are allowed</li>
            <li>Maximum file size: 500KB</li>
          </ul>
        </Alert>
      )} */}
    </div>
  );

  if (!userId) {
    return (
      <div className={alertContainerStyles}>
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          User ID not found. Please log in again.
        </Alert>
      </div>
    );
  }

  return (
    <>
      <AlertContainer />
      <div className="relative">
        <img
          src={`${photoUrl || "/default-profile.jpg"}?t=${Date.now()}`}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
          onError={(e) => {
            e.target.src = "/default-profile.jpg";
          }}
        />
        <label
          htmlFor="profile-upload"
          className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <Edit2 size={16} />
        </label>
        <input
          id="profile-upload"
          type="file"
          onChange={handleFileChange}
          accept=".jpg,.jpeg"
          className="hidden"
        />
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}
      </div>
    </>
  );
};

export default PictureUpload;
