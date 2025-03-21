/**
 * @boats/hooks
 * React hooks for Boats.com applications
 */

import { useState, useEffect } from 'react';
import { findSimilarBoats } from '@boats/core';

/**
 * Hook for analyzing boat images
 * @returns {object} - Image analysis hooks and state
 */
export const useImageAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [similarBoats, setSimilarBoats] = useState([]);
  const [error, setError] = useState(null);

  /**
   * Process analysis results and find similar boats
   * @param {object} analysisResult - Results from image analysis
   * @returns {Promise<void>}
   */
  const processSimilarBoats = async (analysisResult) => {
    try {
      setIsAnalyzing(true);
      const boats = await findSimilarBoats(analysisResult);
      setSimilarBoats(boats);
    } catch (err) {
      setError(err.message || 'Failed to find similar boats');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    isAnalyzing,
    similarBoats,
    error,
    processSimilarBoats
  };
};
