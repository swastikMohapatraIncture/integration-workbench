import React from 'react'
import {Link} from "react-router-dom"

const MigrateSA= () => {
  return (
    <>
    <div>
    <div className="bg-[#EBf5FF] p-5 rounded">
        <h3 className="text-xl font-bold mb-4 text-[#2A4862]">
          Integration Workbench
        </h3>
        <p className="text-[#32363A]">
          Integration Workbench facilitates the seamless migration of
          integrations from SAP NEO Data Centers to SAP Integration Suite (Cloud
          Foundry) through an interactive user interface. This migration tool is
          crafted to drastically reduce manual migration efforts and eliminate
          the possibility of human error in the process.
        </p>
        <div className="flex justify-end mt-4">
          <Link to="/readinesscheck">
          <button
            className="bg-[#0A6ED1] text-white rounded p-2 px-6 hover:bg-gray-300 hover:text-black transition duration-200"
          >
            Start System Readiness Check
          </button>
          </Link>
        </div>
      </div>
    </div>
    </>
  )
}

export default MigrateSA