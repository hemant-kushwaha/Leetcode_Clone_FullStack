const axios = require('axios');

const getLanguageById = (lang) => {
  const language = {
    'c++': 54,
    'java': 62,
    'javascript': 63
  };

  return language[lang.toLowerCase()];
};

const submitBatch = async (submissions) => {
  const options = {
    method: 'POST',
    url: 'http://localhost:2358/submissions/batch',
    params: {
      base64_encoded: 'false'
    },
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      submissions
    }
  };

  async function fetchData() {
    try {
      const response = await axios.request(options);
      return response.data; // tokens array
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  }

  return await fetchData();
};

const waiting = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const submitToken = async (resultToken) => {
  const options = {
    method: 'GET',
    url: 'http://localhost:2358/submissions/batch',
    params: {
      tokens: resultToken.join(','), // comma separated tokens
      base64_encoded: 'false',
      fields: '*'
    }
  };

  async function fetchData() {
    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      console.log(error.message);
    }
  }

  while (true) {
    try {
      const result = await fetchData();
      if (!result || !result.submissions) {
        throw new Error('Invalid Judge0 response');
      }
      // console.log(result.submissions);

      const isResultObtained = result.submissions.every(
        (result) => result.status_id > 2
      );

      if (isResultObtained) return result.submissions;

      await waiting(1000);
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }
};

module.exports = { getLanguageById, submitBatch, submitToken };
