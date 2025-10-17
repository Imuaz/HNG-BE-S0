// Service for fetching cat facts from external API
import axios from "axios";
import ApiError from '../utils/ApiError.js';

const CAT_FACT_API_URL = process.env.CAT_FACT_API_URL || 'https://catfact.ninja/fact';
const REQUEST_TIMEOUT = 5000; // 5 seconds timeout

/**
 * Fetches a random cat fact from the Cat Facts API
 * @returns {Promise<string>} A random cat fact
 * @throws {Error} If the API call fails
 */
async function getCatFact() {
  try {
    const response = await axios.get(CAT_FACT_API_URL, {
      timeout: REQUEST_TIMEOUT,
      headers: {
        'Accept': 'application/json'
      }
    });

    // Validate response structure
    if (response.data && response.data.fact) {
      return response.data.fact;
    } else {
      throw new Error('Invalid response structure from Cat Facts API');
    }
  } catch (error) {
  // Log the error for debugging (print full object when message is not available)
  console.error('Error fetching cat fact:', (error && error.message) ? error.message : error);

    // Handle different types of errors and throw structured ApiError
    if (error.code === 'ECONNABORTED') {
      throw new ApiError('CATFACT_TIMEOUT', 'Cat Facts API request timed out', 504);
    } else if (error.response) {
      // Upstream returned non-2xx
      const status = error.response.status || 502;
      throw new ApiError('CATFACT_UPSTREAM_ERROR', `Cat Facts API returned status ${status}`, 502);
    } else if (error.request) {
      // The request was made but no response was received
      throw new ApiError('CATFACT_NO_RESPONSE', 'No response from Cat Facts API', 502);
    } else {
      // Something happened in setting up the request
      throw new ApiError('CATFACT_FAILURE', 'Failed to fetch cat fact', 500);
    }
  }
}

export default  getCatFact;