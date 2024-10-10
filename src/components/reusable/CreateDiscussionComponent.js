import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ButtonComponent from "./Button";
import FormInput from "./InputField";
import ContainerComponent from "./ContainerComponent";
import useAuth from "./../../hooks/useAuth";
import config from "./../../config";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';

const CreateDiscussion = () => {
    const navigate = useNavigate();
    const { username, entity, userId } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        content: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.title.trim() || !formData.content.trim()) {
            setError('Title and content are required');
            return;
        }

        setIsSubmitting(true);
        try {
            const newDiscussion = {
                id: uuidv4(),
                ...formData,
                author: username ? username : entity,
                userId: userId,
                createdAt: new Date().toISOString(),
                comments: []
            };

            const response = await axios.post(config.community.createDiscussion, newDiscussion);

            if (response.data.status === 'success') {
                navigate('/discussions');
            }
        } catch (err) {
            console.error('Error creating discussion:', err);
            setError(err.response?.data?.message || 'An error occurred while creating the discussion.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ContainerComponent title="Create New Discussion">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">
                {error}
              </div>
            )}
    
            <FormInput
              label="Title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter discussion title"
              required
            />
    
            <div className="flex-1">
              <label 
                htmlFor="content" 
                className="block text-sm font-medium text-gray-700 whitespace-nowrap"
              >
                Content
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Write your discussion content here..."
                required
                className="mt-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border-[2px] min-h-[200px] p-2"
              />
            </div>
    
            <div className="flex gap-4 justify-end">
              <ButtonComponent
                variant="outline"
                onClick={() => navigate('/discussions')}
                disabled={isSubmitting}
              >
                Cancel
              </ButtonComponent>
              <ButtonComponent
                variant="primary"
                type="submit" // Changed to submit to work correctly with the form
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Discussion'}
              </ButtonComponent>
            </div>
          </form>
        </ContainerComponent>
      );
};

export default CreateDiscussion;