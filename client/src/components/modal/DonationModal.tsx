import { useEffect, useRef } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import DonationHistoryCard from '../campaign_detail/DonationHistoryCard'

interface IProps {
  openModal: boolean
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
}

const DonationModal = ({ openModal, setOpenModal }: IProps) => {
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

  return (
    <div className={`${openModal ? 'opacity-1 pointer-events-auto' : 'opacity-0 pointer-events-none'} transition-all fixed top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,.5)] flex items-center justify-center z-[9999] md:px-0 px-5`}>
      <div ref={modalRef} className={`${openModal ? 'mt-0' : '-mt-20'} transition-all bg-white w-full max-w-[500px] rounded-md`}>
        <div className='flex items-center justify-between border-b border-gray-300 p-5'>
          <h1 className='text-lg font-medium'>Donations</h1>
          <AiOutlineClose onClick={() => setOpenModal(false)} className='text-xl cursor-pointer' />
        </div>
        <div className='p-5 overflow-auto hide-scrollbar max-h-[600px]'>
          <DonationHistoryCard
            amount={20000}
            avatar=''
            date='2022-02-02'
            name='Anonymous'
            prayer='Semoga cepat sembuh :)'
          />
          <DonationHistoryCard
            amount={20000}
            avatar=''
            date='2022-02-02'
            name='Anonymous'
            prayer='Semoga cepat sembuh :)'
          />
          <DonationHistoryCard
            amount={20000}
            avatar=''
            date='2022-02-02'
            name='Anonymous'
            prayer='Semoga cepat sembuh :)'
          />
          <DonationHistoryCard
            amount={20000}
            avatar=''
            date='2022-02-02'
            name='Anonymous'
            prayer='Semoga cepat sembuh :)'
          />
          <DonationHistoryCard
            amount={20000}
            avatar=''
            date='2022-02-02'
            name='Anonymous'
            prayer='Semoga cepat sembuh :)'
          />
          <DonationHistoryCard
            amount={20000}
            avatar=''
            date='2022-02-02'
            name='Anonymous'
            prayer='Semoga cepat sembuh :)'
          />
        </div>
      </div>
    </div>
  )
}

export default DonationModal