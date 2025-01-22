

import { FilterJob, JobFeed, Search } from '../../components'

import { MainLayout } from '../../layouts'


const Home = () => {

  return (
    <MainLayout>
        <div className='flex flex-row items-center'>
          <Search onClick={() => {}} onChangeText={() => {}}/>
          <FilterJob/>
        </div>
        <JobFeed/>
    </MainLayout>
  )
}

export default Home
