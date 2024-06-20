import axios from 'axios';

const URL = process.env.NEXT_PUBLIC_URL;
const KEY = process.env.NEXT_PUBLIC_KEY;

export const getRealEstateData = async () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1 < 10 ? `0${now.getMonth() + 1}` : now.getMonth() + 1;
  const currentMonth = `${year}${month}`;

  const queryParams = {
    serviceKey: KEY,
    LAWD_CD: '11110',
    DEAL_YMD: currentMonth,
  };

  try {
    const response = await axios.get(URL, { params: queryParams });
    const estateItems = response.data.response.body;
    return estateItems;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
