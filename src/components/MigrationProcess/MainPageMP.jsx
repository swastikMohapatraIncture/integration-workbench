import { useEffect, useState } from "react";
import Introduction from "./Introduction";
import Table from "../Table";

const MainPageMP = () => {
  const [agents, setAgents] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingAgentIdx, setEditingAgentIdx] = useState(-1);

  useEffect(() => {
    const allAgents = JSON.parse(localStorage?.getItem("agents"));
    if (allAgents) {
      setAgents(allAgents);
    }

    localStorage?.removeItem("currAgent");
  }, []);

  return (
    <>
      {(!agents || agents.length <= 0) ? (
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
          setAgents={setAgents}
          editingAgentIdx={editingAgentIdx}
          setEditingAgentIdx={setEditingAgentIdx}
        />
      )}
    </>
  );
};

export default MainPageMP;
