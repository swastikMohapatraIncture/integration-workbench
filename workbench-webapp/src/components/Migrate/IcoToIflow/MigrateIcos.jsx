import Package from "./Package";
import Ico from "./Ico";
import { useState } from "react";
import { handleMigration } from "../../../apis/apiService";
import MigrationReport from "./MigrationReport";
import Loader from "../../Loader";
import CreatePackage from "../../CreatePackage/CreatePackage";
import CreateNotificationService from "../../NotificationService/CreateNotificationService";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import DetailsTable from "./DetailsTable";
import { ToastContainer, Zoom } from "react-toastify";

const MigrateIcos = () => {
  const [selectedValue, setSelectedValue] = useState(undefined);
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
    try {
      if (icoDetails?.length === 0 || selectedValue === undefined) {
        throw new Error("ICO or Package cannot be empty.");
      }

      const storedCurrAgent = localStorage.getItem("currAgent");
      const currAgent = storedCurrAgent ? JSON.parse(storedCurrAgent) : null;

      if (!currAgent) {
        throw new Error("Tenant data missing.");
      }

      const data = {
        poAgent: currAgent?.poData,
        apiAgent: currAgent?.apiData,
        migrationDetails: {
          artifactList: icoDetails,
          packageId: selectedValue,
        },
      };

      setIsLoading(true);

      const response = await handleMigration(data, "icos");
      setResponseData(response.icoDetailsList);
      setReportBase64(response.reportBase64);
      setIsModalOpen(true);
      toast.success("Migration Complete");
    } catch (error) {
      toast.error(error.message);
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
        <span title="Click to add notification services">
          <button className="pr-2" onClick={handleServicesModalOpen}>
            Add Alert Notification
          </button>
        </span>
        <span title="Click to create a new package">
          <button
            className="border-l border-[#0A6ED1] pl-2"
            onClick={handleOpenModal}
          >
            Create New Package
          </button>
        </span>
      </div>

      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
          <Loader />
        </div>
      )}

      {icoDetails.length > 0 && (
        <div className="mt-5">
          <DetailsTable icoDetails={icoDetails} setIcoDetails={setIcoDetails} />
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

        <span title="Migrate ICOs to IS">
          <button
            className="bg-[#0A6ED1] rounded-sm px-6 py-1 transition duration-200 mr-3 text-white border border-[#0A6ED1] text-sm"
            onClick={handleMigrate}
          >
            Migrate
          </button>
        </span>
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
      <ToastContainer
        position="bottom-center"
        autoClose={1500}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Zoom}
      />
    </>
  );
};

export default MigrateIcos;
