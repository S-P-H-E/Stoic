"use client"
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { UserDataFetcher } from '@/utils/userDataFetcher';
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import Input from '../../Converter/Input';
import Button from '../../UI Elements/Button';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import clsx from 'clsx';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '../../ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { ButtonShad } from '../../ui/buttonshad';
import { message } from 'antd';

interface Props {
  className?: string
}

export default function CreateCourse({className}: {className:Props}) {
  const { userStatus } = UserDataFetcher();
  const [courses, setCourses] = useState<{ id: string; name: string }[]>([]);
  const [lessonTitle, setlessonTitle] = useState('');
  const [lessonDescription, setLessonDescription] = useState('');
  const [lessonURL, setLessonURL] = useState('');
  const [lessonOrder, setLessonOrder] = useState('');
  const [error, setError] = useState('');

  const [selectedCourse, setSelectedCourse] = useState('');
  const [open, setOpen] = React.useState(false);
  const [selectedValues, setSelectedValues] = useState('');

  useEffect(() => {
    // Fetch the list of courses from Firestore
    const fetchCourses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'courses'));
        const coursesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: 'docname',
          ...doc.data(),
        }));
        setCourses(coursesData);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);
  
  const toggleSelection = (value: string) => {
    if (selectedValues === value) {
      // If the clicked course is already selected, unselect it
      setSelectedValues('');
    } else {
      // Otherwise, select the clicked course
      setSelectedValues(value);
    }
  };

  const handleUpload = async () => {
    if (!selectedCourse) {
      setError('Please select a course.');
      return;
    }

    // Prepare lesson data
    const lessonData = {
      title: lessonTitle,
      description: lessonDescription,
      url: lessonURL,
      order: lessonOrder,
    };

    // Add the lesson to the selected course's 'lessons' collection
    try {
      const lessonsCollectionRef = collection(db, 'courses', selectedCourse, 'lessons');
      await addDoc(lessonsCollectionRef, lessonData);
      setlessonTitle('');
      setLessonDescription('');
      setLessonURL('');
      setLessonOrder('');
      setError('');

      message.success("Successfully added lesson: " + lessonTitle)
    } catch (error) {
      message.error('Error adding lesson:')
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        {userStatus === 'admin' ? (
          <>
            <button className={clsx(className, 'hover:bg-[--highlight] transition hidden md:flex justify-center items-center px-2 py-1 border border-[--highlight] gap-1 rounded-xl cursor-pointer')}>
              <AiOutlineCloudUpload size={20} />
              Upload
            </button>

            <div className={clsx(className, 'border border-dashed border-[#444444] w-full h-[70px] rounded-xl flex justify-center items-center gap-1 md:hidden')}>
              <AiOutlineCloudUpload size={20} />
              Upload
            </div>
          </>
        ) : null}
      </DialogTrigger>
      <DialogContent>
        <div className='flex flex-col justify-center items-center p-5 gap-3'>
          <h1 className='text-xl font-medium pb-3'>Upload Lesson</h1>
          <h1 className='text-lg font-medium w-full'>Course</h1>
          <div className="w-full">
            <Popover>
              <PopoverTrigger asChild>
                <ButtonShad
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                  >
                  {selectedValues.length > 0
                  ? selectedValues
                  : "Select course..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </ButtonShad>
              </PopoverTrigger>
              <PopoverContent className='className="w-[20rem] p-0'>
                <Command>
                  <CommandInput placeholder="Search course..." />
                  <CommandEmpty className="gap-2 flex flex-col items-center justify-center p-4">
                    <p>No course found.</p>
                  </CommandEmpty>
                  <CommandGroup>
                  {courses.map((course) => (
                    <CommandItem key={course.id} value={String(course.name)} onSelect={() => {toggleSelection(String(course.name)); setSelectedCourse(course.id)}}>
                          <Check
                          className={clsx(
                            "mr-2 h-4 w-4",
                            selectedValues.includes(course.name)
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      {course.name}
                    </CommandItem>
                  ))}
                  </CommandGroup>
                  </Command>
              </PopoverContent>
            </Popover>
{/*             <select
            className='text-white bg-transparent border border-[--border] w-full p-2 rounded-lg focus:bg-[--modal]'
              value={selectedCourse}
              onChange={(e) => {
                console.log('Selected Course:', e.target.value);
                setSelectedCourse(e.target.value);
                setError('');
              }}
            >
              <option value="" className='font-medium'>Select a course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select> */}
          </div>
          <h1 className='text-lg font-medium w-full text-start'>Name</h1>
          <Input
            type='text'
            placeholder='Enter the lesson name'
            value={lessonTitle}
            onChange={(e) => setlessonTitle(e.target.value)}
          />
          <h1 className='text-lg font-medium w-full text-start'>Description</h1>
          <Input
            type='text'
            placeholder='Enter the lesson description'
            value={lessonDescription}
            onChange={(e) => setLessonDescription(e.target.value)}
          />
          <h1 className='text-lg font-medium w-full text-start'>URL</h1>
          <Input
            type='text'
            placeholder='Enter the lesson URL'
            value={lessonURL}
            onChange={(e) => setLessonURL(e.target.value)}
          />
          <h1 className='text-lg font-medium w-full text-start'>Order</h1>
          <Input
            type='number'
            placeholder='Enter the lesson order number'
            value={lessonOrder}
            onChange={(e) => setLessonOrder(e.target.value)}
          />
          <Button onClick={handleUpload}>Upload</Button>
          {error && <p className="text-red-500">{error}</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
}
