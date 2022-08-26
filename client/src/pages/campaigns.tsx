import { useState, useEffect, useRef } from 'react'
import { AiFillCaretDown, AiOutlineSearch } from 'react-icons/ai'
import CampaignCard from '../components/general/CampaignCard'
import Pagination from '../components/general/Pagination'
import { getDataAPI } from '../utils/fetchData'
import { ICampaign } from '../utils/Interface'
import Footer from './../components/general/Footer'
import Navbar from './../components/general/Navbar'

const Campaigns = () => {
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(0)
  const [campaigns, setCampaigns] = useState<ICampaign[]>([])
  const [selectedType, setSelectedType] = useState('')
  const [openType, setOpenType] = useState(false)

  const typeRef = useRef() as React.MutableRefObject<HTMLDivElement>

  const handleClickType = (type: string) => {
    setSelectedType(type)
    setOpenType(false)
  }

  useEffect(() => {
    (async() => {
      const res = await getDataAPI(`campaign?page=${page}&limit=6`)
      setCampaigns(res.data.campaigns)
      setTotalPage(res.data.total_page)
    })()
  }, [page])

  useEffect(() => {
    const checkIfClickedOutside = (e: MouseEvent) => {
      if (openType && typeRef.current && !typeRef.current.contains(e.target as Node)) {
        setOpenType(false)
      }
    }

    document.addEventListener('mousedown', checkIfClickedOutside)
    return () => document.removeEventListener('mousedown', checkIfClickedOutside)
  }, [openType])

  return (
    <>
      <Navbar />
      <div className='mb-20'>
        <div className='relative'>
          <div className='bg-orange-400 h-24 px-20' />
          <form className='absolute -bottom-6 left-1/2 -translate-x-1/2 w-full md:max-w-[650px] max-w-[350px] flex items-center bg-white shadow-xl border border-gray-300 rounded-md px-4 gap-4'>
            <AiOutlineSearch className='text-lg text-gray-500 shrink-0' />
            <input type="text" className='w-full text-sm  h-14 outline-0' placeholder='Search campaign keyword ...' />
            <p className='text-2xl text-gray-200'>|</p>
            <div ref={typeRef} className='relative'>
              <div onClick={() => setOpenType(!openType)} className='flex items-center gap-3 text-gray-700 cursor-pointer'>
                <p className='text-sm capitalize'>{selectedType === '' ? 'type' : selectedType}</p>
                <AiFillCaretDown />
              </div>
              <div className={`absolute top-full mt-5 right-0 bg-white shadow-xl border boder-gray-300 text-sm rounded-md ${openType ? 'scale-y-1' : 'scale-y-0'} transition-[transform] origin-top`}>
                <p onClick={() => handleClickType('school')} className='cursor-pointer border-b border-gray-300 pl-3 py-3 pr-7 hover:bg-gray-100'>School</p>
                <p onClick={() => handleClickType('children')} className='cursor-pointer pl-3 py-3 pr-7 hover:bg-gray-100'>Children</p>
              </div>
            </div>
          </form>
        </div>
        <div className='md:px-24 px-10 mt-24'>
          <div className='grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-14 mt-14'>
            {
              campaigns.map(item => (
                <CampaignCard
                  key={item.id}
                  title={item.title}
                  description={item.description}
                  image={item.image}
                  progress={item.collected_amount / item.target_amount * 100}
                  slug={item.slug}
                />
              ))
            }
          </div>
        </div>

        {
          totalPage > 1 &&
          <Pagination
            totalPage={totalPage}
            currentPage={page}
            setPage={setPage}
          />
        }
      </div>
      <Footer />
    </>
  )
}

export default Campaigns