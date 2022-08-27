import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { currencyFormatter, dateFormatter } from './../../utils/helper'
import { AppDispatch, RootState } from './../../redux/store'
import { deleteCampaign, getFundraiserCampaigns } from './../../redux/slice/fundraiserCampaignSlice'
import { ICampaign } from './../../utils/Interface'
import Footer from './../../components/general/Footer'
import Navbar from './../../components/general/Navbar'
import DeleteModal from './../../components/modal/DeleteModal'
import CreateCampaignModal from './../../components/modal/CreateCampaignModal'
import DonationModal from './../../components/modal/DonationModal'
import WithdrawModal from './../../components/modal/WithdrawModal'
import Pagination from './../../components/general/Pagination'

const FundraiserCampaign = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { auth, fundraiser_campaign } = useSelector((state: RootState) => state)

  const [page, setPage] = useState(1)
  const [selectedItem, setSelectedItem] = useState<ICampaign>()
  const [openCreateModal, setOpenCreateModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [openWithdrawModal, setOpenWithdrawModal] = useState(false)
  const [openDonationModal, setOpenDonationModal] = useState(false)
  
  const handleClickCreate = () => {
    setSelectedItem(undefined)
    setOpenCreateModal(true)
  }

  const handleClickUpdate = (item: ICampaign) => {
    setSelectedItem(item)
    setOpenCreateModal(true)
  }

  const handleClickDelete = (item: ICampaign) => {
    setSelectedItem(item)
    setOpenDeleteModal(true)
  }

  const handleDeleteCampaign = () => {
    dispatch(deleteCampaign({ id: selectedItem?.id!, access_token: auth.access_token! }))
    setOpenDeleteModal(false)
  }


  const handleClickWithdraw = (item: ICampaign) => {
    setSelectedItem(item)
    setOpenWithdrawModal(true)
  }

  const handleClickDonation = (item: ICampaign) => {
    setSelectedItem(item)
    setOpenDonationModal(true)
  }

  useEffect(() => {
    if (auth.access_token) {
      dispatch(getFundraiserCampaigns({ access_token: auth.access_token, page }))
    }
  }, [dispatch, auth.access_token, page])

  useEffect(() => {
    if (!auth.access_token || (auth.access_token && auth.user?.role !== 'fundraiser')) {
      navigate('/')
    }
  }, [auth, navigate])

  return (
    <>
      <Navbar />
      <div className='mt-10 mb-20 md:px-24 px-10'>
        <h1 className='m-auto w-fit text-center text-2xl font-medium relative after:content-* after:w-2/3 after:h-[3px] after:bg-orange-300 after:absolute after:-bottom-4 after:left-1/2 after:-translate-x-1/2'>Campaigns</h1>
        <button onClick={() => handleClickCreate()} className='bg-orange-400 text-white text-sm rounded-md w-36 h-10 hover:bg-orange-500 transition-[background] mt-14 float-right'>Add Campaign</button>
        <div className='clear-both' />
        {
          fundraiser_campaign.data.length > 0
          ? (
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
                  {
                    fundraiser_campaign.data.map((item, i) => (
                      <tr key={item.id} className='text-center bg-slate-50'>
                        <td className='p-3'>{i + 1}</td>
                        <td>{item.title}</td>
                        <td>{item.type}</td>
                        <td>{currencyFormatter(item.collected_amount)},00</td>
                        <td>{currencyFormatter(item.target_amount)},00</td>
                        <td>{currencyFormatter(item.withdrawn_amount)},00</td>
                        <td>{dateFormatter(item.created_at)}</td>
                        <td>
                          <button onClick={() => handleClickDonation(item)} className='bg-blue-500 text-white text-sm rounded-md p-2 mr-3 hover:bg-blue-600 transition-[background]'>Donation</button>
                          <button onClick={() => handleClickWithdraw(item)} className='bg-green-500 text-white text-sm rounded-md p-2 mr-3 hover:bg-green-600 transition-[background]'>Withdraw</button>
                          <button onClick={() => handleClickUpdate(item)} className='bg-yellow-500 text-white text-sm rounded-md p-2 mr-3 hover:bg-yellow-600 transition-[background]'>Update</button>
                          <button onClick={() => handleClickDelete(item)} className='bg-red-500 text-white text-sm rounded-md p-2 hover:bg-red-600 transition-[background]'>Delete</button>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          )
          : (
            <div className='bg-red-500 text-white w-fit m-auto mt-16 p-5 rounded-md'>
              <p>There&apos;s currently no campaign type data found.</p>
            </div>
          )
        }

        {
          fundraiser_campaign.total_page > 1 &&
          <Pagination
            totalPage={fundraiser_campaign.total_page}
            currentPage={page}
            setPage={setPage}
          />
        }
      </div>
      <Footer />

      <CreateCampaignModal
        openModal={openCreateModal}
        setOpenModal={setOpenCreateModal}
        selectedItem={selectedItem as ICampaign}
      />

      <DeleteModal
        openModal={openDeleteModal}
        setOpenModal={setOpenDeleteModal}
        onSuccess={handleDeleteCampaign}
      />

      <WithdrawModal
        openModal={openWithdrawModal}
        setOpenModal={setOpenWithdrawModal}
        selectedItem={selectedItem as ICampaign}
      />

      <DonationModal
        openModal={openDonationModal}
        setOpenModal={setOpenDonationModal}
        selectedItem={selectedItem as ICampaign}
      />
    </>
  )
}

export default FundraiserCampaign