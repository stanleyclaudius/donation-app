import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { GiReceiveMoney } from 'react-icons/gi'
import { FaUserShield } from 'react-icons/fa'
import { currencyFormatter, dateFormatter } from './../../utils/helper'
import { AppDispatch, RootState } from './../../redux/store'
import { getCampaignDetail } from './../../redux/slice/campaignDetailSlice'
import Footer from './../../components/general/Footer'
import Navbar from './../../components/general/Navbar'
import DonateModal from './../../components/modal/DonateModal'
import DonationHistoryCard from './../../components/campaign_detail/DonationHistoryCard'

const CampaignDetail = () => {
  const { id } = useParams()

  const dispatch = useDispatch<AppDispatch>()
  const { auth, campaign_detail } = useSelector((state: RootState) => state)

  const [openDonateModal, setOpenDonateModal] = useState(false)

  useEffect(() => {
    dispatch(getCampaignDetail(id as string))
  }, [dispatch, id])

  return (
    <>
      <Navbar />
      <div className='mb-20'>
        {
          campaign_detail.data
          ? (
            <>
              <div className='w-full h-[200px] bg-gray-200 bg-cover bg-center' style={{ backgroundImage: `url(${campaign_detail.data.image})` }} />
              <div className='lg:mx-32 mx-6 shadow-xl -mt-16 bg-white mb-24 lg:p-9 p-5 flex lg:flex-row flex-col-reverse lg:gap-8 gap-12'>
                <div className='flex-[2]'>
                  <h1 className='text-2xl font-medium'>{campaign_detail.data?.title}</h1>
                  {
                    campaign_detail.data &&
                    <div className='w-full h-2 mt-5 rounded-full bg-gray-100'>
                      <div className='h-2 bg-blue-400 rounded-md' style={{ width: `${campaign_detail.data?.collected_amount / campaign_detail.data?.target_amount * 100 > 100 ? 100 : campaign_detail.data?.collected_amount / campaign_detail.data?.target_amount * 100}%` }} />
                    </div>
                  }
                  <p className='text-sm text-gray-500 leading-relaxed mt-5'>
                    {campaign_detail.data?.description}
                  </p>
                  <h2 className='text-xl font-medium mt-9 mb-5'>Latest Donations</h2>
                  <hr />
                  <div className='mt-7'>
                    {
                      campaign_detail.donations.length > 0
                      ? (
                        <>
                          {
                            campaign_detail.donations.map(item => (
                              <DonationHistoryCard
                                key={item.id}
                                avatar={item.avatar}
                                name={item.is_anonymous ? 'Anonymous' : item.name}
                                amount={item.amount}
                                prayer={item.words}
                                date={dateFormatter(item.created_at)}
                              />
                            ))
                          }
                        </>
                      )
                      : (
                        <div className='bg-red-500 text-white p-3 rounded-md text-center text-sm'>
                          <p>There&apos;s no donation yet for this campaign.</p>
                        </div>
                      )
                    }
                  </div>
                  <h2 className='text-xl font-medium mt-16 mb-5'>Latest Withdrawn</h2>
                  <hr />
                </div>
                <div className='flex-1'>
                  <div className='border border-gray-300 p-3'>
                    <div className='flex items-center gap-3 text-blue-500 font-medium'>
                      <GiReceiveMoney className='text-xl' />
                      <p>Total Collected Amount</p>
                    </div>
                    <div className='flex lg:flex-row flex-col lg:items-center gap-2 mt-5'>
                      <p className='text-xl font-medium'>{currencyFormatter(campaign_detail.data?.collected_amount || 0)},00</p>
                      <p className='lg:block hidden'>/</p>
                      <p className='lg:hidden block'>from</p>
                      <p>{currencyFormatter(campaign_detail.data?.target_amount || 0)},00</p>
                    </div>
                  </div>
                  <div className='border border-gray-300 p-3 mt-8'>
                    <div className='flex items-center gap-3 text-blue-500 font-medium'>
                      <FaUserShield className='text-xl' />
                      <p>Fundraiser</p>
                    </div>
                    <div className='mt-3'>
                      <h1 className='font-medium'>{campaign_detail.data?.fundraiser_name}</h1>
                      <p className='mt-2 text-sm'>{campaign_detail.data?.fundraiser_phone}</p>
                      <p className='mt-2 text-sm'>{campaign_detail.data?.fundraiser_address}</p>
                      <p className='text-gray-500 text-sm mt-3 leading-relaxed'>
                        {campaign_detail.data?.description}
                      </p>
                    </div>
                  </div>
                  {
                    auth.access_token &&
                    <div>
                      <button onClick={() => setOpenDonateModal(true)} className='bg-orange-400 text-white w-full outline-0 rounded-full h-10 mt-8 transition-all hover:bg-orange-500'>Donate Now</button>
                    </div>
                  }
                </div>
              </div>
            </>
          )
          : (
            <div className='bg-red-500 text-white w-fit m-auto p-5 rounded-md mt-16'>
              <p>Campaign with slug {id} not found.</p>
            </div>
          )
        }
      </div>
      <Footer />

      <DonateModal
        openModal={openDonateModal}
        setOpenModal={setOpenDonateModal}
        campaignId={campaign_detail.data?.id as number}
      />
    </>
  )
}

export default CampaignDetail