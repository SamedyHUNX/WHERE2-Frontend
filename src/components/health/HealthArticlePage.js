import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import axios from "axios";
import { LoadingSpinner } from "./../reusable/Loading";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import VisitTracker from "./../reusable/VisitorTracker";
import WrapperComponent from "./../reusable/WrapperComponent";
import ButtonComponent from "./../reusable/Button";
import HealthNavbar from "./HealthNavbar";
import Footer from "./../reusable/Footer";
import DiscussionContainer from "./../reusable/DiscussionContainer";
import TextSummary from "./../reusable/TextSummary";
import config from "./../../config";
import {
  Facebook, Twitter, Instagram, ImageIcon, Globe, Send
} from "lucide-react";
import ReferencesSection from "./ReferencesSection";

const HealthArticlePage = () => {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname;

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const apiUrl = config.health.getHealthArticleById(id);
        const response = await axios.get(apiUrl);

        if (response.data.status === "success" && response.data.data) {
          setArticle(response.data.data.healthArticle);
        } else {
          throw new Error("Invalid data format received from the server");
        }
      } catch (err) {
        setError(
          err.message || "Failed to fetch article. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  if (loading)
    return (
      <LoadingSpinner
        className="min-w-screen min-h-screen"
        message="We are fetching the health article for you..."
      />
    );

  if (error) {
    navigate("/health");
    return null;
  }

  if (!article) {
    return (
      <WrapperComponent>
        <div className="text-center py-16">
          <h1 className="text-3xl font-bold mb-4 text-white">
            Article Not Found
          </h1>
          <ButtonComponent
            variant="primary"
            size="lg"
            onClick={() => navigate("/")}
          >
            Back to Articles
          </ButtonComponent>
        </div>
      </WrapperComponent>
    );
  }

  const formattedDate = article.date
    ? format(new Date(article.date), "MMMM d, yyyy")
    : "Publication date unavailable";

    ;

    return (
      <>
        <HealthNavbar />
        <div className="bg-gradient-to-b from-black to-gray-900 min-h-screen text-white">
          <div className="lg:w-[90%] sm:w-full mx-auto lg:py-12 sm:py-6 px-4 lg:px-8 mt-[64px]">
            <div className="lg:flex lg:gap-8">
              {/* Main Article Content - Left Side */}
              <div className="lg:w-[65%] sm:w-full mb-8 lg:mb-0">
                <div className="bg-gray-900/50 backdrop-blur-sm w-full h-full lg:rounded-xl sm:rounded-l shadow-xl overflow-hidden">
                  <div className="relative">
                    <img
                      src={article.image || "default-image-url.jpg"}
                      alt={article.title}
                      className="w-full h-[450px] object-cover shadow-lg"
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-900 to-transparent" />
                  </div>
  
                  <div className="lg:p-8 sm:p-4">
                    <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
                      {article.title}
                    </h1>
  
                    <div className="flex items-center space-x-4 text-sm text-gray-300 mb-8">
                      <div className="flex items-center">
                        <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-2">
                          {article.author[0]}
                        </span>
                        <span className="font-medium">{article.author}</span>
                      </div>
                      <span>•</span>
                      <span>{formattedDate}</span>
                    </div>
  
                    <div className="prose prose-lg max-w-none text-gray-200 leading-relaxed text-justify">
                      {article.content}
                    </div>
  
                    {/* Display References */}
                    <ReferencesSection references={article.references} />
                  </div>
                </div>
              </div>
  
              {/* Right Side Column - TextSummary and Discussion */}
              <div className="lg:w-[35%] space-y-6 lg:sticky lg:top-24">
                <WrapperComponent>
                  <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-xl p-6">
                    <h2 className="text-xl font-semibold mb-4 text-white">Quick Summary</h2>
                    <TextSummary textToSummarize={article.content} beta={true}/>
                  </div>
                </WrapperComponent>
                <div className="mt-6 bg-gray-900/50 backdrop-blur-sm rounded-2xl ">
                  <WrapperComponent>
                    <div className="text-black w-full">
                      <DiscussionContainer />
                    </div>
                  </WrapperComponent>
                  <VisitTracker path={location.pathname} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  };
  
  export default HealthArticlePage;