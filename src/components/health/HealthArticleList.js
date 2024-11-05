import React, { useState, useEffect } from "react";
import axios from "axios";
import { LoadingSpinner } from "./../reusable/Loading";
import WrapperComponent from "./../reusable/WrapperComponent";
import { useNavigate } from "react-router-dom";
import config from "./../../config";
import HealthArticleCard from "./HealthArticleCard";
import TypewriterEffect from "./../../styles/TypeWriterEffect";

const HealthArticleList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get(config.health.getAllHealthArticles);
        if (response.data.status === "success") {
          setArticles(response.data.data.healthArticles);
        } else {
          throw new Error("Invalid data format received from the server");
        }
      } catch (err) {
        setError(
          err.message || "Failed to fetch articles. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const navigateToArticle = (id) => {
    navigate(`/health/article/${id}`);
  };

  if (loading)
    return <LoadingSpinner message="We are fetching health articles..." />;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <>
      <WrapperComponent>
        <header className="lg:w-[70%] lg:h-[500px] sm:w-[80%] mx-auto py-16 text-center tracking-tightest">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tighter">
            <TypewriterEffect
              text={"A hub where you can find reliable health articles"}
              speed={30}
            />
          </h1>
          <p className="text-lg sm:text-xl h-fit lg:text-2xl max-w-3xl mx-auto text-balance tracking-tightest">
            Our mission is to provide exceptional health and wellness
            information to our users, community, and nation. We only publish
            trustworthy articles and publications, translated from reliable
            well-known research centers and institutions.
          </p>
        </header>
      </WrapperComponent>
      <div className="lg:w-[90%] sm:w-[95%] mx-auto sm:my-[32px]">
        <WrapperComponent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-2">
            {articles.map((article) => (
              <HealthArticleCard
                key={article.id}
                id={article.id}
                image={article.image}
                title={article.title}
                description={article.description}
                onClick={() => navigateToArticle(article.id)}
              />
            ))}
          </div>
        </WrapperComponent>
      </div>
    </>
  );
};

export default HealthArticleList;
