import { useState, useEffect, useRef } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { FormSubmit, InputChange } from '../../utils/Interface.'

interface IProps {
  openModal: boolean
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
}

const CreateCampaignModal = ({ openModal, setOpenModal }: IProps) => {
  const [campaignData, setCampaignData] = useState({
    title: '',
    type: '',
    target_amount: 0,
    description: ''
  })
  const [campaignImage, setCampaignImage] = useState<File>()

  const modalRef = useRef() as React.MutableRefObject<HTMLDivElement>

  const handleChange = (e: InputChange) => {
    const { name, value } = e.target
    setCampaignData({ ...campaignData, [name]: value })
  }

  const handleChangeImage = (e: InputChange) => {
    const target = e.target as HTMLInputElement
    const file = Object.values(target.files!)[0]
    setCampaignImage(file)
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
      <div ref={modalRef} className={`${openModal ? 'mt-0' : '-mt-20'} transition-all bg-white w-full max-w-[600px] rounded-md`}>
        <div className='flex items-center justify-between border-b border-gray-300 p-5'>
          <h1 className='text-lg font-medium'>Create Campaign</h1>
          <AiOutlineClose onClick={() => setOpenModal(false)} className='text-xl cursor-pointer' />
        </div>
        <form onSubmit={handleSubmit} className='p-5 max-h-[600px] hide-scrollbar overflow-auto'>
          <div className='mb-6'>
            <label htmlFor='title' className='text-sm'>Title</label>
            <input type='text' id='title' name='title' value={campaignData.title} onChange={handleChange} className='w-full outline-0 h-12 rounded-md indent-2 border border-gray-300 text-sm mt-3' />
          </div>
          <div className='mb-6'>
            <label htmlFor='type' className='text-sm'>Type</label>
            <select id='title' name='title' value={campaignData.type} onChange={handleChange} className='w-full outline-0 h-12 rounded-md indent-2 border border-gray-300 text-sm mt-3'>
              <option value='tset'>Test</option>
            </select>
          </div>
          <div className='mb-6'>
            <label htmlFor='target_amount' className='text-sm'>Target Amount</label>
            <input type='number' id='target_amount' name='target_amount' value={campaignData.target_amount} onChange={handleChange} className='w-full outline-0 h-12 rounded-md indent-2 border border-gray-300 text-sm mt-3' />
          </div>
          <div className='mb-6'>
            <label htmlFor='description' className='text-sm'>Description</label>
            <textarea id='description' name='description' value={campaignData.description} onChange={handleChange} className='w-full outline-0 h-32 rounded-md p-2 border border-gray-300 text-sm mt-3 resize-none' />
          </div>
          <div className='mb-8'>
            <label htmlFor='image' className='text-sm'>Image</label>
            <div className='flex items-start gap-8 mt-3'>
              <div className='flex-1 outline outline-3 outline-gray-300 h-24'>
                {
                  campaignImage &&
                  <img src={`${URL.createObjectURL(campaignImage)}`} alt={campaignData.title} className='w-full h-full' />
                }
              </div>
              <input onChange={handleChangeImage} type='file' className='flex-1 outline-0 rounded-md p-2 border border-gray-300 text-sm' />
            </div>
          </div>
          <button type='submit' className='text-white text-sm bg-orange-500 hover:bg-orange-600 transition-[background] rounded-md w-24 float-right h-10'>Submit</button>
          <div className='clear-both' />
        </form>
      </div>
    </div>
  )
}

export default CreateCampaignModal