import {useState, useEffect} from 'react';
import Introduction from "./Introduction";
import NeoTable from "../NeoTable";

const MainPageMPNeoToCf = () => {
  const [tenants, setTenants] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingAgentIdx, setEditingAgentIdx] = useState(-1);

  useEffect(() => {
    const allTenants = JSON.parse(localStorage?.getItem("tenants"));
    if (allTenants) {
      setTenants(allTenants);
    }
    localStorage?.removeItem("currNeoAgent");
  }, []);

  return (
    <>
       {(!tenants || tenants.length <= 0 )?(
          <Introduction 
          tenants={tenants}
          setTenants={setTenants}
          editingAgentIdx={editingAgentIdx}
          setEditingAgentIdx={setEditingAgentIdx}/>
        ) : (<NeoTable 
          openModal={openModal}
          setOpenModal={setOpenModal}
          tenants={tenants}
          setTenants={setTenants}
          editingAgentIdx={editingAgentIdx}
          setEditingAgentIdx={setEditingAgentIdx}/>)
       }
    </>
  )
}

export default MainPageMPNeoToCf
