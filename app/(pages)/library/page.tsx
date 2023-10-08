"use client"
import GoBack from '@/components/UI Elements/GoBack'
import CreateButton from '@/components/Library/CreateButton'
import Resources from '@/components/Library/Resources'
import React from 'react'

export default function Library() {
  return (
    <section className="md:p-10 md:px-16 p-8 flex flex-col gap-2 w-full">
      <div className="flex justify-between">
      <h1 className='text-3xl font-semibold'>Library</h1>
      <GoBack/>
      <CreateButton/>
      </div>
    <div>  
      <Resources/>
    </div>
    </section>
  )
}
