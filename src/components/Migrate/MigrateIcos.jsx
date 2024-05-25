import Package from "./Package";
import Ico from "./Ico";
import { useState } from "react";
import { handleMigration } from "../../apis/apiService";
import MigrationReport from "./MigrationReport";
import { MdOutlineModeEdit } from "react-icons/md";
import { FaRegCircleCheck } from "react-icons/fa6";
import { ImCancelCircle } from "react-icons/im";
import Loader from "../Loader";
import CreatePackage from "../CreatePackage/CreatePackage";
import CreateNotificationService from "../NotificationService/CreateNotificationService";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Table = ({ icoDetails, setIcoDetails }) => {
  const [editIndex, setEditIndex] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

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
    <div className="overflow-x-auto p-3 text-sm">
      <table className="table-auto w-full text-[#32363A]">
        <thead className="bg-gray-50">
          <tr>
            <th className="border border-gray-200 px-2 py-2 text-center w-[5%]">
              No.
            </th>
            <th className="border border-gray-200 px-2 py-2 w-[20%] text-left">
              Iflow Name
            </th>
            <th className="border border-gray-200 px-2 py-2 w-[20%] text-left">
              Description
            </th>
            <th className="border border-gray-200 px-2 py-2 text-left w-[5%]">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="max-h-40 overflow-y-auto">
          {icoDetails?.map((detail, index) => (
            <tr key={index}>
              <td className="border border-gray-200 px-2 text-center">
                {index + 1}
              </td>
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
                      className="text-green-500 mx-6 text-2xl"
                      onClick={() => handleSave(index)}
                    >
                      <FaRegCircleCheck />
                    </button>
                    <button
                      className="text-red-600 text-2xl"
                      onClick={handleCancel}
                    >
                      <ImCancelCircle />
                    </button>
                  </>
                ) : (
                  <button
                    className=" text-white px-2 py-1 ml-6"
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
    return "";
  }

  if (name.length > maxCharactersPerLine) {
    return (
      <>
        {name
          .match(new RegExp(`.{1,${maxCharactersPerLine}}`, "g"))
          .map((line, index) => (
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
  const [reportBase64, setReportBase64] = useState("");
  const [packageModal, setPackageModal] = useState(false);
  const [servicesModal, setServicesModal] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const handleDropDownChange = (value) => setSelectedValue(value?.id);
  const handleIcoDetailsReceived = (details) => setIcoDetails(details);
  const handleOpenModal = () => setPackageModal(true);
  const handleCloseModal = () => setPackageModal(false);
  const handleServicesModalOpen = () => setServicesModal(true);
  const handleServicesModalClose = () => setServicesModal(false);
  const handlePackageCreation = () => setRefresh((prevState) => !prevState);

  const handleMigrate = async () => {
    const storedCurrAgent = localStorage.getItem("currAgent");
    const currAgent = storedCurrAgent ? JSON.parse(storedCurrAgent) : null;

    if (!currAgent) {
      toast.error("Tenant Data missing.");
      return;
    }

    const data = {
      poAgent: currAgent.poData,
      apiAgent: currAgent.apiData,
      migrationDetails: {
        artifactList: icoDetails,
        packageId: selectedValue,
      },
    };

    if (icoDetails.length === 0 || selectedValue === undefined) {
      toast.error("ICO or Package cannot be empty.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await handleMigration(data, "icos");
      setResponseData(response.icoDetailsList);
      setReportBase64(response.reportBase64);
      setIsModalOpen(true);
      toast.success("Migration Complete");

      // Reset state variables after successful migration
      setIcoDetails([]);
      setSelectedValue(undefined);
    } catch (error) {
      toast.error("Error during migration");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-between gap-5 p-3">
        <Ico
          onIcoDetailsReceived={handleIcoDetailsReceived}
          setLoading={setIsLoading}
        />
        <Package
          onSelect={handleDropDownChange}
          setLoading={setIsLoading}
          refreshList={refresh}
        />
      </div>
      <div className="px-3 text-[#0A6ED1] flex justify-end text-sm">
        <button className="pr-2" onClick={handleServicesModalOpen}>
          Add Alert Notification
        </button>
        <button
          className="border-l border-[#0A6ED1] pl-2"
          onClick={handleOpenModal}
        >
          Create New Package
        </button>
      </div>

      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
          <Loader />
        </div>
      )}

      {icoDetails.length > 0 && (
        <div className="mt-5">
          <Table icoDetails={icoDetails} setIcoDetails={setIcoDetails} />
        </div>
      )}

      <footer
        className="border-t text-[#32363A] flex flex-row items-center justify-end gap-2 py-4 h-[60px] bg-white"
        style={{ position: "fixed", bottom: 50, left: 0, right: 0 }}
      >
        <Link to="/migrationProcess">
          <button className="border border-[#0A6ED1] text-[#0A6ED1] rounded-sm px-3 py-1 text-sm hover:text-white hover:bg-[#0A6ED1] transition duration-200 ">
            Back
          </button>
        </Link>

        <button
          className="bg-[#0A6ED1] rounded-sm px-6 py-1 transition duration-200 mr-3 text-white border border-[#0A6ED1] text-sm"
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

      <CreatePackage
        isOpen={packageModal}
        onClose={handleCloseModal}
        setIsLoading={setIsLoading}
        onPackageCreated={handlePackageCreation}
      />

      <CreateNotificationService
        isOpen={servicesModal}
        setLoading={setIsLoading}
        onClose={handleServicesModalClose}
      />
    </>
  );
};

export default MigrateIcos;
