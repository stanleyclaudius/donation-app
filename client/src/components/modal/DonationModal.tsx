import { useState, useEffect, useRef } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { getDataAPI } from '../../utils/fetchData'
import { ICampaign, IDonation } from '../../utils/Interface'
import DonationHistoryCard from '../campaign_detail/DonationHistoryCard'

interface IProps {
  openModal: boolean
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
  selectedItem: ICampaign
}

const DonationModal = ({ openModal, setOpenModal, selectedItem }: IProps) => {
  const [donations, setDonations] = useState<IDonation[]>([])

  const modalRef = useRef() as React.MutableRefObject<HTMLDivElement>

  useEffect(() => {
    const checkIfClickedOutside = (e: MouseEvent) => {
      if (openModal && modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setOpenModal(false)
      }
    }

    document.addEventListener('mousedown', checkIfClickedOutside)
    return () => document.removeEventListener('mousedown', checkIfClickedOutside)
  })
  
  useEffect(() => {
    if (selectedItem) {
      (async() => {
        const res = await getDataAPI(`donation/${selectedItem.id}`)
        setDonations(res.data.donations)
      })()
    }
  }, [selectedItem])

  return (
    <div className={`${openModal ? 'opacity-1 pointer-events-auto' : 'opacity-0 pointer-events-none'} transition-all fixed top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,.5)] flex items-center justify-center z-[9999] md:px-0 px-5`}>
      <div ref={modalRef} className={`${openModal ? 'mt-0' : '-mt-20'} transition-all bg-white w-full max-w-[500px] rounded-md`}>
        <div className='flex items-center justify-between border-b border-gray-300 p-5'>
          <h1 className='text-lg font-medium'>Donations</h1>
          <AiOutlineClose onClick={() => setOpenModal(false)} className='text-xl cursor-pointer' />
        </div>
        <div className='p-5 overflow-auto hide-scrollbar max-h-[600px]'>
          {
            donations.length > 0
            ? (
              <>
                {
                  donations.map(item => (
                    <DonationHistoryCard
                      key={item.id}
                      amount={item.amount}
                      avatar={item.avatar}
                      date={item.created_at}
                      name={item.is_anonymous ? 'Anonymous' : item.name}
                      prayer={item.words}
                    />
                  ))
                }
              </>
            )
            : (
              <div className='bg-red-500 text-sm text-white p-3 text-center rounded-md'>
                <p>There&apos;s no donation yet for this campaign.</p>
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default DonationModal