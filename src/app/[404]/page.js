'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import NotFoundImage from 'public/404cat.jpeg';

const variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      type: 'spring',
      stiffness: 200,
    },
  }),
};

const Custom404 = () => {
  const router = useRouter();

  return (
    <div className='bg-gray-100 min-h-screen flex items-center justify-center'>
      <motion.div initial='hidden' animate='visible' className='flex flex-col w-full md:w-1/2 mx-auto items-center justify-center p-4'>
        <motion.h1 custom={0} variants={variants} className='text-3xl font-bold text-gray-700'>
          죄송합니다. 페이지를 찾을 수가 없어요!
        </motion.h1>
        <motion.p custom={1} variants={variants} className='text-xl font-light mt-6 text-center text-gray-500'>
          기간이 만료되었거나, URL 스펠링을 다시한번 확인해주세요. 감사합니다.
        </motion.p>
        <motion.div custom={2} variants={variants} className='mt-6 rounded-lg overflow-hidden w-full flex justify-center '>
          <Image src={NotFoundImage} width={300} height={300} alt='404 Not Found' className='rounded-lg' />
        </motion.div>
        <motion.button
          custom={3}
          variants={variants}
          className='mt-10 bg-black text-white font-bold py-2 px-4 rounded'
          onClick={() => router.push('/')}
        >
          Go to Home
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Custom404;
