import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../../hooks/useAuth';
import config from '../../../../config';
import axios from 'axios';

const AdminContentListing = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminContents = async () => {
      try {
        console.log('fetching for admin content');
        const response = await axios.get(config.profile.getAdminContentList(userId));
        setPosts(response.data.data.posts);
      } catch (error) {
        console.error("Error fetching admin content list:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminContents();
  }, [userId]);

  const handlePostClick = (postType, id) => {
    navigate(`/detail/${postType}/${id}`);
  };

  return (
    <section className="lg:w-full sm:w-[100%] sm:mr-[32px] bg-white rounded-lg shadow-lg h-full">
      <div className="flex justify-between items-center py-5 w-[80%] mx-auto">
        <h1 className="text-3xl text-blue-600 font-bold">Your content</h1>
      </div>

      {loading ? (
        <div className="w-[80%] mx-auto py-8 text-center">
          <div className="animate-pulse text-gray-500">Loading contents...</div>
        </div>
      ) : (
        <div className="w-[80%] mx-auto pb-8">
          {posts.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No content found. Start creating some content!
            </div>
          ) : (
            <div className="grid gap-4">
              {posts.map((post) => (
                <div
                  key={`${post.postType}-${post.id}`}
                  onClick={() => handlePostClick(post.postType, post.id)}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-gray-800 mb-2">
                        {post.title || 'Untitled'}
                      </h2>
                      <p className="text-gray-600 line-clamp-2">
                        {post.description || 'No description available'}
                      </p>
                    </div>
                    <span className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {post.postType === 'university' ? 'University' : 'Job'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default AdminContentListing;