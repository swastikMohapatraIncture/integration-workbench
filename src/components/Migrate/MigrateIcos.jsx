import Package from "./Package"
import Ico from './Ico'
import { useState } from "react"
import { handleMigration } from "../../apis/apiService";
import MigrationReport from "./MigrationReport";
import { MdOutlineModeEdit } from "react-icons/md";
import Loader from '../Loader';

const Table = ({ icoDetails, setIcoDetails }) => {
  const [editIndex, setEditIndex] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const handleEdit = (index, detail) => {
    setEditIndex(index);
    setEditName(detail.artifactName);
    setEditDescription(detail.description);
  };

  const handleSave = (index) => {
    const updatedDetails = [...icoDetails];
    updatedDetails[index].artifactName = editName;
    updatedDetails[index].description = editDescription;
    setIcoDetails(updatedDetails);
    setEditIndex(null);
  };

  const handleCancel = () => {
    setEditIndex(null);
  };

  return (
    <div className="overflow-x-auto p-3">
      <table className="table-auto w-full text-[#32363A]">
        <thead className="bg-gray-50">
          <tr>
            <th className="border border-gray-200 px-2 py-2 text-center w-[5%]">No.</th>
            <th className="border border-gray-200 px-2 py-2 w-[20%] text-left">Iflow Name</th>
            <th className="border border-gray-200 px-2 py-2 w-[20%] text-left">Description</th>
            <th className="border border-gray-200 px-2 py-2 text-left w-[5%]">Actions</th>
          </tr>
        </thead>
        <tbody className="max-h-40 overflow-y-auto">
          {icoDetails.map((detail, index) => (
            <tr key={index}>
              <td className="border border-gray-200 px-2 text-center">{index + 1}</td>
              <td className="border border-gray-200 overflow-hidden px-2">
                {editIndex === index ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300"
                  />
                ) : (
                  splitName(detail.artifactName)
                )}
              </td>
              <td className="border border-gray-200 overflow-hidden px-2 h-20">
                {editIndex === index ? (
                  <input
                    type="text"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300"
                  />
                ) : (
                  detail.description
                )}
              </td>
              <td className="border border-gray-200 overflow-hidden px-2">
                {editIndex === index ? (
                  <>
                    <button
                      className="bg-green-500 text-white px-2 py-1 mr-2"
                      onClick={() => handleSave(index)}
                    >
                      Save
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    className=" text-white px-2 py-1"
                    onClick={() => handleEdit(index, detail)}
                  >
                    <MdOutlineModeEdit className="text-blue-600 text-xl" />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const splitName = (name) => {
  const maxCharactersPerLine = 45;

  if (!name) {
    // Return an empty string or a placeholder if name is undefined or null
    return '';
  }

  if (name.length > maxCharactersPerLine) {
    return (
      <>
        {name.match(new RegExp(`.{1,${maxCharactersPerLine}}`, 'g')).map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </>
    );
  } else {
    return name;
  }
};

const MigrateIcos = () => {
  const [selectedValue, setSelectedValue] = useState();
  const [icoDetails, setIcoDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [responseData, setResponseData] = useState([]);
  const [reportBase64, setReportBase64] = useState('');

  const handleDropDownChange = (value) => {
    setSelectedValue(value.id)
    console.log("MI", selectedValue);
  }

  const handleIcoDetailsReceived = (details) => {
    setIcoDetails(details)
    console.log(icoDetails);
  }

  const handleMigrate = async () => {
    const storedCurrAgent = localStorage.getItem("currAgent");
    const currAgent = storedCurrAgent  ? JSON.parse(storedCurrAgent) : null;

    if(!currAgent) {
      console.log("Tenant Data missing, kindly login and try again");
      return ;
    }

    const data = {
      poAgent: currAgent.poData,
      apiAgent: currAgent.apiData,
      migrationDetails: {
        artifactList: icoDetails,
        packageId: selectedValue
      }
    }

    console.log(data);

    if(icoDetails.length === 0 || selectedValue === undefined) {
      return ;
    }

    setIsLoading(true);

    try {
      const response = await handleMigration(data, "icos");
      console.log(response);
      setResponseData(response.icoDetailsList);
      setReportBase64(response.reportBase64);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error during migration:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="flex justify-between gap-5 p-3">
        <Ico onIcoDetailsReceived={handleIcoDetailsReceived} setLoading={setIsLoading}/>
        <Package onSelect={handleDropDownChange} setLoading={setIsLoading}/>
      </div>
      <div className="px-3 text-[#0A6ED1] flex justify-end text-sm">
        <button className="pr-2">
          Add Alert Notification
        </button>
        <button className="border-l border-[#0A6ED1] pl-2">
          Create New Package
        </button>
      </div>
      {icoDetails.length > 0 && (
        <div className="mt-5">
          <Table icoDetails={icoDetails} setIcoDetails={setIcoDetails}/>
        </div>
      )}

      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[999]">
          <Loader />
        </div>
      )}
      
      <footer
        className="border-t text-[#32363A] flex flex-row items-center justify-end gap-4 py-4 h-[60px] bg-white"
        style={{ position: "fixed", bottom: 50, left: 0, right: 0 }}
      >
        <button
          className="bg-[#0A6ED1] text-white rounded-sm px-3 py-1 hover:bg-gray-100 hover:text-black transition duration-200 "
        >
          Back
        </button>
        
        <button
          className="bg-[#0A6ED1] rounded-sm px-6 py-1 transition duration-200 mr-3 text-white"
          onClick={handleMigrate}
        >
          Migrate
        </button>
      </footer>
      
      <MigrationReport 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        responseData={responseData}
        reportBase64={reportBase64}
      />
    </>
  )
}

export default MigrateIcos;
