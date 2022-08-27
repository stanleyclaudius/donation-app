import { useEffect, useRef } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { FaBuilding, FaPhoneAlt } from 'react-icons/fa'
import { MdDescription } from 'react-icons/md'
import { IFundraiser } from '../../utils/Interface'

interface IProps {
  openModal: boolean
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
  selectedItem: IFundraiser
}

const FundraiserDetailModal = ({ openModal, setOpenModal, selectedItem }: IProps) => {
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
      <div ref={modalRef} className={`${openModal ? 'mt-0' : '-mt-20'} transition-all bg-white w-full max-w-[600px] rounded-md`}>
        <div className='flex items-center justify-between border-b border-gray-300 p-5'>
          <h1 className='text-lg font-medium'>Fundraiser Detail</h1>
          <AiOutlineClose onClick={() => setOpenModal(false)} className='text-xl cursor-pointer' />
        </div>
        <div className='p-5 max-h-[600px] overflow-auto hide-scrollbar'>
          <div className='flex items-center gap-7'>
            <div className='w-16 h-16 outline outline-gray-300 outline-3 shrink-0 rounded-full'>
              <img src={selectedItem?.avatar} alt={selectedItem?.name} className='w-full h-full rounded-full' />
            </div>
            <div>
              <h1>{selectedItem?.name}</h1>
              <p className='text-gray-500 text-sm mt-3'>{selectedItem?.email}</p>
            </div>
          </div>
          <div className='flex items-center gap-3 mt-9'>
            <FaPhoneAlt className='text-gray-600 shrink-0' />
            <p>{selectedItem?.phone}</p>
          </div>
          <div className='flex items-center gap-3 mt-5'>
            <FaBuilding className='text-gray-600 shrink-0' />
            <p>{selectedItem?.address}</p>
          </div>
          <div className='flex gap-3 mt-5'>
            <MdDescription className='text-gray-600 shrink-0 text-lg' />
            <p className='text-sm leading-relaxed'>
              {selectedItem?.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FundraiserDetailModal