import { Link } from 'react-router-dom'

interface IProps {
  title: string
  description: string
  image: string
  slug: string
  progress: number
}

const CampaignCard = ({ title, description, image, progress, slug }: IProps) => {
  return (
    <div className='rounded-md shadow-lg border border-gray-100 hover:scale-105 transition-[transform]'>
      <div className='rounded-t-md w-full h-40 bg-gray-200'>
        <img src={image} alt={title} className='w-full h-full' />
      </div>
      <div className='p-5'>
        <h1 className='font-medium text-xl'>{title}</h1>
        <div className='w-full h-2 rounded-full bg-gray-100 mt-3'>
          <div className='bg-blue-400 h-full rounded-md' style={{ width: `${progress > 100 ? 100 : progress}%` }} />
        </div>
        <p className='text-gray-500 text-sm mt-5 leading-relaxed'>{description.length > 125 ? description.substring(0, 125) + '...' : description}</p>
        <Link to={`/campaign/${slug}`} className='float-right outline-0 bg-orange-400 hover:bg-orange-500 transition-[background] text-white text-sm  rounded-md px-4 py-2 block w-fit mt-5'>Detail</Link>
        <div className='clear-both' />
      </div>
    </div>
  )
}

export default CampaignCard