import React, { useState, useEffect } from 'react';
import { PlusCircle, Save, Image, Link, FileText } from 'lucide-react';
import ButtonComComponent from '../../../reusable/ButtonComponent';
import axios from 'axios';
import config from '../../../../config';
import DropdownComponent from '../../../reusable/DropdownComponent';
import useAuth from '../../../../hooks/useAuth';
import { v4 as uuidv4 } from 'uuid';
import PublicPhotoUpload from '../../../reusable/PublicPhotoUpload';

const dropdownItems = [
  { label: 'University' },
  { label: 'Job offer' },
  { label: 'Accommodation' },
];

const entityConfig = {
  'University': {
    hasLocation: true,
    createEndpoint: config.contentCreation.createUniversity,
    fields: [
      { name: 'name', label: 'University Name', type: 'text' },
      { name: 'description', label: 'University Description', type: 'textarea' },
      { name: 'location', label: 'Location', type: 'text' },
      {name : 'image_url' , label: 'Image URL', type: 'text'}
    ],
  },
  'Job offer': {
    hasLocation: true,
    createEndpoint: config.contentCreation.createJob,
    fields: [
      { name: 'job_title', label: 'Job Title', type: 'text' },
      { name: 'job_desc', label: 'Job Description', type: 'textarea' },
      { name: 'company_name', label: 'Company Name', type: 'text' },
      { name: 'job_require', label: 'Job Requirements', type: 'textarea' },
      { name: 'salary', label: 'Salary', type: 'number' },
      { name: 'position', label: 'Position', type: 'text' },
      { name: 'deadline', label: 'Application Deadline', type: 'date' },
      { name: 'work_hour', label: 'Work Hours', type: 'text' },
      { name: 'location', label: 'Location', type: 'text' },
    ],
  },
  'Accommodation': {
    hasLocation: true,
    createEndpoint: config.contentCreation,
    fields: [
      { name: 'accommodation_name', label: 'Accommodation Name', type: 'text' },
      { name: 'accommodation_description', label: 'Accommodation Description', type: 'textarea' },
      { name: 'accommodation_type', label: 'Accommodation Type', type: 'text' },
      { name: 'price', label: 'Price', type: 'text' },
      { name: 'availability', label: 'Availability', type: 'number' },
      { name: 'size', label: 'Size', type: 'text' },
      { name: 'google_map_link', label: 'Google Maps Link', type: 'text' },
      { name: 'contact_information', label: 'Contact Information', type: 'text' },
      { name: 'location', label: 'Location', type: 'text' },
    ],
  },
};

const AdminEditor = () => {
  const {  userId } = useAuth();
  const [entity, setEntity] = useState(localStorage.getItem('businessEntity') || 'University');
  const [formData, setFormData] = useState({});
  const [postId, setPostId] = useState('');


  const [links, setLinks] = useState([
    { title: 'Telegram', url: '' },
    { title: 'Facebook', url: '' },
    { title: 'Instagram', url: '' },
    { title: 'Website', url: '' },
  ]);

  const entityDataKey = `${entity}Data`;

  useEffect(() => {
    const newUuid = uuidv4();  // Generate a new UUID
    setPostId(newUuid);      // Set the generated UUID to state
    console.log('Generated UUID:', newUuid);

    const savedData = JSON.parse(localStorage.getItem(entityDataKey));
    if (savedData) {
      setFormData(savedData.formData || {});
      setLinks(savedData.links || [
        { title: 'Telegram', url: '' },
        { title: 'Facebook', url: '' },
        { title: 'Instagram', url: '' },
        { title: 'Website', url: '' },
      ]);
    } else {
      const initialFormData = {};
      entityConfig[entity].fields.forEach(field => {
        initialFormData[field.name] = '';
      });
      if (entity === 'Job offer') {
        initialFormData.company_id = userId;
      }
      setFormData(initialFormData);
    }
  }, [entity, entityDataKey, userId]);


  const selectEntity = (selectedEntity) => {
    localStorage.setItem('formType', selectedEntity.label);
    setEntity(selectedEntity.label);
    setFormData({});
  };

  // const formType = localStorage.getItem('formType');

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
    alert('Changes saved successfully');

    // Base data object with common fields and userId
    let data = {
      ...formData,
      facebook_url: links.find(link => link.title === 'Facebook')?.url || '',
      instagram_url: links.find(link => link.title === 'Instagram')?.url || '',
      telegram_url: links.find(link => link.title === 'Telegram')?.url || '',
      website: links.find(link => link.title === 'Website')?.url || '',
      image_alt: formData[entityConfig[entity].fields[0].name],
      userId: parseInt(userId),
    };

    // Special case for Job offer due to different data structure
    if (entity === 'Job offer') {
      data = {
        company_id: parseInt(userId),
        company_name: data.company_name,
        job_desc: data.job_desc,
        job_require: data.job_require,
        location: data.location,
        salary: parseFloat(data.salary),
        position: data.position,
        deadline: data.deadline,
        work_hour: data.work_hour,
        userId: parseInt(userId),
        postId
      };
    }

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
      <DropdownComponent items={dropdownItems} onItemClick={selectEntity} />
      <h1 className="text-3xl font-bold mb-8 text-center text-indigo-800">
        {entity} Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center text-indigo-700">
            <Image size={24} className="mr-2" />
            {entity} Image
          </h2>
          <PublicPhotoUpload postId={postId}/>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center text-indigo-700">
            <FileText size={24} className="mr-2" />
            {entity} Details
          </h2>
          {entity === 'Job offer' && (
            <div className="mb-4">
              <h2>Post ID (Read-only)</h2>
              <input
                type="text"
                value={postId}
                readOnly
                className="w-full p-2 border border-gray-300 rounded mb-4 bg-gray-100"
              />
            </div>
          )}
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

      {entity === "University" ? (
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
      ) : (null)}

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

export default AdminEditor;