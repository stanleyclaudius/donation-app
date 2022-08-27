import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { GiHamburgerMenu } from 'react-icons/gi'
import { AiOutlineClose } from 'react-icons/ai'
import { AppDispatch, RootState } from './../../redux/store'
import { logout } from './../../redux/slice/authSlice'
import NavbarLink from './NavbarLink'
import CreateFundraiserModal from '../modal/CreateFundraiserModal'

const Navbar = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { auth } = useSelector((state: RootState) => state)

  const [openSidebar, setOpenSidebar] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(false)
  const [openCreateFundraiserModal, setOpenCreateFundraiserModal] = useState(false)

  const sidebarRef = useRef() as React.MutableRefObject<HTMLDivElement>
  const dropdownRef = useRef() as React.MutableRefObject<HTMLDivElement>

  useEffect(() => {
    const checkIfClickedOutside = (e: MouseEvent) => {
      if (openSidebar && sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setOpenSidebar(false)
      }
    }

    document.addEventListener('mousedown', checkIfClickedOutside)
    return () => document.removeEventListener('mousedown', checkIfClickedOutside)
  }, [openSidebar])

  useEffect(() => {
    const checkIfClickedOutside = (e: MouseEvent) => {
      if (openDropdown && dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(false)
      }
    }

    document.addEventListener('mousedown', checkIfClickedOutside)
    return () => document.removeEventListener('mousedown', checkIfClickedOutside)
  }, [openDropdown])

  return (
    <>
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
          {
            !auth.access_token &&
            <NavbarLink path='/login' text='Login' />
          }
          {
            auth.access_token &&
            <>
              {
                auth.user?.role === 'user' &&
                <button onClick={() => setOpenCreateFundraiserModal(true)} className='text-white text-sm bg-blue-500 hover:bg-blue-600 px-4 py-3 transition-[background]'>Become a Fundraiser</button>
              }
              <div ref={dropdownRef} className='relative'>
                <div onClick={() => setOpenDropdown(!openDropdown)} className='outline outline-3 outline-gray-300 w-10 h-10 rounded-full cursor-pointer'>
                  <img src={auth.user?.avatar} alt={auth.user?.name} />
                </div>
                <div className={`absolute bg-white rounded-md shadow-xl border border-gray-200 w-40 top-full right-0 mt-3 ${openDropdown ? 'scale-y-1' : 'scale-y-0'} origin-top transition-all`}>
                  <Link to='/history' className='p-3 block border-b border-gray-200 hover:bg-gray-100'>History</Link>
                  {
                    auth.user?.role === 'fundraiser' &&
                    <Link to='/campaign' className='p-3 block border-b border-gray-200 hover:bg-gray-100'>Own Campaigns</Link>
                  }
                  {
                    auth.user?.role === 'admin' &&
                    <>
                      <Link to='/fundraiser' className='p-3 block border-b border-gray-200 hover:bg-gray-100'>Fundraisers</Link>
                      <Link to='/type' className='p-3 block border-b border-gray-200 hover:bg-gray-100'>Types</Link>
                    </>
                  }
                  <Link onClick={() => dispatch(logout(auth.access_token!))} to='/' className='p-3 block border-b border-gray-200 hover:bg-gray-100'>Logout</Link>
                </div>
              </div>
            </>
          }
        </div>
      </div>

      <CreateFundraiserModal
        openModal={openCreateFundraiserModal}
        setOpenModal={setOpenCreateFundraiserModal}
      />
    </>
  )
}

export default Navbar