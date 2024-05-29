/* eslint-disable react/prop-types */
import { MdOutlineModeEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import TenantModal from "./MigrationProcess/TenantModal";
import { useState } from "react";
import { Link } from "react-router-dom";

const DeleteModal = ({ setDeleteModal, handleDeleteAgent, index }) => {
  return (
    <>
      <div className="fixed inset-0 z-[1000] bg-black opacity-50"></div>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 outline-none focus:outline-none z-[1000]">
        <div className="relative my-6 mx-auto max-w-3xl">
          <div className="border-0 rounded-sm shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="border-b border-gray-300 p-3">
              <h3 className="text-lg font-bold text-[#32363A]">
                Delete Tenants ?
              </h3>
            </div>
            <div className="relative p-6 flex-auto">
              <p className="text-gray-700 text-center text-sm">
                This will delete the tenants immediately.<br></br>You cannot
                undo this action.
              </p>
            </div>
            <div className="flex items-center gap-2 justify-end p-3 border-t border-gray-300">
              <button
                className="text-white text-sm rounded-sm hover:text-white bg-[#0A6ED1] transition duration-150 px-4 py-1 outline-none focus:outline-none"
                type="button"
                onClick={() => setDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="hover:bg-red-600 rounded-sm text-white bg-gray-300 hover:text-white transition duration-150 text-sm px-4 py-1 outline-none focus:outline-none"
                type="button"
                onClick={() => {
                  handleDeleteAgent(index);
                  setDeleteModal(false);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Table = ({
  openModal,
  setOpenModal,
  agents,
  setAgents,
  editingAgentIdx,
  setEditingAgentIdx,
  removeFooter = true,
  agentSelected, 
  setAgentSelected
}) => {
  const [deleteModal, setDeleteModal] = useState({ open: false, index: null });
  const handleAddAgent = () => {
    localStorage.removeItem("currAgent");
    setAgentSelected(false);
    setOpenModal((prev) => !prev);
  };

  const handleEditAgent = (idx) => {
    setEditingAgentIdx(idx);
    localStorage.setItem("currAgent", JSON.stringify(agents[idx]));
    setAgentSelected(false);
    setOpenModal((prev) => !prev);
  };

  const handleDeleteAgent = (index) => {
    const updatedAgents = [...agents];

    if (index >= 0 && index < updatedAgents.length) {
      updatedAgents.splice(index, 1);
      setAgents(updatedAgents);
      localStorage.setItem("agents", JSON.stringify(updatedAgents));
    }
  };

  return (
    <>
      {agents && agents.length > 0 && (
        <div className="overflow-x-auto p-6">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-300 text-sm">
            <thead className="bg-[#F2F2F2]">
              <tr>
                <th scope="col" className="px-5 py-2 border-gray-200 "></th>
                <th className="px-6 py-2 text-left font-bold text-[#32363A] tracking-wider border-gray-200">
                  PO Tenant
                </th>
                <th className="px-6 py-2 text-left font-bold text-[#32363A] tracking-wider border-gray-200">
                  PO Environment
                </th>
                <th className="px-6 py-2 text-left font-bold text-[#32363A] tracking-wider border-gray-200">
                  IS Tenant
                </th>
                <th className="px-6 py-2 text-left font-bold text-[#32363A] tracking-wider border-gray-200">
                  IS Environment
                </th>
                <th className="px-6 py-2 text-left font-bold text-[#32363A] tracking-wider border-gray-200">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {agents.map((agent, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="whitespace-nowrap border-gray-200 text-center">
                    <input
                      type="radio"
                      name="agent"
                      onChange={() => {
                        localStorage.setItem("currAgent", JSON.stringify(agent));
                        setAgentSelected(true);
                      }}
                    />
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-[#32363A] border-gray-200">
                    {agent?.poData?.name}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-[#32363A] border-gray-200">
                    {agent?.poData?.environment}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-[#32363A] border-gray-200">
                    {agent?.cpiData?.name}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-[#32363A] border-gray-200">
                    {agent?.cpiData?.environment}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-[#32363A] border-gray-200">
                    <button
                      className="text-blue-600 hover:text-blue-900 mr-2"
                      onClick={() => handleEditAgent(index)}
                    >
                      <MdOutlineModeEdit className="text-blue-600 text-xl" />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={() => setDeleteModal({ open: true, index })}
                    >
                      <RiDeleteBin6Line className="text-red-600 text-xl" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {removeFooter && (
            <footer
              className="border-t text-[#32363A] flex flex-row items-center justify-end gap-2 py-4 h-[60px]"
              style={{ position: "fixed", bottom: 50, left: 0, right: 0 }}
            >
              <button
                className="border border-[#0A6ED1] text-[#0A6ED1] text-sm rounded-sm px-3 py-1 hover:bg-[#0A6ED1] hover:text-white transition duration-200"
                onClick={handleAddAgent}
              >
                Add System
              </button>
              <Link to="/Migrate">
                <button
                  className={`bg-[#0A6ED1] border border-[#0A6ED1] rounded-sm px-6 py-1 transition duration-200 text-sm ${
                    !agentSelected
                      ? "bg-[#0A6ED1] opacity-50 text-white cursor-not-allowed"
                      : "bg-[#0A6ED1] text-white"
                  } mr-3`}
                  disabled={!agentSelected}
                >
                  Next
                </button>
              </Link>
            </footer>
          )}
        </div>
      )}
      {openModal && (
        <TenantModal
          agents={agents}
          setAgents={setAgents}
          openModal={openModal}
          setOpenModal={setOpenModal}
          editingAgentIdx={editingAgentIdx}
          setEditingAgentIdx={setEditingAgentIdx}
        />
      )}
      {deleteModal.open && (
        <DeleteModal
          handleDeleteAgent={handleDeleteAgent}
          setDeleteModal={(open) => setDeleteModal({ ...deleteModal, open })}
          index={deleteModal?.index}
        />
      )}
    </>
  );
};

export default Table;
