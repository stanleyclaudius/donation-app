import { useState, useEffect, useRef } from 'react'
import { GiHamburgerMenu } from 'react-icons/gi'
import { AiOutlineClose } from 'react-icons/ai'
import { Link } from 'react-router-dom'
import NavbarLink from './NavbarLink'

const Navbar = () => {
  const [openSidebar, setOpenSidebar] = useState(false)

  const sidebarRef = useRef() as React.MutableRefObject<HTMLDivElement>

  useEffect(() => {
    const checkIfClickedOutside = (e: MouseEvent) => {
      if (openSidebar && sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setOpenSidebar(false)
      }
    }

    document.addEventListener('mousedown', checkIfClickedOutside)
    return () => document.removeEventListener('mousedown', checkIfClickedOutside)
  }, [openSidebar])

  return (
    <div className='flex items-center justify-between md:px-24 px-10 py-6 z-[999] sticky top-0 bg-white'>
      <Link to='/' className='outline-0 flex items-center gap-5'>
        <img src={`${process.env.PUBLIC_URL}/image/logo.png`} alt='WeCare' width={36} />
        <h1 className='text-2xl font-semibold'><span className='text-gray-700'>We</span><span className='text-orange-400'>Care</span></h1>
      </Link>
      <div onClick={() => setOpenSidebar(true)} className='md:hidden block'>
        <GiHamburgerMenu />
      </div>
      <div ref={sidebarRef} className={`flex md:items-center gap-12 text-sm md:static fixed top-0 transition-all ${openSidebar ? 'right-0' : '-right-[2200px]'} md:w-auto w-[220px] md:h-auto h-full md:bg-transparent bg-white md:shadow-none shadow-xl md:flex-row flex-col md:p-0 p-6`}>
        <div className='md:hidden flex justify-end'>
          <AiOutlineClose onClick={() => setOpenSidebar(false)} className='cursor-pointer' />
        </div>
        <NavbarLink path='/' text='Home' />
        <NavbarLink path='/campaigns' text='Campaigns' />
        <NavbarLink path='/history' text='History' />
        <NavbarLink path='/login' text='Login' />
      </div>
    </div>
  )
}

export default Navbar