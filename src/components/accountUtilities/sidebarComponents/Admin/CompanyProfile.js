import React, { useState, useEffect } from 'react';
import { PlusCircle, Save, Image, Link, FileText, Eye } from 'lucide-react';
import ButtonComComponent from './../../../reusable/ButtonComponent';
import axios from 'axios';
import config from './../../../../config';
import useAuth from './../../../../hooks/useAuth';
import { v4 as uuidv4 } from 'uuid';
import PublicPhotoUpload from './../../../reusable/PublicPhotoUpload';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCompany, fetchOneCompany, setCompanyImage, setCompanyName } from '../../../../features/slices/jobSlice';
import { setLoading } from '../../../../features/slices/universitySlice';
import { LoadingOverlay } from '../../../reusable/Loading';
const entityConfig = {
  'Company': {
    hasLocation: true,
    createEndpoint: config.companies.uploadCompanyProfile,
    updateEndpoint: config.companies.updateCompanyProfile,
    fields: [
      { name: 'company_name', label: 'Company Name', type: 'text' },
      { name: 'company_bg', label: 'Company Background', type: 'textarea' },
      { name: 'email', label: 'Company Email', type: 'text' },
      { name: 'tel', label: 'Company Phone Number', type: 'text' },
      { name: 'location', label: 'Location', type: 'text' },
    ],
  },
};

const CompanyProfile = () => {
  const  userId  = JSON.parse(localStorage.getItem('authData')).id;
  const [entity, setEntity] = useState(localStorage.getItem('businessEntity') || 'Company');
  const [formData, setFormData] = useState({});
  const [postId, setPostId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompanyExists, setIsCompanyExists] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const { companyImage, CompanyProfile: companyProfileFromRedux, companyName} = useSelector(state => state.job);
  const dispatch = useDispatch();

  const [links, setLinks] = useState([
    { title: 'Website', url: '' },
  ]);

  const entityDataKey = `${entity}Data`;

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        localStorage.setItem('formType', 'Company');
        
        // Dispatch action to fetch company
          await dispatch(fetchOneCompany(userId));
      
        // Fetch company profile
        const response = await axios.get(config.companies.getCompanyProfile(userId));
        const companyData = response.data.oneCompany;

        // Generate a new UUID for the post
        const newUuid = uuidv4();
        setPostId(newUuid);

        // Pre-fill form data if company profile exists
        if (companyData) {
          setIsCompanyExists(true);
          dispatch(setCompanyImage(companyData.img_url));
          dispatch(setCompanyName(companyData.company_name));
          // Prepare initial form data
          const initialFormData = {
            company_name: companyData.company_name || '',
            company_bg: companyData.company_bg || '',
            email: companyData.email || '',
            tel: companyData.tel || '',
            location: companyData.location || '',
            website_url: companyData.website_url || ''
          };

          setFormData(initialFormData);

          // Update links if website exists
          if (companyData.website_url) {
            setLinks([{ 
              title: 'Website', 
              url: companyData.website_url 
            }]);
          }
        } else {
          // Reset form if no company data
          setFormData({});
          setIsEditable(true);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching company data:', error);
        setIsLoading(false);
        setIsEditable(true);
      }
    };

    fetchCompanyData();
  }, [userId, dispatch]);

  const handleInputChange = (fieldName, value) => {
    if (isEditable) {
      setFormData(prev => ({ ...prev, [fieldName]: value }));
    }
  };

  const handleLinkChange = (index, field, value) => {
    if (isEditable) {
      const newLinks = [...links];
      newLinks[index][field] = value;
      setLinks(newLinks);
    }
  };

  const handleApplyChanges = async () => {
    // Remove local storage data
    localStorage.removeItem(`${entity}Data`);

    // Prepare data for submission
    let data = {
      ...formData,
      website_url: links.find(link => link.title === 'Website')?.url || '',
      img_url: companyImage,
      image_alt: formData[entityConfig[entity].fields[0].name],
      company_id: parseInt(userId),
    };

    // Validation check
    if (!data.company_name) {
      alert('Company Name is required');
      return;
    }

    setIsSubmitting(true);

    try {
        // Use post method to add company details
         if (companyName === '') {
        const response = await axios.post(
          config.contentCreation.createCompany,
          data
        );
      } else {
        // Use PATCH method to update company details
        const response = await axios.patch(
          config.companies.updateCompanyProfile(userId), 
          data
        );
      }

      // Show success message
      alert('Company profile updated successfully!');

      // Optional: Refresh company data after update
      await dispatch(fetchOneCompany(userId));

      // Set to view mode after successful update
      setIsEditable(false);
      setIsCompanyExists(true);
    } catch (error) {
      // Handle error

      console.error('Error updating company profile:', error.response ? error.response.data : error.message);
      alert('Failed to update company profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditToggle = () => {
    setIsEditable(!isEditable);
  };

  if (isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 items-center">
          <h2 className="text-xl font-semibold mb-4 flex items-center text-indigo-700">
            <Image size={24} className="mr-2" />
            {entity} Logo
          </h2>
          <PublicPhotoUpload 
            postId={postId} 
            disabled={!isEditable}
          />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center text-indigo-700">
              <FileText size={24} className="mr-2" />
              {entity} Details
            </h2>
            {isCompanyExists && (
              <button 
                onClick={handleEditToggle}
                className="text-blue-500 hover:text-blue-700 flex items-center"
              >
                {isEditable ? <Eye size={20} className="mr-1" /> : <PlusCircle size={20} className="mr-1" />}
                {isEditable ? 'View Mode' : 'Edit'}
              </button>
            )}
          </div>
          {entityConfig[entity].fields.map((field) => (
            <div key={field.name} className="mb-4">
              <h2>{field.label}</h2>
              {field.type === 'textarea' ? (
                <textarea
                  value={formData[field.name] || ''}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  rows={4}
                  readOnly={!isEditable}
                  className={`w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 h-fit 
                    ${!isEditable ? 'bg-gray-100 cursor-default' : ''}`}
                  placeholder={field.label}
                />
              ) : (
                <input
                  type={field.type}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  readOnly={!isEditable}
                  className={`w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 
                    ${!isEditable ? 'bg-gray-100 cursor-default' : ''}`}
                  placeholder={field.label}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center text-indigo-700">
          <Link size={24} className="mr-2" />
          Important Links
        </h2>
        {links.map((link, index) => (
          <div key={index} className="flex items-center lg:space-x-2 lg:mb-4 sm:flex-col">
            <input
              type="text"
              readOnly
              value={link.title}
              placeholder={`${link.title}`}
              className="flex-grow p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              value={link.url}
              onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
              readOnly={!isEditable}
              placeholder="Link URL"
              className={`flex-grow p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:mb-5
                ${!isEditable ? 'bg-gray-100 cursor-default' : ''}`}
            />
          </div>
        ))}
      </div>

      {!isCompanyExists || isEditable ? (
        <ButtonComComponent
          onClick={handleApplyChanges}
          disabled={isSubmitting}
          className="mt-6 w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 flex items-center justify-center text-lg font-semibold"
        >
          <PlusCircle size={24} />
          <span className="ml-2">{isSubmitting ? 'Applying...' : 'Apply changes'}</span>
        </ButtonComComponent>
      ) : null}
    </div>
  );
};

export default CompanyProfile;