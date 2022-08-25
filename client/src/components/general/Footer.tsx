import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div className='md:px-24 px-10 bg-slate-50 py-10'>
      <div className='text-center'>
        <div className='outline-0 flex items-center gap-5 justify-center'>
          <img src={`${process.env.PUBLIC_URL}/image/logo.png`} alt='WeCare' width={36} />
          <h1 className='text-2xl font-semibold'><span className='text-gray-700'>We</span><span className='text-orange-400'>Care</span></h1>
        </div>
        <p className='mt-5 leading-loose text-sm'><span className='text-gray-700 font-semibold'>We</span><span className='text-orange-400 font-medium'>Care</span> is a fundraising platform that allows everyone <br className='md:block hidden' /> to create a campaign that can contribute to any kind of kindness act.</p>
      </div>
      <div className='flex items-center justify-center text-sm mt-12 gap-10'>
        <Link to='/' className='outline-0'>Home</Link>
        <Link to='/campaigns' className='outline-0'>Campaigns</Link>
        <Link to='/login' className='outline-0'>Sign In</Link>
        <Link to='/register' className='outline-0'>Sign Up</Link>
      </div>
    </div>
  )
}

export default Footer