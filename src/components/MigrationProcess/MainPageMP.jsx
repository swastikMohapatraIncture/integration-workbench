import {useState} from 'react';
import Introduction from "./Introduction";
import Table from "../Table/Table";

const MainPageMP = () => {
  const [tenants, setTenants] = useState([1]);
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
