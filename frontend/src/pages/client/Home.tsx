

import { useDispatch } from 'react-redux'
import { FilterJob, JobFeed, Search } from '../../components'

import { MainLayout } from '../../layouts'
import { searchJob } from '../../redux/slice/jobSlice';
import { useState } from 'react';


const Home = () => {

  const dispatch = useDispatch();
  const [input, setInput] = useState<string>("");
  const handleSearch = () => {
    dispatch(searchJob(input));
  }

  const handleChangeText = (text: string) => {
    if(text === "") {
        //IF TEXT IS EMPTY STRING RESET THE FEED DATA
      dispatch(searchJob(text));
    }
    setInput(text);
  }

  return (
    <MainLayout>
        <div className='flex flex-row items-center'>
          <Search placeholder={"Search Position"} onClick={() => handleSearch()} onChangeText={(text) => handleChangeText(text)}/>
          <FilterJob/>
        </div>
        <JobFeed/>
    </MainLayout>
  )
}

export default Home
