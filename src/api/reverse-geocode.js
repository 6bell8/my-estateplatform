import axios from 'axios';

export default async function handler(req, res) {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  const url = `https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc?coords=${lng},${lat}&output=json`;

  try {
    const response = await axios.get(url, {
      headers: {
        'X-NCP-APIGW-API-KEY-ID': process.env.NEXT_PUBLIC_NAVER_CLIENT_ID,
        'X-NCP-APIGW-API-KEY': process.env.NEXT_PUBLIC_NAVER_CLIENT_SECRET,
      },
    });
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching reverse geocode:', error);
    res.status(500).json({ error: 'Failed to fetch reverse geocode' });
  }
}
