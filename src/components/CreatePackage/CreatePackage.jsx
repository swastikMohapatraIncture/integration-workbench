import { useState } from "react";
import { toast } from "react-toastify";
import { handleCreatePackage } from "../../apis/apiService";

const CreatePackage = ({ isOpen, onClose, setIsLoading, onPackageCreated }) => {
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
    const { name, description } = packageDetails;

    if (!name.trim() || !description.trim()) {
      toast.error("Please fill out both the name and description.");
      return;
    }

    try {
      setIsLoading(true);
      const localData = localStorage.getItem("currAgent");
      if (!localData) {
        throw new Error("No agent data found.");
      }
      const data = JSON.parse(localData);
      const apiData = data.apiData;

      if (apiData) {
        let payload = {
          packageDetails: packageDetails,
          agent: apiData,
        };
        const response = await handleCreatePackage(payload);
        if (response.status === "Success") {
          toast.success("Package added, select from the list.");
          setPackageDetails({
            name: "",
            description: "",
          });
          onPackageCreated();
        } else {
          throw new Error("Failed to create package.");
        }
      } else {
        throw new Error("Invalid agent data.");
      }
    } catch (error) {
      toast.error(error.message);
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
            Name<span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={packageDetails.name}
            onChange={handleChange}
            placeholder="Enter Name"
            className="w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
        <div className="mb-4 px-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description<span className="text-red-600">*</span>
          </label>
          <textarea
            name="description"
            value={packageDetails.description}
            onChange={handleChange}
            placeholder="Enter Description"
            className="w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
