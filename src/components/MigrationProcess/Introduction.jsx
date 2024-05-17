import { useState } from "react";
import TenantModal from "./TenantModal";

const Introduction = () => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <div className="text-[#32363A]">
      <div>
        <p>
          <strong>Integration Workbench</strong> facilitates the seamless migration of
          integrations from SAP PO 7.5 to IS through an interactive user
          interface. This migration tool is crafted to drastically reduce manual
          migration efforts and eliminate the possibility of human error in the
          process.
        </p>
      </div>

      <div className="mt-6 text-[#32363A]">
        <h3 className="text-xl font-semibold text-[#32363A]">Salient Features</h3>
        <ul className="mt-2 list-disc mx-4">
          <li>Significant reduction in migration effort.</li>
          <li>Migrate multiple integrations simultaneously.</li>
          <li>Automated migration of PO 7.5 integrations to CPI.</li>
          <li> Dynamic migration templates automatically applied by Jacana.</li>
          <li>
            {" "}
            Migration report to validate the migrated and non-migrated
            components.
          </li>
          <li>
            {" "}
            Automatic implementation of error handling and payload logging
            across all integrations
          </li>
          <li>
            {" "}
            Migration support for components not available in SAP Migration -
            Value Mapping, Encoding-Decoding etc.
          </li>
        </ul>
      </div>

      <div className="mt-4">
        <h3 className="text-xl font-semibold">
          Want to Explore more? Try adding a tenant below.
        </h3>
        <button
          className="mt-3 bg-[#0A6ED1] flex flex-row text-white rounded p-2 px-6 hover:bg-gray-300 hover:text-black transition duration-200"
          onClick={() => setOpenModal(!openModal)}
        >
          Start Configuration
        </button>
      </div>
      {openModal && (
        <TenantModal openModal={openModal} setOpenModal={setOpenModal} />
      )}
    </div>
  );
};

export default Introduction;
