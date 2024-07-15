import axios from 'axios';

const NAVER_URL = 'https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc';
const NAVER_ID = process.env.NEXT_PUBLIC_NAVER_ID;
const NAVER_MAP_SECRET_KEY = process.env.NEXT_PUBLIC_NAVER_MAP_SECRET_KEY;
const REAL_ESTATE_URL = process.env.NEXT_PUBLIC_URL;
const REAL_ESTATE_KEY = process.env.NEXT_PUBLIC_KEY;

export const getRealEstateData = async (CD_Num) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1 < 10 ? `0${now.getMonth() + 1}` : now.getMonth() + 1;
  const currentMonth = `${year}${month}`;

  const queryParams = {
    serviceKey: REAL_ESTATE_KEY,
    LAWD_CD: '11110',
    DEAL_YMD: currentMonth,
  };

  try {
    const response = await axios.get(REAL_ESTATE_URL, { params: queryParams });
    const estateItems = response.data.response.body;
    return estateItems;
  } catch (error) {
    console.error('Error fetching real estate data:', error);
    throw error;
  }
};

export default async function handler(req, res) {
  const { lat, lng, type } = req.query;

  if (type === 'reverse-geocode') {
    const url = `${NAVER_URL}?coords=${lng},${lat}&orders=roadaddr&output=json`;

    try {
      const response = await axios.get(url, {
        headers: {
          'X-NCP-APIGW-API-KEY-ID': NAVER_ID,
          'X-NCP-APIGW-API-KEY': NAVER_MAP_SECRET_KEY,
        },
      });
      res.status(200).json(response.data);
    } catch (error) {
      console.error('Error fetching address:', error);
      res.status(500).json({ error: 'Error fetching address' });
    }
  } else if (type === 'real-estate') {
    try {
      const estateData = await getRealEstateData();
      res.status(200).json(estateData);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching real estate data' });
    }
  } else {
    res.status(400).json({ error: 'Invalid request type' });
  }
}
