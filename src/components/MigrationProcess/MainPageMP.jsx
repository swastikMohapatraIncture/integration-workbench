/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Introduction from "./Introduction";
import Table from "../Table";
import Loader from "../Loader";

const MainPageMP = ({ removeFooter, agentSelected, setAgentSelected }) => {
  const [agents, setAgents] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingAgentIdx, setEditingAgentIdx] = useState(-1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const allAgents = JSON.parse(localStorage?.getItem("agents"));
    if (allAgents) {
      setAgents(allAgents);
    }
    setLoading(false);

    localStorage?.removeItem("currAgent");
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
        <Loader />
      </div>
    );
  }

  return (
    <>
      {!agents || agents.length <= 0 ? (
        <Introduction
          openModal={openModal}
          setOpenModal={setOpenModal}
          agents={agents}
          setAgents={setAgents}
          editingAgentIdx={editingAgentIdx}
          setEditingAgentIdx={setEditingAgentIdx}
        />
      ) : (
        <Table
          openModal={openModal}
          setOpenModal={setOpenModal}
          agents={agents}
          removeFooter={removeFooter}
          setAgents={setAgents}
          editingAgentIdx={editingAgentIdx}
          setEditingAgentIdx={setEditingAgentIdx}
          agentSelected={agentSelected}
          setAgentSelected={setAgentSelected}
        />
      )}
    </>
  );
};

export default MainPageMP;
