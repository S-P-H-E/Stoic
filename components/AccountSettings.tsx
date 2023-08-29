"use client"

import { useRouter } from 'next/navigation'
import React from 'react'
import { BsChevronLeft } from 'react-icons/bs'
import Input from './Input'
import Button from './Button'
import {BiLogOut} from 'react-icons/bi'

export default function AccountSettings() {
    
  const router = useRouter()
  return (
    <div className="flex flex-col h-full w-full">
    <h1 className="font-bold md:text-3xl 2xl:text-4xl">Account Setings</h1>
      <div>
        <button onClick={() => router.back()} className=" mb-4 cursor-pointer flex gap-1 items-center text-[--highlight] hover:text-stone-200 transition md:gap:2">
        <BsChevronLeft/>
            <h3 className="text-lg">Go back</h3>
        </button>
      </div>
      <div className="border-[--border] border rounded-lg">
        <div className="w-full h-2/6 px-8 md:px-12 py-2">
          <div className='2xl:p-8 md:p-4 p-4 px-0 flex items-center justify-between gap-4'>
            <div className="flex items-center gap-4">
              <div className='rounded-full bg-white 2xl:w-32 2xl:h-32 md:h-24 md:w-24 h-20 w-20'>

              </div>
                <div>
                  <h1 className="2xl:text-4xl lg:text-3xl md:text-2xl font-bold">Melih Yardım</h1>
                  <h2 className='text-light text-[--highlight] 2xl:text-lg lg:text-base text-sm'>melihyardim1057@gmail.com</h2>
                </div>
              </div>

              <div className="gap-2 lg:flex flex-col 2xl:w-48 md:w-40 h-32 items-center justify-center hidden">
              <Button className='bg-red-600 hover:bg-red-500 lg:font-semibold 2x:text-lg md:text-base gap-3 hover:ring-2 ring-white/20 duration-200'>
                Log Out
                <BiLogOut/>
              </Button>
            </div>
          </div>
          <hr className='border-[--border]'/>
          <div className='flex flex-col md:mt-6 2xl:mt-16 md:text-2xl 2xl:text-3xl font-semibold gap-2'>
            <div className="2xl:mb-8 md:mb-4 gap-2 flex flex-col">
              <h1>Display Name</h1>
              <Input className="font-normal text-lg" type='text'/>
            </div>

            <div className="2xl:mb-8 md:mb-4 gap-2 flex flex-col">
              <h1>Email</h1>
              <p className='text-[--highlight] lg:text-xl'>melihyardim1057@gmail.com</p>
            </div>

            <div className="2xl:mb-8 md:mb-4 mb-0 gap-2 flex flex-col w-64 2xl:h-32 h-[6.7rem]">
              <h1>Password</h1>
              <Button className='font-normal text-base lg:text-lg'>Change Password</Button>
            </div>

            <div className="md:w-40 items-center justify-center lg:hidden">
              <Button className='bg-red-600 hover:bg-red-500 font-normal 2x:text-lg md:text-base hover:ring-2 ring-white/20 duration-200'>
                Log Out
                <BiLogOut/>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
