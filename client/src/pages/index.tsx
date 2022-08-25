import Footer from '../components/general/Footer'
import HowWeWork from '../components/home/HowWeWork'
import LatestCampaigns from '../components/home/LatestCampaigns'
import Navbar from './../components/general/Navbar'
import Jumbotron from './../components/home/Jumbotron'

const Home = () => {
  return (
    <>
      <Navbar />
      <Jumbotron />
      <LatestCampaigns />
      <HowWeWork />
      <Footer />
    </>
  )
}

export default Home