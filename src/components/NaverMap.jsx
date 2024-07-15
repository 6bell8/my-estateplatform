import { useEffect, useRef, useState, useCallback } from 'react';
import axios from 'axios';

const NaverMap = () => {
  const mapElement = useRef(null);
  const [userLocation, setUserLocation] = useState({ lat: '37.5665', lng: '126.978' });
  const [tempLocation, setTempLocation] = useState({ lat: '37.5665', lng: '126.978' });
  const [address, setAddress] = useState(null);
  const [CD_Num, setCD_Num] = useState('11110');
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
    fetchAddress(tempLocation.lat, tempLocation.lng);
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
    try {
      const url = `/api/real-estate-and-reverse-geocode?lat=${lat}&lng=${lng}&type=reverse-geocode`;
      const response = await axios.get(url);
      setAddress(response.data);
      setCD_Num(response.data.results[0].code.id.slice(0, 5));
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  }, []);

  const fetchRealEstateData = useCallback(async (CD_Num) => {
    try {
      const url = `/api/real-estate-and-reverse-geocode?type=real-estate`;
      const response = await axios.get(url);
      setRealEstateData(response.data);
    } catch (error) {
      console.error('Error fetching real estate data:', error);
    }
  }, []);

  useEffect(() => {
    fetchRealEstateData();
  }, [CD_Num]);

  return (
    <div className='map transform -translate-x-8'>
      <div ref={mapElement} style={{ width: '100vw', height: '95vh' }} />
      <div>
        <h1>네이버 Reverse Geocoding 및 부동산 데이터 조회 테스트</h1>

        {address && (
          <div>
            <pre>{`현재 위치 : ${address.results[0].region.area1.name} ${address.results[0].region.area2.name} ${address.results[0].region.area3.name}`}</pre>
            {/* {JSON.stringify(address, null, 2)} */}
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
