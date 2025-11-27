"use client"
import React from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import { useSelector } from 'react-redux';
import { useEmployeeStatusListener } from '../../basecomponents/useEmployeeStatusListener';

const Employeelayout = ({ children }) => {

  const { user } = useSelector((state) => state.User);

  useEmployeeStatusListener(user?.employeeId);

  return (
    <>
      <section className='w-full h-full bg-[#F6F6F6] px-3 sm:px-5 pb-4'>
        <Header />
        <div className='flex'>
          <Sidebar />
          <div className='flex-1 overflow-y-auto lg:ml-[20%] mt-28 2xl:mt-32 lg:w-[78%]  rounded-xl '>
            {children}
          </div>
        </div>
      </section>
    </>
  )
}

export default Employeelayout