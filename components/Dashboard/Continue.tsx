"use client"

import { db } from '@/utils/firebase';
import { UserDataFetcher } from '@/utils/userDataFetcher';
import { doc, onSnapshot } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import {motion} from 'framer-motion'

export default function Continue() {
  const { generalLastCourse, generalLastLesson, userStatus, userId, fetching, userName } = UserDataFetcher();

  const router = useRouter()
  const isPremium = userStatus === 'user' || userStatus === 'admin'

  const [courseData, setCourseData] = useState<any>(null);
  const [lessonData, setLessonData] = useState<any>(null);

  function truncateText(text: string, maxLength: number) {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  }

  useEffect(() => {
    if (userId && generalLastCourse && generalLastLesson && isPremium) {
      const lessonDocRef = doc(db, 'courses', generalLastCourse, 'lessons', generalLastLesson);
      const courseDocRef = doc(db, 'courses', generalLastCourse);

      const lessonUnsubscribe = onSnapshot(lessonDocRef, (lessonDocSnap) => {
        if (lessonDocSnap.exists()) {
          const lessonData = lessonDocSnap.data();

          setLessonData(lessonData)
        }
      });

      const courseUnsubscribe = onSnapshot(courseDocRef, (courseDocSnap) => {
        if (courseDocSnap.exists()) {
          const courseData = courseDocSnap.data();

          setCourseData(courseData)
        }
      });

      return () => {
        lessonUnsubscribe();
        courseUnsubscribe();
      };
    }
  }, [userId, generalLastCourse, generalLastLesson, isPremium]);

  return (
    <>
    {courseData && lessonData ?
    <motion.div initial={{y: 50, opacity: 0}} animate={{y: 0, opacity: 1}}>
        <Link href={`/${generalLastCourse}/${generalLastLesson}`} className='max-h-[34.5rem] h-full group rounded-xl flex border border-[--border] transition duration-200 bg-[--darkgray] hover:border-[#585757] hover:scale-105 active:scale-100'>
          <div className='w-full h-full flex flex-col items-center gap-2 p-2 overflow-hidden'>
            <h1 className='text-lg md:text-xl font-medium text-center'>Continue learning for {userName ? userName : '...'}</h1>
            <div className="relative rounded-xl overflow-hidden w-full">
              <div className="absolute top-8 left-0 w-full h-full bg-gradient-to-b from-transparent via-black/70 to-[--bg]"/>
                  <Image loading='lazy' alt='Lesson Thumbnail' src={lessonData.thumbnail} width={500} height={400} className='w-full object-cover'/>
                  <div className='absolute bottom-4 left-4 gap-2 flex flex-col'>
                    <h1 className='2xl:text-5xl text-4xl font-medium'>{lessonData.title}</h1>
                    <p>{lessonData.description}</p>
                  </div>
              </div>
            <p>{courseData.name}</p>
          </div>
        </Link>
    </motion.div>
    : <div className='h-[53vh] w-full border border-[--border] hover:border-[#585757] transition duration-200 rounded-xl bg-[--darkgray] p-2 flex flex-col gap-2 my-2 items-center justify-center'>
        <p className='w-4/6 h-8 rounded-xl bg-[--border] animate-pulse'/>
        <div className='bg-[--border] rounded-xl animate-pulse w-full h-full'/>
        <p className='w-2/6 h-8 rounded-xl bg-[--border] animate-pulse'/>
      </div>
    }
    </>
  )
}