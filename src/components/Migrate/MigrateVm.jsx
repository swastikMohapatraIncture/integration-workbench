import { useState } from "react";
import Package from "./Package";
import VMOptions from "./ValueMapping/VMOptions";
import PackageModal from "./PackageModal";
// import VMPackage from "./ValueMapping/VMPackage";

const MigrateVm = () => {
  const [selectedValue, setSelectedValue] = useState();
  // const [icoDetails, setIcoDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [packageModal, setpackageModal]=useState(false)

  const handleDropDownChange = (value) => {
    setSelectedValue(value.id);
    console.log("MI", selectedValue);
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-6 mt-6 mx-6">
        <div>
          <VMOptions />
        </div>
        <div>
          
          <Package onSelect={handleDropDownChange} setLoading={setIsLoading} />

          {/* <VMPackage /> */}
        </div>
      </div>
      <div className="px-3 text-[#0A6ED1] flex justify-end text-sm mt-3">
        {/* <button className="pr-2">
          Add Alert Notification
        </button> */}
        <button className="pl-2" onClick={()=>setpackageModal(!packageModal)}>
          Create New Package
        </button>
      </div>
      {packageModal && <PackageModal setPackageModal={setpackageModal}/>}
    </>
  );
};

export default MigrateVm;
