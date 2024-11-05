import { useState, useEffect } from "react";
import ButtonComponent from "./reusable/Button";
import FormInput from "./reusable/InputField";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updatePassword } from "./../features/slices/authSlice";
import { LoadingSpinner } from "./reusable/Loading";
import useAuth from "./../hooks/useAuth";
import { EyeIcon, EyeOffIcon, AlertTriangle } from "lucide-react";
import { clearAuthState, logout } from "./../features/slices/authSlice";
import { LoadingOverlay } from "./reusable/Loading";
import deleteUser from "./reusable/functions/DeleteUser";
import { Alert, Snackbar } from '@mui/material';
import DeleteConfirmationModal from "./reusable/functions/DeleteConfirmationModal";

const SettingPanel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    passwordCurrent: '',
    password: '',
    passwordConfirm: ''
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const [validationErrors, setValidationErrors] = useState({
    length: false,
    letter: false,
    capital: false,
    number: false
  });
  
  const [uiState, setUiState] = useState({
    showLogoutOverlay: false,
    showDeleteModal: false,
    snackbar: {
      open: false,
      message: '',
      severity: 'error'
    }
  });

  const { userId, token } = useAuth();
  const { status, error, message } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearAuthState());
  }, [dispatch]);

  const validatePassword = (password) => {
    const validations = {
      length: password.length >= 6,
      letter: /[a-zA-Z]/.test(password),
      capital: /[A-Z]/.test(password),
      number: /[0-9]/.test(password)
    };
    
    setValidationErrors(validations);
    return Object.values(validations).every(Boolean);
  };

  useEffect(() => {
    validatePassword(formData.password);
  }, [formData.password]);

  const handleChange = (field) => (value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const showSnackbar = (message, severity = 'error') => {
    setUiState(prev => ({
      ...prev,
      snackbar: {
        open: true,
        message,
        severity
      }
    }));
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (!validatePassword(formData.password)) {
      showSnackbar('Password must be at least 6 characters long, contain at least one capital letter, one letter and one number.');
      return;
    }

    if (formData.password !== formData.passwordConfirm) {
      showSnackbar('Passwords do not match');
      return;
    }

    try {
      await dispatch(updatePassword({
        userId,
        token,
        ...formData
      })).unwrap();

      setFormData({
        passwordCurrent: '',
        password: '',
        passwordConfirm: ''
      });

      showSnackbar('Password updated successfully!', 'success');
      setUiState(prev => ({ ...prev, showLogoutOverlay: true }));

      setTimeout(async () => {
        await dispatch(logout());
        navigate('/login');
      }, 3000);
      
    } catch (err) {
      console.error('Failed to update password:', err);
      showSnackbar(err || 'An error occurred. Please try again.');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteUser(userId);
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      console.error('Failed to delete account:', error);
      showSnackbar('Failed to delete account. Please try again.');
    }
  };

  const renderPasswordInput = (label, field) => (
    <div className="relative">
      <FormInput
        label={label}
        value={formData[field]}
        onChange={(e) => handleChange(field)(e.target.value)}
        required
        className="p-3 sm:p-4 h-fit pr-10"
        rounded
        type={showPasswords[field] ? "text" : "password"}
      />
      <button
        type="button"
        onClick={() => setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }))}
        className="absolute right-3 bottom-3 transform -translate-y-1/2"
      >
        {!showPasswords[field] ? 
          <EyeOffIcon className="h-5 w-5 text-gray-400" /> : 
          <EyeIcon className="h-5 w-5 text-gray-400" />
        }
      </button>
    </div>
  );

  const ValidationIndicator = ({ fulfilled, text }) => (
    <div className={`flex items-center gap-2 ${fulfilled ? 'text-green-500' : 'text-gray-500'}`}>
      <div className={`w-2 h-2 rounded-full ${fulfilled ? 'bg-green-500' : 'bg-gray-300'}`} />
      <span>{text}</span>
    </div>
  );

  return (
    <>
      {uiState.showLogoutOverlay && (
        <LoadingOverlay
          message="Password updated successfully! You will be logged out in a moment for security purposes."
          showSpinner={true}
        />
      )}
      
      <DeleteConfirmationModal
        show={uiState.showDeleteModal}
        onClose={() => setUiState(prev => ({ ...prev, showDeleteModal: false }))}
        onConfirm={handleDeleteAccount}
        type="Delete Account"
        warningMsg="Are you sure you want to delete your account? This action cannot be undone and you will lose all your data permanently."
      />

      <Snackbar
        open={uiState.snackbar.open}
        autoHideDuration={6000}
        onClose={() => setUiState(prev => ({ ...prev, snackbar: { ...prev.snackbar, open: false } }))}
      >
        <Alert 
          severity={uiState.snackbar.severity}
          onClose={() => setUiState(prev => ({ ...prev, snackbar: { ...prev.snackbar, open: false } }))}
        >
          {uiState.snackbar.message}
        </Alert>
      </Snackbar>
      
      <div className="w-full mx-auto">
        <section className="w-full bg-white rounded-3xl pt-[32px] shadow-md border h-screen">
          <div className="lg:w-full lg:px-16 lg:mx-auto px-4 py-8 sm:px-6">
          <h2 className="text-3xl underline font-bold text-gray-900 mb-6 tracking-tight">Account Settings</h2>
            <div className="border-b pb-8 mb-8">
              <h2 className="text-xl font-medium text-gray-900 my-8">
                <span>Change Password</span>
              </h2>        
              <form className="flex flex-col space-y-6 max-w-md" onSubmit={handleChangePassword}>
                {renderPasswordInput("Current Password", "passwordCurrent")}
                {renderPasswordInput("New Password", "password")}

                <div className="grid grid-cols-1 gap-2 text-sm bg-gray-50 p-4 rounded-lg">
                  <ValidationIndicator fulfilled={validationErrors.length} text="At least 6 characters" />
                  <ValidationIndicator fulfilled={validationErrors.letter} text="At least one letter" />
                  <ValidationIndicator fulfilled={validationErrors.capital} text="At least one capital letter" />
                  <ValidationIndicator fulfilled={validationErrors.number} text="At least one number" />
                </div>

                {renderPasswordInput("Confirm New Password", "passwordConfirm")}

                <div className="flex justify-start">
                  <ButtonComponent
                    variant="primary"
                    className="px-6 py-2 min-w-[150px]"
                    type="submit"
                    disabled={status === "loading"}
                  >
                    {status === "loading" ? <LoadingSpinner /> : "Change Password"}
                  </ButtonComponent>
                </div>
              </form>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-medium text-gray-900 my-8">
                <span className="text-red-500">Account Deletion</span>
              </h2>
              <div className="border-2 border-red-100 rounded-lg p-6 bg-red-50">
                <div className="flex items-start space-x-4">
                  <div className="mt-1">
                    <AlertTriangle className="h-6 w-6 text-red-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-red-800">Delete Account</h3>
                    <p className="mt-2 text-sm text-gray-600">
                      Once you delete your account, there is no going back. Please be certain.
                      All of your data including saved preferences, history, and personal information will be permanently removed.
                    </p>
                    <div className="mt-4">
                      <ButtonComponent
                        variant="danger"
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
                        onClick={() => setUiState(prev => ({ ...prev, showDeleteModal: true }))}
                      >
                        Delete Account
                      </ButtonComponent>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default SettingPanel;
