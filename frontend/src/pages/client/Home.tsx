

import { JobContents } from '../../components'
import { Search } from '../../components/client/Search'
import { MainLayout } from '../../layouts'


const Home = () => {

    const dummyData = [
      {
        _id: "1",
        jobTitle: "Software Engineer",
        isSalaryRange: true,
        minSalary: "24000",
        maxSalary: "27000",
        employmentType: "Full Time",
        shift: "8 Hours Shift",
        skills: ['React', 'Node', 'TypeScript', ]
      },
      {
        _id: "2",
        jobTitle: "Software Engineer",
        isSalaryRange: true,
        minSalary: "24000",
        maxSalary: "27000",
        employmentType: "Full Time",
        shift: "8 Hours Shift",
        skills: ['React', 'Node', 'TypeScript']
      },
      {
        _id: "3",
        jobTitle: "Software Engineer",
        isSalaryRange: true,
        minSalary: "24000",
        maxSalary: "27000",
        employmentType: "Full Time",
        shift: "8 Hours Shift",
        skills: ['React', 'Node', 'TypeScript']
      },
    ]

  return (
    <MainLayout>
        <Search onClick={() => {}} onChangeText={() => {}}/>
        <JobContents data={dummyData as any}/>
    </MainLayout>
  )
}

export default Home
