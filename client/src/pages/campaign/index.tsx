import { useState } from 'react'
import { currencyFormatter } from './../../utils/helper'
import Footer from './../../components/general/Footer'
import Navbar from './../../components/general/Navbar'
import DeleteModal from '../../components/modal/DeleteModal'
import CreateCampaignModal from '../../components/modal/CreateCampaignModal'
import WithdrawModal from '../../components/modal/WithdrawModal'
import DonationModal from '../../components/modal/DonationModal'

const FundraiserCampaign = () => {
  const [openCreateModal, setOpenCreateModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [openWithdrawModal, setOpenWithdrawModal] = useState(false)
  const [openDonationModal, setOpenDonationModal] = useState(false)

  return (
    <>
      <Navbar />
      <div className='mt-10 mb-20 md:px-24 px-10'>
        <h1 className='m-auto w-fit text-center text-2xl font-medium relative after:content-* after:w-2/3 after:h-[3px] after:bg-orange-300 after:absolute after:-bottom-4 after:left-1/2 after:-translate-x-1/2'>Campaigns</h1>
        <button onClick={() => setOpenCreateModal(true)} className='bg-orange-400 text-white text-sm rounded-md w-36 h-10 hover:bg-orange-500 transition-[background] mt-14 float-right'>Add Campaign</button>
        <div className='clear-both' />
        <div className='w-full overflow-x-auto mt-10'>
          <table className='w-full'>
            <thead>
              <tr className='bg-orange-400 text-center font-semibold text-white'>
                <td className='p-3'>No</td>
                <td>Title</td>
                <td>Type</td>
                <td>Collected Amount</td>
                <td>Target Amount</td>
                <td>Withdrawn Amount</td>
                <td>Created At</td>
                <td>Action</td>
              </tr>
            </thead>
            <tbody>
              <tr className='text-center bg-slate-50'>
                <td className='p-3'>1</td>
                <td>Title Goes Here</td>
                <td>Children</td>
                <td>{currencyFormatter(200000000)},00</td>
                <td>{currencyFormatter(100000000)},00</td>
                <td>{currencyFormatter(0)},00</td>
                <td>2022-03-10</td>
                <td>
                  <button onClick={() => setOpenDonationModal(true)} className='bg-blue-500 text-white text-sm rounded-md p-2 mr-3 hover:bg-blue-600 transition-[background]'>Donation</button>
                  <button onClick={() => setOpenWithdrawModal(true)} className='bg-green-500 text-white text-sm rounded-md p-2 mr-3 hover:bg-green-600 transition-[background]'>Withdraw</button>
                  <button className='bg-yellow-500 text-white text-sm rounded-md p-2 mr-3 hover:bg-yellow-600 transition-[background]'>update</button>
                  <button onClick={() => setOpenDeleteModal(true)} className='bg-red-500 text-white text-sm rounded-md p-2 hover:bg-red-600 transition-[background]'>delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <Footer />

      <CreateCampaignModal
        openModal={openCreateModal}
        setOpenModal={setOpenCreateModal}
      />

      <DeleteModal
        openModal={openDeleteModal}
        setOpenModal={setOpenDeleteModal}
      />

      <WithdrawModal
        openModal={openWithdrawModal}
        setOpenModal={setOpenWithdrawModal}
      />

      <DonationModal
        openModal={openDonationModal}
        setOpenModal={setOpenDonationModal}
      />
    </>
  )
}

export default FundraiserCampaign