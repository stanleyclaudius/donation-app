import Footer from './../components/general/Footer'
import HowWeWork from './../components/home/HowWeWork'
import LatestCampaigns from './../components/home/LatestCampaigns'
import Navbar from './../components/general/Navbar'
import Jumbotron from './../components/home/Jumbotron'
import Head from './../utils/Head'

const Home = () => {
  return (
    <>
      <Head title='Home' />
      <Navbar />
      <Jumbotron />
      <LatestCampaigns />
      <HowWeWork />
      <Footer />
    </>
  )
}

export default Home