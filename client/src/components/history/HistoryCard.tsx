import { Link } from 'react-router-dom'
import { numberFormatter } from '../../utils/helper'

interface IProps {
  title: string
  image: string
  slug: string
  amount: number
  date: string
}

const HistoryCard = ({ title, image, slug, amount, date }: IProps) => {
  return (
    <div className='rounded-md shadow-lg border border-gray-100 hover:scale-105 transition-[transform]'>
      <div className='rounded-t-md w-full h-40 bg-gray-200' />
      <div className='p-5'>
        <h1 className='font-medium text-xl'>{title}</h1>
        <p className='mt-2'>Amount: {numberFormatter(amount)},00</p>
        <p className='text-gray-500 mt-3'>{date}</p>
        <Link to={`/campaign/${slug}`} className='float-right outline-0 bg-orange-400 hover:bg-orange-500 transition-[background] text-white text-sm  rounded-md px-4 py-2 block w-fit mt-5'>Detail</Link>
        <div className='clear-both' />
      </div>
    </div>
  )
}

export default HistoryCard