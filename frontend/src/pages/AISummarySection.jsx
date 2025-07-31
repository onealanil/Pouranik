import { useState, useEffect } from 'react';
import { generateBookSummary } from '../services/AISummaryservice'; 

export default function AISummarySection({ bookInfo, cardBaseClasses }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const handleGenerateSummary = async () => {
    if (!bookInfo.title) {
      setError('Book title is required for AI analysis');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await generateBookSummary({
        title: bookInfo.title,
        authors: bookInfo.authors || [],
        description: bookInfo.description,
        categories: bookInfo.categories || [],
        pageCount: bookInfo.pageCount,
        publishedDate: bookInfo.publishedDate,
        averageRating: bookInfo.averageRating
      });

      setSummary(result);
    } catch (err) {
      console.error('AI Summary Error:', err);
      setError(err.message || 'Failed to generate AI summary');
    } finally {
      setLoading(false);
    }
  };

  const getRecommendationColor = (recommendation) => {
    switch (recommendation?.toLowerCase()) {
      case 'highly recommended':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'recommended':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'worth considering':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'not recommended':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRecommendationIcon = (recommendation) => {
    switch (recommendation?.toLowerCase()) {
      case 'highly recommended':
        return '🌟';
      case 'recommended':
        return '👍';
      case 'worth considering':
        return '🤔';
      case 'not recommended':
        return '👎';
      default:
        return '📖';
    }
  };

  return (
    <section className={`${cardBaseClasses} border-l-4 border-purple-500`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
          <span className="text-purple-500 text-3xl">🤖</span>
          AI Book Analysis
        </h3>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
          Powered by AI
        </div>
      </div>

      {!summary && !loading && (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🎯</div>
          <h4 className="text-xl font-semibold text-gray-800 mb-3">
            Get AI-Powered Book Insights
          </h4>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Our AI will analyze this book's content, themes, and provide you with 
            a comprehensive summary and honest recommendation about whether it's worth reading.
          </p>
          <button
            onClick={handleGenerateSummary}
            disabled={loading}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <span className="mr-2">✨</span>
            Generate AI Summary
          </button>
        </div>
      )}

      {loading && (
        <div className="text-center py-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl">🤖</span>
              </div>
            </div>
          </div>
          <h4 className="text-lg font-semibold text-gray-800 mb-2">
            AI is analyzing this book...
          </h4>
          <p className="text-gray-600 text-sm mb-4">
            Processing themes, content quality, and generating recommendations
          </p>
          <div className="mt-4 max-w-xs mx-auto">
            <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-400 to-purple-600 h-full rounded-full animate-pulse w-3/4"></div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-4xl mb-3">⚠️</div>
          <h4 className="text-lg font-semibold text-red-800 mb-2">
            Analysis Failed
          </h4>
          <p className="text-red-600 text-sm mb-4">{error}</p>
          <button
            onClick={handleGenerateSummary}
            className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
          >
            <span className="mr-2">🔄</span>
            Try Again
          </button>
        </div>
      )}

      {summary && (
        <div className="space-y-6">
          {/* Recommendation Badge */}
          {summary.recommendation && (
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border-2 ${getRecommendationColor(summary.recommendation)}`}>
              <span className="mr-2 text-lg">
                {getRecommendationIcon(summary.recommendation)}
              </span>
              {summary.recommendation}
            </div>
          )}

          {/* Key Summary */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6 border border-purple-100">
            <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <span>📝</span>
              AI Summary
            </h4>
            <p className="text-gray-700 leading-relaxed">
              {summary.summary}
            </p>
          </div>

          {/* Key Themes */}
          {summary.keyThemes && summary.keyThemes.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span>🎭</span>
                Key Themes & Topics
              </h4>
              <div className="flex flex-wrap gap-2">
                {summary.keyThemes.map((theme, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium"
                  >
                    {theme}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Pros and Cons */}
          <div className="grid md:grid-cols-2 gap-6">
            {summary.pros && summary.pros.length > 0 && (
              <div className="bg-green-50 rounded-lg p-5 border border-green-100">
                <h4 className="text-lg font-semibold text-green-800 mb-3 flex items-center gap-2">
                  <span>✅</span>
                  What's Great
                </h4>
                <ul className="space-y-2">
                  {summary.pros.map((pro, index) => (
                    <li key={index} className="text-green-700 text-sm flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">•</span>
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {summary.cons && summary.cons.length > 0 && (
              <div className="bg-red-50 rounded-lg p-5 border border-red-100">
                <h4 className="text-lg font-semibold text-red-800 mb-3 flex items-center gap-2">
                  <span>⚠️</span>
                  Potential Drawbacks
                </h4>
                <ul className="space-y-2">
                  {summary.cons.map((con, index) => (
                    <li key={index} className="text-red-700 text-sm flex items-start gap-2">
                      <span className="text-red-500 mt-0.5">•</span>
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Target Audience */}
          {summary.targetAudience && (
            <div className="bg-blue-50 rounded-lg p-5 border border-blue-100">
              <h4 className="text-lg font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <span>👥</span>
                Perfect For
              </h4>
              <p className="text-blue-700 text-sm">
                {summary.targetAudience}
              </p>
            </div>
          )}

          {/* AI Analysis Details (Collapsible) */}
          <div className="border-t border-gray-200 pt-4">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center justify-between w-full text-left text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              <span className="text-sm font-medium flex items-center gap-2">
                <span>🔍</span>
                Analysis Details & Methodology
              </span>
              <span className={`transform transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>
                ↓
              </span>
            </button>

            {expanded && (
              <div className="mt-4 text-xs text-gray-500 bg-gray-50 rounded-lg p-4 border">
                <p className="mb-2">
                  <strong>Analysis Method:</strong> This summary was generated using OpenAI's advanced language model 
                  that analyzed the book's title, description, metadata, categories, and available information.
                </p>
                <p className="mb-2">
                  <strong>Confidence Level:</strong> {summary.confidence || 'Medium'} - Based on available book information and analysis depth.
                </p>
                <p className="mb-2">
                  <strong>Data Sources:</strong> Google Books API, book metadata, genre classifications, and publication details.
                </p>
                <p>
                  <strong>Last Updated:</strong> {new Date().toLocaleDateString()} - 
                  AI analysis reflects current understanding and may vary with different queries.
                </p>
              </div>
            )}
          </div>

          {/* Regenerate Button */}
          <div className="text-center pt-4 border-t border-gray-100">
            <button
              onClick={handleGenerateSummary}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-purple-300 text-sm font-medium rounded-md text-purple-700 bg-white hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
            >
              <span className="mr-2">🔄</span>
              Regenerate Analysis
            </button>
          </div>
        </div>
      )}
    </section>
  );
}