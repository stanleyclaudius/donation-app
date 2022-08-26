import { useEffect, useRef } from 'react'

interface IProps {
  openModal: boolean
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
  onSuccess?: () => void
}

const DeleteModal = ({ openModal, setOpenModal, onSuccess }: IProps) => {
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
      <div ref={modalRef} className={`${openModal ? 'mt-0' : '-mt-20'} transition-all bg-white w-full max-w-[500px] rounded-md text-center p-10`}>
        <img src={`${process.env.PUBLIC_URL}/image/delete.svg`} alt='WeCare' />
        <h1 className='text-xl mt-10'>Are you sure want to delete?</h1>
        <div className='flex items-center gap-6 justify-center mt-7'>
          <button onClick={onSuccess} className='bg-red-500 hover:bg-red-600 transition-[background] rounded-md text-white w-32 h-10'>Yes, I&apos;m sure</button>
          <button onClick={() => setOpenModal(false)} className='bg-gray-200 hover:bg-gray-300 transition-[background] h-10 w-24 rounded-md'>Cancel</button>
        </div>
      </div>
    </div>
  )
}

export default DeleteModal