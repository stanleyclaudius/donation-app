import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Pagination from '../components/general/Pagination'
import FundraiserDetailModal from '../components/modal/FundraiserDetailModal'
import { acceptFundraiser, getFundraiser, rejectFundraiser } from '../redux/slice/fundraiserVerificationSlice'
import { AppDispatch, RootState } from '../redux/store'
import { dateFormatter } from '../utils/helper'
import { IFundraiser } from '../utils/Interface'
import Footer from './../components/general/Footer'
import Navbar from './../components/general/Navbar'

const Fundraiser = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { auth, fundraiser_verification } = useSelector((state: RootState) => state)

  const [page, setPage] = useState(1)
  const [selectedItem, setSelectedItem] = useState<IFundraiser>()
  const [openDetailModal, setOpenDetailModal] = useState(false)

  const handleClickDetail = (item: IFundraiser) => {
    setSelectedItem(item)
    setOpenDetailModal(true)
  }

  useEffect(() => {
    dispatch(getFundraiser({ access_token: auth.access_token!, page }))
  }, [dispatch, auth.access_token, page])

  return (
    <>
      <Navbar />
      <div className='mt-10 mb-20 md:px-24 px-10'>
        <h1 className='m-auto w-fit text-center text-2xl font-medium relative after:content-* after:w-2/3 after:h-[3px] after:bg-orange-300 after:absolute after:-bottom-4 after:left-1/2 after:-translate-x-1/2'>Fundraisers Verification</h1>
        <div className='w-full overflow-x-auto mt-16'>
          <table className='w-full'>
            <thead>
              <tr className='bg-orange-400 text-center font-semibold text-white'>
                <td className='p-3'>No</td>
                <td>Name</td>
                <td>Email</td>
                <td>Phone</td>
                <td>Registered At</td>
                <td>Action</td>
              </tr>
            </thead>
            <tbody>
              {
                fundraiser_verification.data.map((item, i) => (
                  <tr key={item.id} className='text-center bg-slate-50'>
                    <td className='p-3'>{i + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.email}</td>
                    <td>{item.phone}</td>
                    <td>{dateFormatter(item.created_at)}</td>
                    <td>
                      <button onClick={() => handleClickDetail(item)} className='bg-blue-500 text-white text-sm rounded-md p-2 mr-3 hover:bg-blue-600 transition-[background]'>Detail</button>
                      <button onClick={() => dispatch(acceptFundraiser({ access_token: auth.access_token!, id: item.id }))} className='bg-green-500 text-white text-sm rounded-md p-2 mr-3 hover:bg-green-600 transition-[background]'>Accept</button>
                      <button onClick={() => dispatch(rejectFundraiser({ access_token: auth.access_token!, id: item.id }))} className='bg-red-500 text-white text-sm rounded-md p-2 hover:bg-red-600 transition-[background]'>Reject</button>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>

        {
          fundraiser_verification.total_page > 1 &&
          <Pagination
            totalPage={fundraiser_verification.total_page}
            currentPage={page}
            setPage={setPage}
          />
        }
      </div>
      <Footer />

      <FundraiserDetailModal
        openModal={openDetailModal}
        setOpenModal={setOpenDetailModal}
        selectedItem={selectedItem as IFundraiser}
      />
    </>
  )
}

export default Fundraiser