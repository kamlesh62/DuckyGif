import axios from 'axios';
import {GIPHY_API_KEY} from '../../env';
const queryString = require('query-string');

export const getTrendingGifs = async (offset = 0, limit = 100) => {
  const queryParams = {
    limit,
    rating: 'pg',
    offset,
  };

  try {
    const qString = queryString.stringify(queryParams);
    const {data} = await axios.get(
      `https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_API_KEY}&${qString}`,
    );
    return data;
  } catch (e) {
    throw new Error(e);
  }
};

export const searchGifs = async (offset, query, limit = 100) => {
  const queryParams = {
    limit,
    rating: 'pg',
    offset,
  };
  try {
    const qString = queryString.stringify(queryParams);
    const {data} = await axios.get(
      `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${query}&${qString}`,
    );
    return data;
  } catch (e) {
    throw new Error(e);
  }
};
