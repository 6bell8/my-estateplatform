import { useEffect, useRef } from 'react';

const NaverMap = () => {
  const mapElement = useRef(null);

  useEffect(() => {
    const initializeMap = () => {
      if (!mapElement.current) return;

      const { naver } = window;
      const mapOptions = {
        center: new naver.maps.LatLng(37.5665, 126.978), // 초기 지도 중심 좌표 (서울 시청)
        zoom: 100, // 초기 줌 레벨
      };

      const map = new naver.maps.Map(mapElement.current, mapOptions);

      new naver.maps.Marker({
        position: new naver.maps.LatLng(37.5665, 126.978),
        map,
      });
    };

    const script = document.createElement('script');
    script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_ID}`;
    script.onload = initializeMap;
    document.head.appendChild(script);

    return () => {
      if (script) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <div className='map transform -translate-x-8'>
      <div ref={mapElement} style={{ width: '100vw', height: '400vh' }} />
    </div>
  );
};

export default NaverMap;
