import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FormSubmit, InputChange } from '../utils/Interface'
import { AppDispatch, RootState } from './../redux/store'
import { isEmailValid } from './../utils/validator'
import { postDataAPI } from './../utils/fetchData'
import Footer from './../components/general/Footer'
import Navbar from './../components/general/Navbar'
import Loader from './../components/general/Loader'

const Register = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { alert, auth } = useSelector((state: RootState) => state)

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

  const handleSubmit = async(e: FormSubmit) => {
    e.preventDefault()

    if (!userData.name) {
      return dispatch({
        type: 'alert/alert',
        payload: {
          error: 'Please provide name to register.'
        }
      })
    }

    if (!userData.email) {
      return dispatch({
        type: 'alert/alert',
        payload: {
          error: 'Please provide email to register.'
        }
      })
    } else if (!isEmailValid(userData.email)) {
      return dispatch({
        type: 'alert/alert',
        payload: {
          error: 'Please provide valid email address.'
        }
      })
    }

    if (!userData.password) {
      return dispatch({
        type: 'alert/alert',
        payload: {
          error: 'Please provide password for your account.'
        }
      })
    } else if (userData.password.length < 6) {
      return dispatch({
        type: 'alert/alert',
        payload: {
          error: 'Password should be at least 6 characters.'
        }
      })
    }

    if (userData.password !== userData.passwordConfirmation) {
      return dispatch({
        type: 'alert/alert',
        payload: {
          error: 'Password confirmation should be matched.'
        }
      })
    }

    try {
      dispatch({
        type: 'alert/alert',
        payload: {
          loading: true
        }
      })

      await postDataAPI('auth/register', userData)

      dispatch({
        type: 'alert/alert',
        payload: {
          success: 'Account has been registered successfully.'
        }
      })

      navigate('/login')
    } catch (err: any) {
      dispatch({
        type: 'alert/alert',
        payload: {
          error: err.response.data.error
        }
      })
    }
  }

  useEffect(() => {
    if (auth.access_token) {
      navigate('/')
    }
  }, [auth.access_token, navigate])

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
            <button type='submit' disabled={alert.loading ? true : false} className={`float-right ${alert.loading ? 'bg-gray-200 hover:bg-gray-200 cursor-default' : 'bg-orange-400 hover:bg-orange-500 cursor-pointer'} transition-[background] text-white rounded-md w-20 h-10 text-sm`}>
              {
                alert.loading
                ? <Loader />
                : 'Sign Up'
              }
            </button>
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