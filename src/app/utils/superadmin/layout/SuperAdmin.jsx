import React from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
const SuperAdminlayout = ({ children }) => {
  return (
    <>
      <section className='w-full h-full bg-[#F6F6F6] px-5 pb-4'>
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
export default SuperAdminlayout