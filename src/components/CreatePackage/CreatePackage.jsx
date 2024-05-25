import { useState } from "react";
import { handleCreatePackage } from "../../apis/apiService";

const CreatePackage = ({ isOpen, onClose, setIsLoading, onPackageCreated}) => {
  const [packageDetails, setPackageDetails] = useState({
    name: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPackageDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const localData = localStorage.getItem("currAgent");
      const data = JSON.parse(localData);
      const apiData = data.apiData;

      if (apiData) {
        let payload = {
          packageDetails: packageDetails,
          agent: apiData,
        };
        const response = await handleCreatePackage(payload);
        if (response.status === "Success") {
          setPackageDetails({
            name: "",
            description: "",
          });
          onPackageCreated();
        }
      }
    } catch (error) {
      console.log("Error Creating package.", error);
    } finally {
        
        setIsLoading(false);
        onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-[999]">
      <div className="bg-white rounded shadow-lg w-[50%]">
        <h2 className="text-lg mb-4 border-b border-full p-2 px-4">
          Create Package
        </h2>
        <div className="mb-4 px-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={packageDetails.name}
            onChange={handleChange}
            placeholder="Enter Name"
            className="w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 italic text-sm"
          />
        </div>
        <div className="mb-4 px-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={packageDetails.description}
            onChange={handleChange}
            placeholder="Enter Description"
            className="w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 italic text-sm"
          />
        </div>
        <div className="flex justify-end space-x-2 border-t p-2 px-4">
          <button
            onClick={onClose}
            className="border border-[#0A6ED1] text-[#0A6ED1] rounded-sm px-3 py-1 text-sm hover:text-white hover:bg-[#0A6ED1] transition duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-[#0A6ED1] rounded-sm px-4 transition duration-200 mr-3 text-white border border-[#0A6ED1] text-sm"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePackage;
