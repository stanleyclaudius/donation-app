import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AiOutlineClose } from 'react-icons/ai'
import { FormSubmit, InputChange } from '../../utils/Interface'
import { AppDispatch, RootState } from '../../redux/store'
import { createDonation } from '../../redux/slice/campaignDetailSlice'
import Loader from '../general/Loader'

interface IProps {
  openModal: boolean
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
  campaignId: number
}

const DonateModal = ({ openModal, setOpenModal, campaignId }: IProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const { auth, alert } = useSelector((state: RootState) => state)

  const [donateData, setDonateData] = useState({
    amount: 0,
    words: '',
    is_anonymous: false
  })

  const modalRef = useRef() as React.MutableRefObject<HTMLDivElement>

  const handleChange = (e: InputChange) => {
    const { name, value } = e.target
    setDonateData({ ...donateData, [name]: value })
  }

  const handleSubmit = (e: FormSubmit) => {
    e.preventDefault()

    if (!donateData.amount) {
      return dispatch({
        type: 'alert/alert',
        payload: {
          error: 'Please provide donation amount.'
        }
      })
    }

    dispatch(createDonation({ campaign_id: campaignId, ...donateData, auth  }))

    setOpenModal(false)
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
            <div className='mb-8'>
              <label htmlFor='words' className='text-sm'>Prayer</label>
              <input type='text' name='words' id='words' value={donateData.words} onChange={handleChange} className='w-full indent-2 text-sm outline-0 border border-gray-300 rounded-md h-10 mt-3' />
            </div>
            <div className='flex items-center justify-between'>
              <div onClick={() => setDonateData({ ...donateData, is_anonymous: !donateData.is_anonymous })} className={`text-sm border border-gray-300 p-3 rounded-md w-fit cursor-pointer hover:border-blue-500 hover:border-2 ${donateData.is_anonymous ? 'border-blue-500 border-2' : undefined}`}>
                <p>Stay Anonymous</p>
              </div>
              <button type='submit' disabled={alert.loading ? true : false} className={`${alert.loading ? 'bg-gray-200 hover:bg-gray-200 cursor-default' : 'bg-orange-400 hover:bg-orange-500 cursor-pointer'} transition-[background] text-white text-sm rounded-md w-24 h-10`}>
                {
                  alert.loading
                  ? <Loader />
                  : 'Donate'
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default DonateModal