import {useState} from 'react';
import Introduction from "./Introduction";
import Table from "../Table";

const MainPageMPNeoToCf = () => {
  const [tenants, setTenants] = useState([1]);


  return (
    <>
       {(!tenants || tenants.length <= 0 )?(
          <Introduction />
        ) : (<Table/>)
       }
    </>
  )
}

export default MainPageMPNeoToCf
