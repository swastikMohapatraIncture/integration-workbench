import MainPageMP from "../MigrationProcess/MainPageMP";

const TablePage = ({ agentSelected, setAgentSelected }) => {
  return (
    <div>
      <MainPageMP
        removeFooter={false}
        agentSelected={agentSelected}
        setAgentSelected={setAgentSelected}
      />
    </div>
  );
};

export default TablePage;
