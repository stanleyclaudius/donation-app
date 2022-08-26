import { useState, useEffect, useRef } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { FormSubmit } from '../../utils/Interface.'

interface IProps {
  openModal: boolean
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
}

const CreateTypeModal = ({ openModal, setOpenModal }: IProps) => {
  const [campaignType, setCampaignType] = useState('')

  const modalRef = useRef() as React.MutableRefObject<HTMLDivElement>

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
      <div ref={modalRef} className={`${openModal ? 'mt-0' : '-mt-20'} transition-all bg-white w-full max-w-[500px] rounded-md`}>
        <div className='flex items-center justify-between border-b border-gray-300 p-5'>
          <h1 className='text-lg font-medium'>Create Campaign Type</h1>
          <AiOutlineClose onClick={() => setOpenModal(false)} className='text-xl cursor-pointer' />
        </div>
        <div className='p-5'>
          <form onSubmit={handleSubmit}>
            <div className='mb-6'>
              <label htmlFor='type' className='text-sm'>Type</label>
              <input type='text' name='type' id='type' value={campaignType} onChange={e => setCampaignType(e.target.value)} className='w-full indent-2 text-sm outline-0 border border-gray-300 rounded-md h-10 mt-3' />
            </div>
            <button type='submit' className='bg-orange-400 hover:bg-orange-500 transition-[background] text-white text-sm rounded-md w-24 h-10 float-right'>Submit</button>
            <div className='clear-both' />
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateTypeModal