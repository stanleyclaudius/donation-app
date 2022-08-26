import { useState, useEffect, useRef } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { FormSubmit, InputChange } from '../../utils/Interface'

interface IProps {
  openModal: boolean
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
}

const CreateFundraiserModal = ({ openModal, setOpenModal }: IProps) => {
  const [fundraiserData, setFundraiserData] = useState({
    phone: '',
    address: '',
    description: ''
  })

  const modalRef = useRef() as React.MutableRefObject<HTMLDivElement>

  const handleChange = (e: InputChange) => {
    const { name, value } = e.target
    setFundraiserData({ ...fundraiserData, [name]: value })
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
      <div ref={modalRef} className={`${openModal ? 'mt-0' : '-mt-20'} transition-all bg-white w-full max-w-[550px] rounded-md`}>
        <div className='flex items-center justify-between border-b border-gray-300 p-5'>
          <h1 className='text-lg font-medium'>Become a Fundraiser</h1>
          <AiOutlineClose onClick={() => setOpenModal(false)} className='text-xl cursor-pointer' />
        </div>
        <form onSubmit={handleSubmit} className='p-5'>
          <div className='mb-6'>
            <label htmlFor='phone' className='text-sm'>Phone</label>
            <input type='text' id='phone' name='phone' value={fundraiserData.phone} onChange={handleChange} className='border border-gray-300 outline-0 px-2 h-10 mt-3 text-sm rounded-md w-full' />
          </div>
          <div className='mb-6'>
            <label htmlFor='address' className='text-sm'>Address</label>
            <input type='text' id='address' name='address' value={fundraiserData.address} onChange={handleChange} className='border border-gray-300 outline-0 px-2 h-10 mt-3 text-sm rounded-md w-full' />
          </div>
          <div className='mb-6'>
            <label htmlFor='description' className='text-sm'>Description</label>
            <textarea id='description' name='description' value={fundraiserData.description} onChange={handleChange} className='border border-gray-300 outline-0 p-2 h-32 mt-3 text-sm rounded-md w-full resize-none' />
          </div>
          <button type='submit' className='bg-orange-400 hover:bg-orange-500 text-sm text-white w-24 h-10 rounded-md float-right transition-[background]'>Submit</button>
          <div className='clear-both' />
        </form>
      </div>
    </div>
  )
}

export default CreateFundraiserModal