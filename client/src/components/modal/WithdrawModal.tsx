import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AiOutlineClose } from 'react-icons/ai'
import { FormSubmit, ICampaign, InputChange } from '../../utils/Interface'
import { AppDispatch, RootState } from '../../redux/store'
import { createWithdraw } from '../../redux/slice/fundraiserCampaignSlice'
import Loader from '../general/Loader'

interface IProps {
  openModal: boolean
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
  selectedItem: ICampaign
}

const WithdrawModal = ({ openModal, setOpenModal, selectedItem }: IProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const { auth, alert } = useSelector((state: RootState) => state)

  const [withdrawData, setWithdrawData] = useState({
    amount: 0
  })

  const modalRef = useRef() as React.MutableRefObject<HTMLDivElement>

  const handleChange = (e: InputChange) => {
    const { name, value } = e.target
    setWithdrawData({ ...withdrawData, [name]: value })
  }

  const handleSubmit = (e: FormSubmit) => {
    e.preventDefault()
  
    if (!withdrawData.amount) {
      return dispatch({
        type: 'alert/alert',
        payload: {
          error: 'Please provide withdraw amount.'
        }
      })
    }

    if (withdrawData.amount > selectedItem.collected_amount - selectedItem.withdrawn_amount) {
      return dispatch({
        type: 'alert/alert',
        payload: {
          error: 'Invalid withdraw amount.'
        }
      })
    }

    dispatch(createWithdraw({ access_token: auth.access_token!, ...withdrawData, campaign_id: selectedItem.id }))

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
          <h1 className='text-lg font-medium'>Withdraw</h1>
          <AiOutlineClose onClick={() => setOpenModal(false)} className='text-xl cursor-pointer' />
        </div>
        <div className='p-5'>
          <form onSubmit={handleSubmit}>
            <div className='mb-6'>
              <label htmlFor='amount' className='text-sm'>Amount</label>
              <input type='number' name='amount' id='amount' value={withdrawData.amount} onChange={handleChange} className='w-full indent-2 text-sm outline-0 border border-gray-300 rounded-md h-10 mt-3' />
            </div>
            <button type='submit' disabled={alert.loading ? true : false} className={`${alert.loading ? 'bg-gray-200 hover:bg-gray-200 cursor-default' : 'bg-orange-400 hover:bg-orange-500 cursor-pointer'} transition-[background] text-white text-sm rounded-md w-24 h-10 float-right`}>
              {
                alert.loading
                ? <Loader />
                : 'Withdraw'
              }
            </button>
            <div className='clear-both' />
          </form>
        </div>
      </div>
    </div>
  )
}

export default WithdrawModal