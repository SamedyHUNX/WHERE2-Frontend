import React, { useState, useEffect } from 'react';
import { PlusCircle, Save, Image, Link, FileText } from 'lucide-react';
import ButtonComComponent from './../../../reusable/ButtonComponent';
import axios from 'axios';
import config from './../../../../config';
import useAuth from './../../../../hooks/useAuth';
import { v4 as uuidv4 } from 'uuid';
import PublicPhotoUpload from './../../../reusable/PublicPhotoUpload';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCompany, fetchOneCompany } from '../../../../features/slices/jobSlice';


const entityConfig = {
  'Company': {
    hasLocation: true,
    createEndpoint: config.contentCreation.createCompany,
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
  const {  userId } = useAuth();
  const [entity, setEntity] = useState(localStorage.getItem('businessEntity') || 'Company');
  const [formData, setFormData] = useState({});
    const [postId, setPostId] = useState('');
    const {companyImage,CompanyProfile } = useSelector(state => state.job)
  const dispatch = useDispatch();
  useEffect(() => {
      localStorage.setItem('formType', 'Company');
      dispatch(fetchOneCompany(userId))
},[])

  const [links, setLinks] = useState([
    { title: 'Website', url: '' },
  ]);

  const entityDataKey = `${entity}Data`;
console.log("Company",CompanyProfile)
  useEffect(() => {
    const newUuid = uuidv4();
    setPostId(newUuid);

    const savedData = JSON.parse(localStorage.getItem(entityDataKey));

    if (savedData) {
      setFormData(savedData.formData || {});
      setLinks(savedData.links || [
        { title: 'Website', url: '' },
      ]);
    } 
  }, [entity, entityDataKey, userId]);

    
  const handleInputChange = (fieldName, value) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleLinkChange = (index, field, value) => {
    const newLinks = [...links];
    newLinks[index][field] = value;
    setLinks(newLinks);
  };

  const handleApplyChanges = async () => {
    localStorage.removeItem(`${entity}Data`);
    alert('Changes saved successfully',setFormData({}));

    let data = {
      ...formData,
      website: links.find(link => link.title === 'Website')?.url || '',
      img_url: companyImage,
      image_alt: formData[entityConfig[entity].fields[0].name],
      company_id: parseInt(userId),
    };

    console.log(`Sending the following ${entity} data to the server:`, data);

    try {
      const response = await axios.post(entityConfig[entity].createEndpoint, data);
    
    } catch (error) {
      console.error('Error saving changes:', error.response ? error.response.data : error.message);
    }
  };

  const handleSaveChanges = () => {
    const data = {
      // imageUrl,
      formData,
      links,
    };
    localStorage.setItem(entityDataKey, JSON.stringify(data));
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6  items-center">
          <h2 className="text-xl font-semibold mb-4 flex items-center text-indigo-700">
            <Image size={24} className="mr-2" />
            {entity} Logo
            </h2>
            <PublicPhotoUpload postId={postId} />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center text-indigo-700">
            <FileText size={24} className="mr-2" />
            {entity} Details
          </h2>
          {entityConfig[entity].fields.map((field) => (
            <div key={field.name} className="mb-4">
              <h2>{field.label}</h2>
              {field.type === 'textarea' ? (
                <textarea
                  value={formData[field.name] || ''}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  rows={4}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 h-fit"
                  placeholder={field.label}
                          
                />
              ) : (
                <input
                  type={field.type}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              placeholder="Link URL"
              className="flex-grow p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:mb-5"
            />
          </div>
        ))}
      </div>
      

      <ButtonComComponent
        variant='success'
        onClick={handleSaveChanges}
        className="mt-6 w-full bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200 flex items-center justify-center text-lg font-semibold"
      >
        <Save size={24} />
        <span className="ml-2">Save Changes</span>
      </ButtonComComponent>
      
      <ButtonComComponent
        onClick={handleApplyChanges}
        className="mt-6 w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 flex items-center justify-center text-lg font-semibold"
      >
        <PlusCircle size={24} />
        <span className="ml-2">Apply Changes</span>
      </ButtonComComponent>
    </div>
  );
};

export default CompanyProfile;