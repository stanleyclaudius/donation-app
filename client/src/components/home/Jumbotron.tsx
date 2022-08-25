import { Link } from 'react-router-dom'

const Jumbotron = () => {
  return (
    <div className='md:px-24 px-10 flex lg:flex-row flex-col-reverse md:mt-7 mt-5 items-center gap-16'>
      <div className='flex-1'>
        <h1 className='text-4xl font-medium text-gray-800 leading-relaxed'>Make The World Better With <span className='text-gray-700'>We</span><span className='text-orange-400'>Care</span></h1>
        <p className='mt-4 leading-loose'><span className='text-gray-700 font-semibold'>We</span><span className='text-orange-400 font-medium'>Care</span> is a fundraising platform that allows everyone to create a campaign that can contribute to any kind of kindness act.</p>
        <Link to='/campaigns' className='rounded-md bg-orange-400 outline-0 hover:bg-orange-500 transition-[background] text-white px-6 py-3 text-sm block mt-7 w-fit'>All Campaigns</Link>
      </div>
      <div className='flex-1'>
        <img src={`${process.env.PUBLIC_URL}/image/jumbotron.jpg`} alt='WeCare' />
      </div>
    </div>
  )
}

export default Jumbotron