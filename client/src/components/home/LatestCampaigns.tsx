import CampaignCard from "../general/CampaignCard"

const LatestCampaigns = () => {
  return (
    <div className='mt-20 md:px-24 px-10'>
      <h1 className='m-auto w-fit text-center text-2xl font-medium relative after:content-* after:w-2/3 after:h-[3px] after:bg-orange-300 after:absolute after:-bottom-4 after:left-1/2 after:-translate-x-1/2'>Latest Campaigns</h1>
      <div className='mt-20 grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-12'>
        <CampaignCard
          title='Title Goes Here'
          description='Lorem ipsum dolor sit, amet consectetur adipisicing elit. Possimus, sequi? Distinctio asperiores blanditiis nemo saepe ut iure odit facere a.'
          image=''
          progress={60}
          slug='title-goes-here'
        />
        <CampaignCard
          title='Title Goes Here'
          description='Lorem ipsum dolor sit, amet consectetur adipisicing elit. Possimus, sequi? Distinctio asperiores blanditiis nemo saepe ut iure odit facere a.'
          image=''
          progress={80}
          slug='title-goes-here'
        />
        <CampaignCard
          title='Title Goes Here'
          description='Lorem ipsum dolor sit, amet consectetur adipisicing elit. Possimus, sequi? Distinctio asperiores blanditiis nemo saepe ut iure odit facere a.'
          image=''
          progress={25}
          slug='title-goes-here'
        />
      </div>
    </div>
  )
}

export default LatestCampaigns