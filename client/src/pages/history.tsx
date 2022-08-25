import HistoryCard from '../components/history/HistoryCard'
import Footer from './../components/general/Footer'
import Navbar from './../components/general/Navbar'

const History = () => {
  return (
    <>
      <Navbar />
      <div className='mb-20 mt-10'>
        <h1 className='m-auto w-fit text-center text-2xl font-medium relative after:content-* after:w-2/3 after:h-[3px] after:bg-orange-300 after:absolute after:-bottom-4 after:left-1/2 after:-translate-x-1/2'>Donation History</h1>
        <div className='grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-12 md:px-24 px-10 mt-20'>
          <HistoryCard
            title='Title Goes Here'
            image=''
            slug='title-goes-here'
            amount={20000}
            date='2022-02-08'
          />
          <HistoryCard
            title='Title Goes Here'
            image=''
            slug='title-goes-here'
            amount={20000}
            date='2022-02-08'
          />
          <HistoryCard
            title='Title Goes Here'
            image=''
            slug='title-goes-here'
            amount={20000}
            date='2022-02-08'
          />
          <HistoryCard
            title='Title Goes Here'
            image=''
            slug='title-goes-here'
            amount={20000}
            date='2022-02-08'
          />
          <HistoryCard
            title='Title Goes Here'
            image=''
            slug='title-goes-here'
            amount={20000}
            date='2022-02-08'
          />
          <HistoryCard
            title='Title Goes Here'
            image=''
            slug='title-goes-here'
            amount={20000}
            date='2022-02-08'
          />
        </div>
      </div>
      <Footer />
    </>
  )
}

export default History