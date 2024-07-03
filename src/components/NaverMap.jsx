import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const NaverMap = () => {
  const mapElement = useRef(null);
  const [userLocation, setUserLocation] = useState({ lat: 37.5665, lng: 126.978 });

  //
  const [lat, setLat] = useState('37.586541');
  const [lng, setLng] = useState('126.969594');
  const [address, setAddress] = useState(null);

  useEffect(() => {
    const initializeMap = () => {
      if (!mapElement.current || !window.naver) return;
      const mapOptions = {
        center: new window.naver.maps.LatLng(userLocation.lat, userLocation.lng),
        zoom: 20,
      };

      const mapInstance = new window.naver.maps.Map(mapElement.current, mapOptions);

      new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(userLocation.lat, userLocation.lng),
        map: mapInstance,
      });
    };

    const loadNaverMapScript = () => {
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
    };

    if (!window.naver) {
      loadNaverMapScript();
    } else {
      initializeMap();
    }
  }, [userLocation]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error location:', error);
        }
      );
    }
  }, []);

  // useEffect(() => {
  //   const fetchAddress = async () => {
  //     try {
  //       const result = await axios.get(`/api/reverse-geocode?lat=${userLocation.lat}&lng=${userLocation.lng}`);
  //       console.log(result);
  //       setAddress(result.data);
  //     } catch (error) {
  //       console.error('Error fetching address:', error);
  //     }
  //   };
  //   console.log(userLocation.lat, userLocation.lng);
  //   fetchAddress();
  // }, [userLocation]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.get(`../api/reverse-geocode?lat=${lat}&lng=${lng}`);
      setAddress(result.data);
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };

  return (
    <div className='map transform -translate-x-8'>
      <div ref={mapElement} style={{ width: '100vw', height: '100vh' }} />
      <div>
        <h1>네이버 Reverse Geocoding 테스트</h1>
        <form onSubmit={handleSubmit}>
          <input type='text' placeholder='위도' value={lat} onChange={(e) => setLat(e.target.value)} />
          <input type='text' placeholder='경도' value={lng} onChange={(e) => setLng(e.target.value)} />
          <button type='submit'>주소 조회</button>
        </form>
        {address && (
          <div>
            <h2>주소 결과</h2>
            <pre>{JSON.stringify(address, null, 2)}</pre>
          </div>
        )}
      </div>
      {/* <div>
        <h1>사용자 위치 기반 법정동 주소</h1>
        {userLocation.lat && userLocation.lng ? (
          <div>
            <p>위도: {userLocation.lat}</p>
            <p>경도: {userLocation.lng}</p>
            <p>법정동 주소: {address}</p>
          </div>
        ) : (
          <p>사용자 위치를 가져오는 중...</p>
        )}
      </div> */}
    </div>
  );
};

export default NaverMap;
