import { useState } from 'react'
import FundraiserDetailModal from '../components/modal/FundraiserDetailModal'
import Footer from './../components/general/Footer'
import Navbar from './../components/general/Navbar'

const Fundraiser = () => {
  const [openDetailModal, setOpenDetailModal] = useState(false)

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
              <tr className='text-center bg-slate-50'>
                <td className='p-3'>1</td>
                <td>Fundraiser 1</td>
                <td>fundraiser1@gmail.com</td>
                <td>02829292</td>
                <td>2022-03-10</td>
                <td>
                  <button onClick={() => setOpenDetailModal(true)} className='bg-blue-500 text-white text-sm rounded-md p-2 mr-3 hover:bg-blue-600 transition-[background]'>detail</button>
                  <button className='bg-green-600 text-white text-sm rounded-md p-2 mr-3 hover:bg-green-700 transition-[background]'>accept</button>
                  <button className='bg-red-500 text-white text-sm rounded-md p-2 hover:bg-red-600 transition-[background]'>reject</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <Footer />

      <FundraiserDetailModal
        openModal={openDetailModal}
        setOpenModal={setOpenDetailModal}
      />
    </>
  )
}

export default Fundraiser