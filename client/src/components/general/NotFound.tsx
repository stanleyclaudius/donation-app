const NotFound = () => {
  return (
    <div className='flex flex-col justify-center h-screen text-2xl font-medium'>
      <div className='outline-0 flex items-center gap-9 justify-center'>
        <img src={`${process.env.PUBLIC_URL}/image/logo.png`} alt='WeCare' width={64} />
        <h1 className='text-5xl font-semibold'><span className='text-gray-700'>We</span><span className='text-orange-400'>Care</span></h1>
      </div>
      <p className='text-center mt-12'>404 | Not Found</p>
    </div>
  )
}

export default NotFound