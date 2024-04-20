import Nav  from '../components/Common/Nav/Nav';
import { FaBars, FaMousePointer } from 'react-icons/fa';
import { SlOptionsVertical } from 'react-icons/sl';
import { useState } from 'react';

export default function Layout({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [intro, setIntro] = useState(false);

  return (
    <div className={`h-screen lg:p-[0.8rem] flex flex-col select-none font-circular`}>
      {/* <div className=''> */}
      <div className='lg:hidden'>
        <div className='bg-BluePastel text-LightGray w-full h-10 flex items-center justify-between px-2 lg:hidden relative h-[50px]'>
          <div className='icon flex items-center gap-x-2' onClick={(e) => setIntro(!intro)}>
            <span className='absolute top-1/2 left-1/2  -translate-y-1/2 flex items-center justify-center text-center text-sm text-Snow font-extrabold font-mono'>
              {'('}0,<span className='text-Snow font-mono'>{'0)'}</span>
            </span>
          </div>
          <div className='icon flex items-center gap-x-2' onClick={(e) => setIsOpen(!isOpen)}>
            <span className='icon border-2 text-Snow border-Snow p-1 text-sm rounded-lg'>
              {' '}
              <FaBars />
            </span>
          </div>
        </div>
      </div>
      <div className='flex relative h-full justify-between gap-x-3'>
        {/* left most side */}
        <div className='w-full h-auto lg:w-12/12 shadow-2xl bg-BluePastel relative overflow-auto overflow-x-hidden no-scrollbar lg:rounded-xl'>{children}</div>
        {/* right side */}
        <div className={`hidden lg:block absolute lg:w-20 lg:relative bg-BluePastel shadow-2xl rounded-xl overflow-hidden`}>
          <div onClick={(e) => setIsOpen(!isOpen)} className='bg-BluePastel text-Snow hidden lg:flex items-center h-16 justify-center text-2xl '>
            <span className='icon border-2 border-Snow p-2 rounded-xl'>
              {' '}
              <FaBars />
            </span>
          </div>
          <span className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90 flex items-center justify-center text-center text-xl text-Snow font-extrabold tracking-widest'>
            .FlappyOwl
          </span>
        </div>
        {<Nav isOpen={isOpen} setIsOpen={setIsOpen} />}
      </div>
    </div>
  );
}
