"use client"

import React, { useState } from 'react';
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs'


interface InputProps {
    placeholder?: string;
    className?: string;
    type: string;
    eye?: boolean;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    value?: string;
  }

  const Input: React.FC<InputProps> = ({ placeholder, className, type, eye, onChange, value }) => {
    const [toggle, setToggle] = useState(true)
    const [inputFocused, setInputFocused] = useState(false);

    const handleInputFocus = () => {
      setInputFocused(true);
    };

    const handleInputBlur = () => {
      setInputFocused(false);
    };

    const borderClassName = inputFocused ? 'border-white/40 ring ring-white/10' : 'border-[--border]';

    const toggleVisibility = () => {
      setToggle(prevToggle => !prevToggle); // Toggle the state when the button is clicked
    };

    const inputType = toggle ? type : 'text';

    return (
      <div className={`duration-200 transition-all flex border p-2 rounded-lg w-full ${borderClassName}`}>
        <input value={value} type={inputType} onChange={onChange} className={`bg-transparent items-center focus:border-white-60 w-full placeholder:text-[--highlight] outline-none ${className}`}
          placeholder={placeholder} autoComplete="new-password" onFocus={handleInputFocus} onBlur={handleInputBlur}   
          />

        {eye ? (
          <button onClick={toggleVisibility} className='text-[--highlight] hover:text-white transition'>
            {toggle ? <BsFillEyeSlashFill /> : <BsFillEyeFill />}
          </button>
        ) : (
          <></>
        )}
      </div>
        
    );
  };
  
  export default Input;
