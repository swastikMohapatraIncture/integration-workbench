import {useState} from 'react';
import Introduction from "./Introduction";
import Table from "../Table";

const MainPageMP = () => {
  const [tenants, setTenants] = useState([]);
  return (
    <>
      {
        !tenants || tenants.length <= 0 ? (
          <Introduction />
        ) : (<Table/>)
       }
    </>
  )
}

export default MainPageMP
