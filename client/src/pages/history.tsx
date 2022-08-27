import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from './../redux/store'
import { getHistory } from './../redux/slice/historySlice'
import HistoryCard from './../components/history/HistoryCard'
import Footer from './../components/general/Footer'
import Navbar from './../components/general/Navbar'
import Pagination from './../components/general/Pagination'
import Head from './../utils/Head'

const History = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { auth, history } = useSelector((state: RootState) => state)

  const [page, setPage] = useState(1)

  useEffect(() => {
    dispatch(getHistory({ access_token: auth.access_token!, page }))
  }, [dispatch, auth.access_token, page])

  useEffect(() => {
    if (!auth.access_token) {
      navigate('/')
    }
  }, [auth, navigate])

  return (
    <>
      <Head title='Donation History' />
      <Navbar />
      <div className='mb-20 mt-10'>
        <h1 className='m-auto w-fit text-center text-2xl font-medium relative after:content-* after:w-2/3 after:h-[3px] after:bg-orange-300 after:absolute after:-bottom-4 after:left-1/2 after:-translate-x-1/2'>Donation History</h1>
        <div className='grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-12 md:px-24 px-10 mt-20'>
          {
            history.data.length > 0
            ? (
              <>
                {
                  history.data.map(item => (
                    <HistoryCard
                      key={item.id}
                      title={item.title}
                      image={item.image}
                      slug={item.slug}
                      amount={item.amount}
                      date={item.created_at}
                    />
                  ))
                }
              </>
            )
            : (
              <div className='bg-red-500 text-white w-fit m-auto p-3 rounded-md'>
                <p>There&apos;s no donation found on current user</p>
              </div>
            )
          }
        </div>

        {
          history.total_page > 1 &&
          <Pagination
            totalPage={history.total_page}
            currentPage={page}
            setPage={setPage}
          />
        }
      </div>
      <Footer />
    </>
  )
}

export default History