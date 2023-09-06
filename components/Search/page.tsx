import React, { useState, useEffect  } from 'react';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { BiSearch } from 'react-icons/bi'
import { BsStars } from 'react-icons/bs'
import { AiOutlineMenu } from "react-icons/ai";
import { YoutubeLogo, FileArrowDown, Gear, TiktokLogo, Triangle } from "@phosphor-icons/react";
import Link from 'next/link';
import openai from '@/app/api/GPT';
import Image from 'next/image';

export default function Search(){
    const [input, setInput] = useState('');
    const [response, setResponse] = useState('');
    const [conversation, setConversation] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false); // Add loading state
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
      };
  
    const handleSubmit = async () => {
      try {
        const newMessage = { role: 'user', content: input };
        const updatedConversation = [...conversation, newMessage];
        setLoading(true); // Set loading to true when submitting
  
        const completion = await openai.chat.completions.create({
          messages: updatedConversation,
          model: 'gpt-3.5-turbo',
        });
  
        const modelResponse = completion.choices[0].message.content;

        if (modelResponse !== null) {
            setResponse(modelResponse);
            setConversation(updatedConversation);
            setLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
        setLoading(false); // Set loading to false on error as well
      }
    };

    const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
          e.preventDefault(); // Prevent the default behavior of the Enter key (submitting a form)
          handleSubmit(); // Call handleSubmit when Enter key is pressed
        }
      };

    return(
        <Dialog>
            <DialogTrigger>
                <div className="hover:bg-[--border] transition p-2 rounded-lg" > {/* just a hover animation delete if u dont like it */}
                    <AiOutlineMenu size={20}/>
                </div>
            </DialogTrigger>
            <DialogContent>
                <div>
                    <div className="flex justify-center items-center gap-2 text-[#444445] px-4 py-4 rounded-full w-full">
                        <BsStars size={20}/>
                        <input 
                            placeholder="Ask AI..." 
                            className="bg-transparent placeholder:text-[#444445] w-full outline-none text-white"
                            value={input}
                            onChange={handleInputChange}
                            onKeyDown={handleInputKeyPress}
                            />
                    </div>
                    <div className="h-[1px] bg-[#272727] my-1"/>
                        {/* ChatGPT response */}
                        {loading ? (
                            <>
                                <div className="text-[#444445] px-5 pt-4 animate-bounce">...</div>
                                <div className="h-[1px] bg-[#272727] mt-5"/>
                            </>
                        ) : (
                            response && (
                                <>
                                    <div className='px-5 pt-4'>
                                    <p>{response}</p>
                                    </div>
                                    <div className="h-[1px] bg-[#272727] mt-5"/>
                                </>
                            )
                        )}

                    <div className="flex flex-col items-start gap-1 p-5">
                        <h1 className="text-[#444445] cursor-default">Converters</h1>

                        <Link href={'/converters/ytmp4'} target='_blank' className="flex justify-start items-center gap-2 transition-all duration-300 rounded-lg hover:bg-[#1B1B1D] w-full px-2 py-2">
                            <Image src={'/images/youtube.png'} alt='tiktok' width={15} height={0}/>
                            YouTube
                        </Link>
                        <Link href={'/converters/tiktok'} target='_blank' className="flex justify-start items-center gap-2 transition-all duration-300 rounded-lg hover:bg-[#1B1B1D] w-full px-2 py-2">
                            <Image src={'/images/tiktok.png'} alt='tiktok' width={15} height={0}/>
                            TikTok
                        </Link>
                        <Link href={'/converters/rumble'} target='_blank' className="flex justify-start items-center gap-2 transition-all duration-300 rounded-lg hover:bg-[#1B1B1D] w-full px-2 py-2">
                            <Image src={'/images/rumble.png'} alt='tiktok' width={15} height={0}/>
                            Rumble
                        </Link>
                    </div>

                    <div className="flex flex-col items-start gap-1 p-5">
                        <h1 className="text-[#444445] cursor-default">Resources</h1>

                        <Link href={'/library'} className="flex justify-start items-center gap-2 transition-all duration-300 rounded-lg hover:bg-[#1B1B1D] w-full px-2 py-2">
                            <FileArrowDown size={22} color="#444445" weight="fill" />
                            Library
                        </Link>
                    </div>

                    <div className="flex flex-col items-start gap-1 p-5">
                        <h1 className="text-[#444445] cursor-default">Profile</h1>

                        <Link href={'/settings'} className="flex justify-start items-center gap-2 transition-all duration-300 rounded-lg hover:bg-[#1B1B1D] w-full px-2 py-2">
                            <Gear size={22} color="#444445" weight="fill" />
                            Settings
                        </Link>
                    </div>
                </div>
            </DialogContent>
        </Dialog>

    )
}