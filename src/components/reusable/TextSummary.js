import { useState } from "react";
import ButtonComponent from "./Button";
import { Spinning } from "./../reusable/Loading"
import config from "./../../config";

const TextSummary = ({ textToSummarize, beta }) => {
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSummarize = async () => {
    if (!textToSummarize.trim()) {
      setError("No article content to summarize");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(config.chatbot.sendMessage, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: textToSummarize }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to generate summary");
      }

      if (data.success && data.summary) {
        setSummary(data.summary);
      } else {
        throw new Error("No summary was generated");
      }
    } catch (err) {
      console.error("Error:", err);
      setError(err.message || "Failed to generate summary. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  setTimeout(() => {
    setError("");
  }, 500)

  return (
    <div className="space-y-4">
      <h2 className="text-md font-light text-white mb-4 tracking-tightest">
        Cannot comprehend the article? W2BOT is here to help...
      </h2>

      {error && (
        <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">
          {error}
        </div>
      )}

      <ButtonComponent
        variant="primary"
        size="large"
        fullWidth
        disabled={isLoading || beta}
        onClick={handleSummarize}
      >
        {isLoading ? (
          <div className="flex items-center justify-center space-x-2">
            <Spinning/>
            <span>Summarizing...</span>
          </div>
        ) : (
          "Summary"
        )}
      </ButtonComponent>

      {summary && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2 text-white">Summary</h3>
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <p className="text-gray-300 whitespace-pre-wrap">{summary}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextSummary;
