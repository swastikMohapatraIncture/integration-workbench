import { useState } from "react";
import TenantModal from "./TenantModal";
import { NEOToCFfeatures, features } from "../../constants/data";

const FeatureBox = ({ text, borderColor, bgColor, width }) => (
  <div className={`rounded h-16 flex items-center p-4 font-semibold ${width}`}
  style={{ borderLeft: `2px solid ${borderColor}`, backgroundColor: bgColor }}>
    <p>{text}</p>
  </div>
);

const Introduction = () => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="p-5">
      <div className="bg-[#EBf5FF] p-5 rounded">
        <h3 className="text-xl font-bold mb-4 text-[#2A4862]">Integration Workbench</h3>
        <p className="text-[#32363A]">
        Integration Workbench facilitates the seamless migration of integrations from SAP NEO Data Centers to SAP Integration Suite (Cloud Foundry) through an interactive user interface. This migration tool is crafted to drastically reduce manual migration efforts and eliminate the possibility of human error in the process.
        </p>
        <div className="flex justify-end mt-4">
          <button
            className="bg-[#0A6ED1] text-white rounded p-2 px-6 hover:bg-gray-300 hover:text-black transition duration-200"
            onClick={() => setOpenModal(!openModal)}
          >
            Start Configuration
          </button>
        </div>
      </div>
      <div className="mt-4 p-5 border border-[#BBC7D2] rounded">
        <h3 className="text-xl font-bold mb-4 text-[#2A4862]">Salient Features</h3>
        <div className="flex flex-wrap text-[14px] gap-3 justify-between">
          {NEOToCFfeatures.map((feature, index) => (
            <FeatureBox
              key={index}
              text={feature.text}
              borderColor={feature.borderColor}
              bgColor={feature.bgColor}
              width={feature.width}
            />
          ))}
        </div>
      </div>
      {openModal && (
        <TenantModal openModal={openModal} setOpenModal={setOpenModal} />
      )}
    </div>
  );
};

export default Introduction;
