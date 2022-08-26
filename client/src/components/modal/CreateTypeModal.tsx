import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AiOutlineClose } from 'react-icons/ai'
import { FormSubmit, IType } from './../../utils/Interface'
import { AppDispatch, RootState } from './../../redux/store'
import { createType, updateType } from './../../redux/slice/typeSlice'
import Loader from './../general/Loader'

interface IProps {
  openModal: boolean
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
  selectedItem: IType
}

const CreateTypeModal = ({ openModal, setOpenModal, selectedItem }: IProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const { alert, auth } = useSelector((state: RootState) => state)

  const [title, setTitle] = useState('')

  const modalRef = useRef() as React.MutableRefObject<HTMLDivElement>

  const handleSubmit = (e: FormSubmit) => {
    e.preventDefault()

    if (!title) {
      return dispatch({
        type: 'alert/alert',
        payload: {
          error: 'Please provide campaign type.'
        }
      })
    }

    if (selectedItem) {
      dispatch(updateType({ title, access_token: auth.access_token!, id: selectedItem.id }))
    } else {
      dispatch(createType({ title, access_token: auth.access_token! }))
    }
    
    setOpenModal(false)
  }

  useEffect(() => {
    if (selectedItem) {
      setTitle(selectedItem.title)
    }

    return () => setTitle('')
  }, [selectedItem])

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
              <label htmlFor='title' className='text-sm'>Type</label>
              <input type='text' name='title' id='title' value={title} onChange={e => setTitle(e.target.value)} className='w-full indent-2 text-sm outline-0 border border-gray-300 rounded-md h-10 mt-3' />
            </div>
            <button type='submit' disabled={alert.loading ? true : false} className={`${alert.loading ? 'bg-gray-200 hover:bg-gray-200 cursor-default' : 'bg-orange-400 hover:bg-orange-500 cursor-pointer'} transition-[background] text-white text-sm rounded-md w-24 h-10 float-right`}>
              {
                alert.loading
                ? <Loader />
                : 'Submit'
              }
            </button>
            <div className='clear-both' />
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateTypeModal