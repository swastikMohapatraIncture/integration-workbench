import Package from "./Package"
import Ico from './Ico'
import { useState } from "react"
import { handleMigration } from "../../apis/apiService";
import Loader from '../Loader';

const Table = ({ icoDetails }) => {
  console.log(icoDetails);
  return (
    <div className="overflow-x-auto p-3">
      <table className="table-auto w-full text-[#32363A]">
        <thead className="bg-gray-50">
          <tr>
            <th className="border border-gray-200 px-2 py-2 text-left">No.</th>
            <th className="border border-gray-200 px-2 py-2 w-[50%] text-left">Iflow Name</th>
            <th className="border border-gray-200 px-2 py-2 w-[45%] text-left">Description</th>
          </tr>
        </thead>
        <tbody>
          {icoDetails.map((detail, index) => (
            <tr key={index}>
              <td className="border border-gray-200 px-2">{index + 1}</td>
              <td className="border border-gray-200 overflow-hidden px-2">{splitName(detail.artifactName)}</td>
              <td className="border border-gray-200 overflow-hidden px-2">{splitName(detail.description)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const poData = {
  name: "IncturePO1",
  username: "INC02525",
  password: "Integration@#1",
  host: "sapserver",
  port: "50000",
  environment: "DEV"
};

const apiData = {
  name: "INCISAPI",
  clientId: "sb-8beebca2-1263-4d16-ab02-5782b2e44871!b278993|it!b26655",
  clientSecret: "da1ac9c0-1a72-4bd0-8a6f-cb8c6e9eabc3$hA60bwRYtdIxbRFAJgd1W65T-2hIkCqFVSolZgTChmI=",
  tokenUrl: "https://38eb3176trial.authentication.us10.hana.ondemand.com/oauth/token",
  url: "https://38eb3176trial.it-cpitrial05.cfapps.us10-001.hana.ondemand.com",
  environment: "DEV"
}

const splitName = (name) => {
  const maxCharactersPerLine = 45;
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

  const handleDropDownChange = (value) => {
    setSelectedValue(value.id)
    console.log("MI", selectedValue);
  }

  const handleIcoDetailsReceived = (details) => {
    setIcoDetails(details)
    console.log(icoDetails);
  }

  const handleMigrate = async () => {
    const data = {
      poAgent: poData,
      apiAgent: apiData,
      migrationDetails: {
        artifactList: icoDetails,
        packageId: selectedValue
      }
    }

    setIsLoading(true);

    try {
      await handleMigration(data, "icos");
      console.log(data);
    } catch (error) {
      console.error("Error during migration:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
          <Loader />
        </div>
      )}
      <div className={`flex justify-between gap-5 p-3 ${isLoading ? 'blur-sm' : ''}`}>
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
          <Table icoDetails={icoDetails} />
        </div>
      )}
      <div className="z-50 fixed bottom-14 border-t border-[#E5E5E5] w-[85%] flex items-end pt-3 justify-end pb-2 text-sm">
        <div className="flex gap-2 mr-12">
          <button className="border border-[#0A6Ed1] rounded-sm px-6 py-2 text-[#0A6Ed1]">
            Back
          </button>
          <button
            className="text-white bg-[#0A6Ed1] rounded-sm px-6 py-2"
            onClick={handleMigrate}
            disabled={isLoading}
          >
            Migrate
          </button>
        </div>
      </div>
    </>
  )
}

export default MigrateIcos;
