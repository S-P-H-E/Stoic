"use client"
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function DateTime() {
  const [currentDate, setCurrentDate] = useState('');
  const [currentYear, setCurrentYear] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const optionsDate = {
        day: 'numeric',
        month: 'long',
      };
      const optionsYear = {
        year: 'numeric',
      };
      const optionsTime = {
        hour: '2-digit',
        minute: '2-digit',
      };
      const formattedDate = now.toLocaleDateString(undefined, optionsDate as any);
      const formattedYear = now.toLocaleDateString(undefined, optionsYear as any);
      const formattedTime = now.toLocaleTimeString(undefined, optionsTime as any);
      setCurrentDate(formattedDate);
      setCurrentYear(formattedYear);
      setCurrentTime(formattedTime);
      setLoading(false);
    };

    updateDateTime(); 
    const intervalId = setInterval(updateDateTime, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className='h-[23%] 2xl:text-4xl text-2xl rounded-xl p-4 flex border border-[--border] items-center gap-4 transition duration-200 bg-[--darkgray] hover:border-[#585757] hover:scale-105'>
      <div className='flex flex-col w-full h-full justify-center'>
        {loading ?
        <div className='flex flex-col gap-3 w-full h-full'>
          <p className='w-full h-full bg-[--border] animate-pulse rounded-xl'/>
          <p className='w-2/4 h-full bg-[--border] animate-pulse rounded-xl'/>
        </div>
        : 
        <motion.div initial={{opacity: 0}} animate={{opacity: 1}}>
          <p>{currentDate}</p>
          <p>{currentYear}</p>
        </motion.div>
        }
      </div>

      <div className='flex relative gap-2 w-full text-5xl 2xl:text-[5rem] text-end justify-end items-end'>
        {loading ?
        <>
          <p className='w-[30%] h-20 bg-[--border] rounded-xl flex animate-pulse'/>
          <p className='my-auto text-[--border] animate-pulse'>:</p>
          <p className='w-[30%] h-20 bg-[--border] rounded-xl flex animate-pulse'/>
        </>
        :
        <motion.div initial={{opacity: 0}} animate={{opacity: 1}}>
          {currentTime}
        </motion.div>
        }
      </div>

    </div>
  );
}