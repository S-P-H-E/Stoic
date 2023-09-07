"use client"

import { FC, useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import Course from './page';

// Define the DashboardProps interface
interface CourseLogicProps {
  courses: Array<any>; // Ensure that courses is always an array
}

// Define the Dashboard functional component
const CourseLogic: FC<CourseLogicProps> = () => {
  // State to store the fetched courses
  const [courses, setCourses] = useState<Array<any>>([]);

  // Fetch courses when the component mounts
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesRef = collection(db, 'courses');
        const snapshot = await getDocs(coursesRef);
        const coursesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        // Fetch lessons for each course
        const coursesWithLessons = await Promise.all(
          coursesData.map(async (course) => {
            const lessonsRef = collection(coursesRef, course.id, 'lessons'); // Adjust the path to your lessons collection
            const lessonsSnapshot = await getDocs(lessonsRef);
            const lessonsData = lessonsSnapshot.docs.map((lessonDoc) => ({
              id: lessonDoc.id,
              ...lessonDoc.data(),
            }));

            return { ...course, lessons: lessonsData };
          })
        );

        setCourses(coursesWithLessons);
      } catch (error) {
        console.error('Error fetching courses:', error);
        // Handle the error here if needed
      }
    };

    fetchCourses();
  }, []);// Empty dependency array to ensure it only runs once on mount

  return (
    <div className='flex flex-col md:flex-row gap-5'>
      {courses.map((course) => (
        <Course key={course.id} course={course} lesson={course.lessons[0]} />
      ))}
    </div>
  );
};

export default CourseLogic;
