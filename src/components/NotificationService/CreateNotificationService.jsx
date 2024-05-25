import { useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Package from "../Migrate/Package";
import { toast } from "react-toastify";
import { handleExceptionServices } from "../../apis/apiService";

const CreateNotificationService = ({ setLoading, isOpen, onClose }) => {
  const [selectedValue, setSelectedValue] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [integrationNames, setIntegrationNames] = useState([]);
  const [showInputs, setShowInputs] = useState(false);
  const services = ["Mail", "Slack", "ServiceNow", "Teams"];

  const handleDropDownChange = (value) => setSelectedValue(value?.id);

  const handleServiceChange = (event, value) => {
    // Create a copy of the current integration names
    const currentIntegrationNames = [...integrationNames];

    // Resize the array to match the new selected services length
    const newIntegrationNames = value.map(
      (service, index) => currentIntegrationNames[index] || ""
    );

    setSelectedServices(value);
    setIntegrationNames(newIntegrationNames);
    setShowInputs(value.length > 0);
  };

  const handleIntegrationNameChange = (event, index) => {
    const newIntegrationNames = [...integrationNames];
    newIntegrationNames[index] = event.target.value;
    setIntegrationNames(newIntegrationNames);
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      if (
        !selectedValue ||
        selectedServices.length === 0 ||
        !integrationNames.every((name) => name.trim())
      ) {
        throw new Error(
          "Please select a package, at least one service, and provide integration names."
        );
      }

      const localData = localStorage.getItem("currAgent");
      if (!localData) {
        throw new Error("No agent data found.");
      }

      const data = JSON.parse(localData);
      const apiData = data.apiData;
      if (!apiData) {
        throw new Error("Invalid agent data.");
      }

      const integrationNamesArray = integrationNames.map((name) => name.trim());
      if (integrationNamesArray.length !== selectedServices.length) {
        throw new Error(
          "Please provide integration names for all selected services."
        );
      }

      const payload = {
        apiAgent: apiData,
        errorHandlingService: selectedServices.map((service, index) => ({
          serviceName: service,
          integrationName: integrationNamesArray[index],
          description: `This interface will trigger Error Notification for ${service}.`,
        })),
        packageId: selectedValue,
      };

      const response = await handleExceptionServices(payload);

      if (response) {
        toast.success("Services added successfully.");
        setShowInputs(false);
        setSelectedValue(null);
        setSelectedServices([]);
        setIntegrationNames([]);
        onClose();
      } else {
        throw new Error("Failed to create exception adapter.");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-[999]">
      <div className="bg-white rounded shadow-lg w-[50%] max-h-[70vh] overflow-y-auto">
        <h2 className="text-lg mb-4 border-b border-full p-2 px-4">
          Alert Notifications
        </h2>

        <div className="flex mb-4 px-4">
          <div className="w-1/2 pr-2">
            <label className="text-sm">Select Services</label>
            <Autocomplete
              fullWidth
              multiple
              options={services}
              disableCloseOnSelect
              size="small"
              getOptionLabel={(option) => option}
              value={selectedServices}
              onChange={handleServiceChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Select Services"
                  variant="outlined"
                />
              )}
              sx={{
                "& .MuiInputBase-input": {
                  height: "1.8em",
                  padding: "6px 12px",
                  fontSize: 14,
                  maxWidth: "calc(100% - 40px)",
                },
              }}
            />
          </div>

          <div className="w-1/2 pl-2">
            <Package setLoading={setLoading} onSelect={handleDropDownChange} />
          </div>
        </div>

        {showInputs && (
          <>
            {selectedServices.map((service, index) => (
              <div key={index} className="mb-4 px-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Integration Name for {service}
                </label>
                <input
                  type="text"
                  value={integrationNames[index] || ""}
                  onChange={(event) =>
                    handleIntegrationNameChange(event, index)
                  }
                  placeholder={`Integration Name for ${service}`}
                  className="w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 italic text-sm"
                />
              </div>
            ))}
          </>
        )}

        <div className="flex justify-end space-x-2 border-t p-2 px-4">
          <button
            onClick={onClose}
            className="border border-[#0A6ED1] text-[#0A6ED1] rounded-sm px-3 py-1 text-sm hover:text-white hover:bg-[#0A6ED1] transition duration-200 "
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

export default CreateNotificationService;
