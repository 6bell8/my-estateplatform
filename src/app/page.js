'use client';

import { useEffect, useState } from 'react';
import { SidebarComponent, NaverMap } from 'src/components';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';
import { getRealEstateData } from '../utils/api';

const Home = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const menuIconClick = () => {
    isCollapsed ? setIsCollapsed(false) : setIsCollapsed(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getRealEstateData();
        // console.log(result);
        setData(result);
      } catch (error) {
        setError(error);
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div style={{ width: '100vw', height: '100vh' }}>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className='flex'>
      <div className='flex'>
        <SidebarComponent isCollapsed={isCollapsed} onMenuIconClick={menuIconClick} />
        <div className='flex transform -translate-x-4 mt-12 z-20 cursor-pointer h-8' onClick={menuIconClick}>
          {isCollapsed ? (
            <IoIosArrowForward className='text-gray-500 w-8 h-8 bg-white rounded-full p-2 border border-gray-200' />
          ) : (
            <IoIosArrowBack className='text-gray-500 w-8 h-8 bg-white rounded-full p-2 border border-gray-200' />
          )}
        </div>
        <NaverMap />
      </div>
    </div>
  );
};
export default Home;
