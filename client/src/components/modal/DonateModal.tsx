import { useState, useEffect, useRef } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { FormSubmit, InputChange } from '../../utils/Interface'

interface IProps {
  openModal: boolean
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
}

const DonateModal = ({ openModal, setOpenModal }: IProps) => {
  const [donateData, setDonateData] = useState({
    amount: 0
  })

  const modalRef = useRef() as React.MutableRefObject<HTMLDivElement>

  const handleChange = (e: InputChange) => {
    const { name, value } = e.target
    setDonateData({ ...donateData, [name]: value })
  }

  const handleSubmit = (e: FormSubmit) => {
    e.preventDefault()
  }

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
      <div ref={modalRef} className={`${openModal ? 'mt-0' : '-mt-20'} transition-all bg-white md:w-1/3 w-full rounded-md`}>
        <div className='flex items-center justify-between border-b border-gray-300 p-5'>
          <h1 className='text-lg font-medium'>Donate</h1>
          <AiOutlineClose onClick={() => setOpenModal(false)} className='text-xl cursor-pointer' />
        </div>
        <div className='p-5'>
          <form onSubmit={handleSubmit}>
            <div className='mb-6'>
              <label htmlFor='amount' className='text-sm'>Amount</label>
              <input type='number' name='amount' id='amount' value={donateData.amount} onChange={handleChange} className='w-full indent-2 text-sm outline-0 border border-gray-300 rounded-md h-10 mt-3' />
            </div>
            <button type='submit' className='bg-orange-400 hover:bg-orange-500 transition-[background] text-white text-sm rounded-md w-24 h-10 float-right'>Donate</button>
            <div className='clear-both' />
          </form>
        </div>
      </div>
    </div>
  )
}

export default DonateModal