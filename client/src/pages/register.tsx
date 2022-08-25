import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FormSubmit, InputChange } from '../utils/Interface.'
import Footer from './../components/general/Footer'
import Navbar from './../components/general/Navbar'

const Register = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirmation: ''
  })

  const handleChange = (e: InputChange) => {
    const { name, value } = e.target
    setUserData({ ...userData, [name]: value })
  }

  const handleSubmit = (e: FormSubmit) => {
    e.preventDefault()
  }

  return (
    <>
      <Navbar />
      <div className='mt-10 mb-20'>
        <h1 className='m-auto w-fit text-center text-2xl font-medium relative after:content-* after:w-2/3 after:h-[3px] after:bg-orange-300 after:absolute after:-bottom-4 after:left-1/2 after:-translate-x-1/2'>Sign Up</h1>
        <div className='mt-16 px-7'>
          <form onSubmit={handleSubmit} className='mt-16 w-full max-w-[450px] m-auto border border-gray-300 rounded-md p-7'>
            <div className='mb-7'>
              <label htmlFor='name' className='text-sm'>Name</label>
              <input type='text' id='name' name='name' value={userData.name} onChange={handleChange} className='w-full outline-0 h-12 rounded-md indent-2 border border-gray-300 text-sm mt-3' />
            </div>
            <div className='mb-7'>
              <label htmlFor='email' className='text-sm'>Email</label>
              <input type='text' id='email' name='email' value={userData.email} onChange={handleChange} className='w-full outline-0 h-12 rounded-md indent-2 border border-gray-300 text-sm mt-3' />
            </div>
            <div className='mb-7'>
              <label htmlFor='password' className='text-sm'>Password</label>
              <input type='password' id='password' name='password' value={userData.password} onChange={handleChange} className='w-full outline-0 h-12 rounded-md indent-2 border border-gray-300 text-sm mt-3' />
            </div>
            <div className='mb-7'>
              <label htmlFor='passwordConfirmation' className='text-sm'>Password Confirmation</label>
              <input type='password' id='passwordConfirmation' name='passwordConfirmation' value={userData.passwordConfirmation} onChange={handleChange} className='w-full outline-0 h-12 rounded-md indent-2 border border-gray-300 text-sm mt-3' />
            </div>
            <button type='submit' className='float-right bg-orange-400 hover:bg-orange-500 transition-[background] text-white rounded-md w-20 h-10 text-sm'>Sign Up</button>
            <div className='clear-both' />
          </form>
          <p className='text-center text-xs mt-5'>Already have an account? Click <Link to='/login' className='underline text-blue-500'>here</Link> to login</p>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Register