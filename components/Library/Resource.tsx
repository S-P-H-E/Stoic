import Image from 'next/image';
import Link from 'next/link';
import { HiDownload } from 'react-icons/hi'
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '../ui/context-menu';

interface Resource {
  id: string;
  name: string;
  image: string;
  downloadLink: string;
  tags: string[];
}
interface ResourceProps {
  resource: Resource
  onDelete: (tag: string) => void;
  userStatus: string | undefined;
}

export default function Resource({resource , onDelete, userStatus}: ResourceProps) {

  function truncateText(text: string, maxLength: number) {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  }
  return (
    <>
    {resource ? (
    <ContextMenu>
      <ContextMenuTrigger>
      <div className='pb-4 group relative flex flex-col gap-4 w-full h-[27rem] items-center text-center border border-[--border] hover:border-white/80 rounded-xl transition duration-200 overflow-hidden'>
        <div className="relative group-hover:scale-110 transition duration-200">

          <div className="absolute top-44 left-0 w-full h-20 bg-gradient-to-b from-transparent via-transparent to-[--bg]"/>
          {resource.image ? 
          <Image loading='lazy' alt='image' src={resource.image} width={400} height={200} className='w-full h-[15.4rem] object-cover rounded-b-lg' />
          : <div className='w-full h-[15.4rem] bg-[--border] animate-pulse'/>}
          </div>
          
        <div className="px-4 py-2 gap-4 flex flex-col relative z-10">
          <h1 className="text-3xl font-medium">{resource.name}</h1>
          <ul className='flex gap-2 justify-center'>
            {resource.tags.map((tag, index) => (
              <li className="bg-[--border] px-4 py-2 rounded-lg text-xs hover:bg-white/30 transition duration-200" key={index}>{tag}</li>
            ))}
          </ul>
          
          <Link href={resource.downloadLink || ''} target="_blank" className="flex items-center justify-center px-4 py-2 bg-white text-black rounded-xl gap-2 hover:bg-white/80 hover:scale-110 active:scale-95 transition duration-200">
            <HiDownload/>
            <p>Download</p>
          </Link>

          <div className='w-64 h-10 bg-white rounded-full opacity-0 group-hover:opacity-100 mt-4 blur-[110px] transition duration-500'/>
        </div>
      </div>
      </ContextMenuTrigger>
      {userStatus === 'admin' && (
        <ContextMenuContent>
          <ContextMenuItem onClick={() => onDelete(resource.id)} className="cursor-pointer">
            <button>Delete</button>
          </ContextMenuItem>
        </ContextMenuContent>
      )}
    </ContextMenu>
    ) : (
      <div className="h-[27rem] w-full animate-pulse bg-[--border]"/>
    )}
    </>
  )
}
