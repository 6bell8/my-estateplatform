import { useEffect, useRef, useState, useCallback } from 'react';
import axios from 'axios';

const NaverMap = () => {
  const mapElement = useRef(null);
  const [userLocation, setUserLocation] = useState({ lat: '37.5665', lng: '126.978' });
  const [tempLocation, setTempLocation] = useState({ lat: '37.5665', lng: '126.978' });
  const [address, setAddress] = useState(null);
  const [realEstateData, setRealEstateData] = useState(null);

  const initializeMap = useCallback(() => {
    if (!mapElement.current || !window.naver) return;
    const mapOptions = {
      center: new window.naver.maps.LatLng(parseFloat(userLocation.lat), parseFloat(userLocation.lng)),
      zoom: 20,
    };

    const mapInstance = new window.naver.maps.Map(mapElement.current, mapOptions);

    new window.naver.maps.Marker({
      position: new window.naver.maps.LatLng(parseFloat(userLocation.lat), parseFloat(userLocation.lng)),
      map: mapInstance,
    });
  }, [userLocation]);

  const loadNaverMapScript = useCallback(() => {
    const script = document.createElement('script');
    script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_ID}`;
    script.async = true;
    script.onload = initializeMap;
    script.onerror = (error) => {
      console.error('Error loading Naver Map script:', error);
    };
    document.head.appendChild(script);

    return () => {
      if (script) {
        document.head.removeChild(script);
      }
    };
  }, [initializeMap]);

  useEffect(() => {
    if (!window.naver) {
      loadNaverMapScript();
    } else {
      initializeMap();
    }
  }, [loadNaverMapScript, initializeMap]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude.toString(),
            lng: position.coords.longitude.toString(),
          });
          setTempLocation({
            lat: position.coords.latitude.toString(),
            lng: position.coords.longitude.toString(),
          });
        },
        (error) => {
          console.error('Error location:', error);
        }
      );
    }
  }, []);

  const fetchAddress = useCallback(async (lat, lng) => {
    console.log('asd');
    try {
      const url = `/api/real-estate-and-reverse-geocode?lat=${lat}&lng=${lng}&type=reverse-geocode`;
      const response = await axios.get(url);
      console.log(response);
      setAddress(response.data);
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  }, []);

  const fetchRealEstateData = useCallback(async () => {
    console.log('asd');
    try {
      const url = `/api/real-estate-and-reverse-geocode?type=real-estate`;
      const response = await axios.get(url);
      console.log(response);
      setRealEstateData(response.data);
    } catch (error) {
      console.error('Error fetching real estate data:', error);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUserLocation(tempLocation);
    await fetchAddress(tempLocation.lat, tempLocation.lng);
  };

  useEffect(() => {
    fetchRealEstateData();
  }, [fetchRealEstateData]);

  return (
    <div className='map transform -translate-x-8'>
      <div ref={mapElement} style={{ width: '100vw', height: '95vh' }} />
      <div>
        <h1>네이버 Reverse Geocoding 및 부동산 데이터 조회 테스트</h1>
        <form onSubmit={handleSubmit}>
          <input
            type='text'
            placeholder='위도'
            value={tempLocation.lat}
            onChange={(e) => setTempLocation({ ...tempLocation, lat: e.target.value })}
          />
          <input
            type='text'
            placeholder='경도'
            value={tempLocation.lng}
            onChange={(e) => setTempLocation({ ...tempLocation, lng: e.target.value })}
          />
          <button type='submit'>주소 조회</button>
        </form>
        {address && (
          <div>
            <h2>주소 결과</h2>
            <pre>{JSON.stringify(address, null, 2)}</pre>
          </div>
        )}
        {realEstateData && (
          <div>
            <h2>부동산 데이터 결과</h2>
            <pre>{JSON.stringify(realEstateData, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default NaverMap;
