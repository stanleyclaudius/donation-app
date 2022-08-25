import { useState } from 'react'
import { GiReceiveMoney } from 'react-icons/gi'
import { FaUserShield } from 'react-icons/fa'
import { currencyFormatter } from './../../utils/helper'
import Footer from './../../components/general/Footer'
import Navbar from './../../components/general/Navbar'
import DonateModal from '../../components/modal/DonateModal'
import DonationHistoryCard from '../../components/campaign_detail/DonationHistoryCard'

const CampaignDetail = () => {
  const [openDonateModal, setOpenDonateModal] = useState(false)

  return (
    <>
      <Navbar />
      <div className='mb-20'>
        <div className='w-full h-[200px] bg-gray-200' />
        <div className='lg:mx-32 mx-6 shadow-xl -mt-16 bg-white mb-24 lg:p-9 p-5 flex lg:flex-row flex-col-reverse lg:gap-8 gap-12'>
          <div className='flex-[2]'>
            <h1 className='text-2xl font-medium'>Title Goes Here</h1>
            <div className='w-full h-2 mt-5 rounded-full bg-gray-100'>
              <div className='h-2 bg-blue-400 rounded-md' style={{ width: `${20}%` }} />
            </div>
            <p className='text-sm text-gray-500 leading-relaxed mt-5'>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis corrupti facere doloribus vitae fugit, vel ipsa id placeat quas odit voluptatibus asperiores nostrum doloremque ratione voluptas ducimus, est architecto ex. Voluptates autem perferendis laborum, veritatis quisquam voluptate nostrum velit, at molestiae, quos ut! Qui, est culpa unde voluptates impedit accusantium.
            </p>
            <h2 className='text-xl font-medium mt-9 mb-5'>Latest Donations</h2>
            <hr />
            <div className='mt-7'>
              <DonationHistoryCard
                avatar=''
                name='Anonymous'
                amount={200000}
                prayer='Halo'
                date='2022-02-20'
              />
              <DonationHistoryCard
                avatar=''
                name='Anonymous'
                amount={200000}
                prayer='Halo'
                date='2022-02-20'
              />
              <DonationHistoryCard
                avatar=''
                name='Anonymous'
                amount={200000}
                prayer='Halo'
                date='2022-02-20'
              />
              <DonationHistoryCard
                avatar=''
                name='Anonymous'
                amount={200000}
                prayer='Halo'
                date='2022-02-20'
              />
            </div>
          </div>
          <div className='flex-1'>
            <div className='border border-gray-300 p-3'>
              <div className='flex items-center gap-3 text-blue-500 font-medium'>
                <GiReceiveMoney className='text-xl' />
                <p>Total Collected Amount</p>
              </div>
              <div className='flex lg:flex-row flex-col lg:items-center gap-2 mt-5'>
                <p className='text-xl font-medium'>{currencyFormatter(500000)},00</p>
                <p className='lg:block hidden'>/</p>
                <p className='lg:hidden block'>from</p>
                <p>{currencyFormatter(10000000)},00</p>
              </div>
            </div>
            <div className='border border-gray-300 p-3 mt-8'>
              <div className='flex items-center gap-3 text-blue-500 font-medium'>
                <FaUserShield className='text-xl' />
                <p>Fundraiser</p>
              </div>
              <div className='mt-3'>
                <h1 className='font-medium'>Fundraiser 1</h1>
                <p className='mt-2 text-sm'>0812 9283 9333</p>
                <p className='mt-2 text-sm'>Fundraiser 1 Address</p>
                <p className='text-gray-500 text-sm mt-3 leading-relaxed'>
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tenetur, omnis.
                </p>
              </div>
            </div>
            <div>
              <button onClick={() => setOpenDonateModal(true)} className='bg-orange-400 text-white w-full rounded-full h-10 mt-8 transition-all hover:bg-orange-500'>Donate Now</button>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      <DonateModal
        openModal={openDonateModal}
        setOpenModal={setOpenDonateModal}
      />
    </>
  )
}

export default CampaignDetail