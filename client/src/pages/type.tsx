import { useState } from 'react'
import CreateTypeModal from '../components/modal/CreateTypeModal'
import DeleteModal from '../components/modal/DeleteModal'
import Footer from './../components/general/Footer'
import Navbar from './../components/general/Navbar'

const CampaignType = () => {
  const [openCreateTypeModal, setOpenCreateTypeModal] = useState(false)
  const [openDeleteTypeModal, setOpenDeleteTypeModal] = useState(false)

  return (
    <>
      <Navbar />
      <div className='mt-10 mb-20 md:px-24 px-10'>
        <h1 className='m-auto w-fit text-center text-2xl font-medium relative after:content-* after:w-2/3 after:h-[3px] after:bg-orange-300 after:absolute after:-bottom-4 after:left-1/2 after:-translate-x-1/2'>Campaign Types</h1>
        <button onClick={() => setOpenCreateTypeModal(true)} className='bg-orange-400 text-white text-sm rounded-md w-24 h-10 hover:bg-orange-500 transition-[background] mt-14 float-right'>Add Type</button>
        <div className='clear-both' />
        <div className='w-full overflow-x-auto mt-10'>
          <table className='w-full'>
            <thead>
              <tr className='bg-orange-400 text-center font-semibold text-white'>
                <td className='p-3'>No</td>
                <td>Type</td>
                <td>Created At</td>
                <td>Action</td>
              </tr>
            </thead>
            <tbody>
              <tr className='text-center bg-slate-50'>
                <td className='p-3'>1</td>
                <td>Children</td>
                <td>2022-03-10</td>
                <td>
                  <button className='bg-yellow-500 text-white text-sm rounded-md p-2 mr-3 hover:bg-yellow-600 transition-[background]'>update</button>
                  <button onClick={() => setOpenDeleteTypeModal(true)} className='bg-red-500 text-white text-sm rounded-md p-2 hover:bg-red-600 transition-[background]'>delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <Footer />

      <CreateTypeModal
        openModal={openCreateTypeModal}
        setOpenModal={setOpenCreateTypeModal}
      />

      <DeleteModal
        openModal={openDeleteTypeModal}
        setOpenModal={setOpenDeleteTypeModal}
      />
    </>
  )
}

export default CampaignType