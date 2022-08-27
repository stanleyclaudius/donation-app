import { currencyFormatter } from "../../utils/helper"

interface IProps {
  name: string
  prayer: string
  amount: number
  date: string
  avatar: string
}

const DonationHistoryCard = ({ name, prayer, amount, date, avatar }: IProps) => {
  return (
    <div className='flex gap-6 mb-12'>
      <div className='w-14 h-14 rounded-full outline outline-offset-1 outline-gray-300 shrink-0'>
        <img src={avatar} alt={name} className='w-full h-full rounded-full' />
      </div>
      <div>
        <h1 className='font-medium'>{name}</h1>
        <p className='mt-2 text-sm leading-relaxed'>Donate <span className='font-medium'>{currencyFormatter(amount)},00</span> at {date}</p>
        <p className='text-sm mt-2 text-gray-500'>{prayer}</p>
      </div>
    </div>
  )
}

export default DonationHistoryCard