import React from 'react'

const ReadinessCheckMainPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
    <div className="flex-grow">
    <table className="table-auto w-full text-[#32363A]">
      <thead className="bg-gray-50">
        <tr>
          <th className="border border-gray-200 px-2 py-2 text-center w-[25%]">Items</th>
          <th className="border border-gray-200 px-2 py-2 w-[40%] text-left">Package Name</th>
          <th className="border border-gray-200 px-2 py-2 w-[15%] text-left">Total IFlows</th>
          <th className="border border-gray-200 px-2 py-2 text-left w-[10%]">Pass</th>
          <th className="border border-gray-200 px-2 py-2 text-left w-[10%]">Fail</th>
        </tr>
      </thead>
      <tbody className="max-h-40 overflow-y-auto">
        {/* Table rows go here */}
      </tbody>
    </table>
  </div>
  <div className="flex justify-center items-end py-4">
    <button className="bg-[#0A6ED1] text-white rounded p-2 px-6 hover:bg-gray-300 hover:text-black transition duration-200">
      Let's Migrate
    </button>
  </div>
</div>

  )
}

export default ReadinessCheckMainPage