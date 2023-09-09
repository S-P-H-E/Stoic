import { useRouter } from 'next/navigation';
import { FC } from 'react';
import {motion} from 'framer-motion'

interface CourseProps {
    course?: CourseInfo
    shortFormLesson?: string
    aeLesson?: string
  }

  interface CourseInfo {
    id: string;
    name: string;
    description: string;
  }

const Course: FC<CourseProps> = ({ course, shortFormLesson, aeLesson }) => {
  const router = useRouter();

  const handleClick = () => {
    if (course) {
      if (course.id === '0E5D3rrDvLtdJfPHqFUB') {
        router.push(`/${course.id}/${aeLesson}`);
      } else if (course.id === 'hypnDNVZXujeVT8pwkL6') {
        router.push(`/${course.id}/${shortFormLesson}`);
      }
    } else {
      console.log("Cant get course info")
    }
  };

  return (
    <motion.div className='bg-gradient-to-t from-[#181818] border border-[#3030307a] to-50% p-4 rounded-2xl md:w-[500px] h-[200px] flex flex-col justify-end cursor-pointer transition-all active:scale-105 md:hover:scale-105' onClick={handleClick}
    initial={{
      scale: "0.5",
      opacity: "0",
    }}
    whileInView={{
      opacity: "1",
      scale: "1"
    }}
    whileHover={{ scale: 1.05  }}
    whileTap={{ scale: 0.95 }}
    >
      { course ? 
      <>
        <h1 className='text-2xl md:text-3xl font-medium text-start'>{course.name}</h1>
        <p className='text-[#8c8c8c]'>{course.description}</p>
      </>
      : null}
    </motion.div>
  );
}

export default Course
