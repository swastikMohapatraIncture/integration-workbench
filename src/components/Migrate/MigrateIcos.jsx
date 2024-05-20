import Package from "./Package"
import Ico from './Ico'
import { useState } from "react"

const MigrateIcos = () => {
  const [selectedValue, setSelectedValue] = useState();

  const handleDropDownChange = (value) => {
    setSelectedValue(value)
  }
  return (
    <>
    <div className="flex justify-between gap-5 p-3">
      <Ico />
      <Package onSelect={handleDropDownChange}/>
    </div>
    <div className="px-3 text-[#0A6ED1] flex justify-end text-sm">
      <button className="pr-2">
        Add Alert Notification
      </button>
      <button className="border-l border-[#0A6ED1] pl-2">
        Create New Package
      </button>
    </div>
    </>
  )
}

export default MigrateIcos;

