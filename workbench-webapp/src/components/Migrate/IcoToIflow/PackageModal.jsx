/* eslint-disable react/prop-types */

import { TextField } from "@mui/material";
import { handleCreatePackage } from "../../../apis/apiService";
import { useState } from "react";

const PackageModal = ({ setPackageModal }) => {
    const [newPackage, setnewPackage]=useState({})

    const handleChange = (e, name) => {
        setnewPackage((prevState) => ({ ...prevState, [name]: e.target.value }));
      };

      const handlePackageSubmit = () => {
        const agentStorage = localStorage.getItem("currAgent");
      
        // Parse the JSON string to an object
        const agentData = agentStorage ? JSON.parse(agentStorage).cpiData : {};
      
        const payload = {
          packageDetails: newPackage,
          agent: agentData
        };
      
        handleCreatePackage(payload);
    }
    
  return (
    <>
      <div className="fixed inset-0 z-[1000] bg-black opacity-50"></div>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[1000] outline-none focus:outline-none">
        <div className="relative w-2/3 my-6 mx-auto max-w-6xl">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
              <h3 className="text-xl font-semibold">Create package</h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() => setPackageModal(false)}
              ></button>
            </div>
            {/*body*/}
            <div className="relative p-6 flex-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="mb-2">Name</span>
                  <TextField
                    size="small"
                    placeholder="Enter Name"
                    variant="outlined"
                    value={newPackage?.name || ""}
                    onChange={(e) => handleChange(e, "name")}
                    sx={{
                      "& .MuiInputBase-input": {
                        height: "1.4em",
                        padding: "6px 12px",
                      },
                    }}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="mb-2">Short Text</span>
                  <TextField
                    size="small"
                    placeholder="Enter Short text"
                    variant="outlined"
                    // value={newPackage?.description || ""}
                    // onChange={(e) => handleChange(e, "description")}
                    sx={{
                      "& .MuiInputBase-input": {
                        height: "1.4em",
                        padding: "6px 12px",
                      },
                    }}
                  />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex flex-col">
                <span className="mb-2">Description</span>
                  <TextField
                    size="small"
                    placeholder="Enter Description"
                    variant="outlined"
                    multiline
                    minRows="5"
                    value={newPackage?.description || ""}
                    onChange={(e) => handleChange(e, "description")}
                    sx={{
                      "& .MuiInputBase-input": {
                        height: "1.4em",
                        // padding: "6px 12px",
                      },
                    }}
                  />
                </div>
              </div>
            </div>
            {/*footer*/}
            <div className="flex items-center justify-end p-2 border-t border-solid border-blueGray-200 rounded-b">
              <button
                className="text-[#0A6ED1] px-4 py-2 text-sm   mr-1 mb-1 rounded  hover:bg-[#0A6ED1] hover:text-white ease-linear transition-all duration-150"
                type="button"
                onClick={() => setPackageModal(false)}
              >
                Close
              </button>
              <button
                className="bg-[#0A6ED1] text-white text-sm mr-1 mb-1 px-4 py-2 rounded border hover:border-[#0A6ED1]  hover:bg-white hover:text-[#0A6ED1]  ease-linear transition-all duration-150"
                type="button"
                onClick={handlePackageSubmit}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PackageModal;
