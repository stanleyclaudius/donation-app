import { useEffect, useRef } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { FaBuilding, FaPhoneAlt } from 'react-icons/fa'
import { MdDescription } from 'react-icons/md'

interface IProps {
  openModal: boolean
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
}

const FundraiserDetailModal = ({ openModal, setOpenModal }: IProps) => {
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
            <div className='w-16 h-16 outline outline-gray-300 outline-3 shrink-0 rounded-full'></div>
            <div>
              <h1>Fundraiser 1</h1>
              <p className='text-gray-500 text-sm mt-3'>fundraiser1@gmail.com</p>
            </div>
          </div>
          <div className='flex items-center gap-3 mt-9'>
            <FaPhoneAlt className='text-gray-600 shrink-0' />
            <p>0812 9292 2821</p>
          </div>
          <div className='flex items-center gap-3 mt-5'>
            <FaBuilding className='text-gray-600 shrink-0' />
            <p>West Jakarta, Jakarta, Indonesia</p>
          </div>
          <div className='flex gap-3 mt-5'>
            <MdDescription className='text-gray-600 shrink-0 text-lg' />
            <p className='text-sm leading-relaxed'>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat ex sit ipsum tenetur quam cum laborum labore rerum. Autem placeat quos corrupti tempore molestiae doloribus, optio consequatur rem. Quam cupiditate eaque provident quaerat rem corporis voluptate, est numquam odit laboriosam quia perferendis aut molestiae sapiente eligendi consectetur sint iure ullam eius. Cum, beatae sequi aperiam facilis sed assumenda excepturi minima? Porro beatae, sequi assumenda molestias placeat atque sint saepe veritatis eligendi quidem nostrum, quas, aperiam deleniti deserunt ad eos exercitationem quam inventore aut dolorum! Adipisci, voluptate iusto error odit vitae, non incidunt velit, a placeat atque nemo officia sed iure.
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus, quo officia voluptates unde perspiciatis magnam nemo nihil a. Deserunt consequuntur quia optio, velit architecto ipsum molestias sint aliquam libero nostrum obcaecati dicta iste totam, nam asperiores quod. Placeat accusantium error dolor, doloremque laudantium nemo dolorem dolores vel assumenda est reiciendis? Incidunt vero nisi assumenda esse inventore reiciendis veritatis? Eveniet, eum odio! Vero possimus dicta veritatis aliquam reprehenderit corporis ea sapiente dignissimos blanditiis placeat autem mollitia pariatur explicabo aperiam nihil voluptas impedit, quod soluta debitis! Tempora rerum quas mollitia itaque, minus aperiam laudantium non error vitae maiores provident voluptate sapiente accusamus?
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FundraiserDetailModal