import "./App.css";
import { Routes, Route } from "react-router-dom";
import Layout from "./Layout/Layout";
import MigrationProcess from "./pages/MigrationProcess";
import AutomatedTesting from "./pages/AutomatedTesting";
import Accelarator from "./pages/Accelarator";
import About from "./pages/About";
import Contacts from "./pages/Contacts";
import FAQ from "./pages/FAQ";
import MigrationAssessment from "./pages/MigrationAssessment";
// import Table from "../src/components/Table"
import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";
import Migrate from "./pages/Migrate";
import Monitoring from './pages/Monitroing'
import ReadinessCheckMainPage from "./components/NeoToCloudFoundry/pages/ReadinessCheckMainPage";

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="home" element={<Layout><Home /></Layout>} />
      <Route path="monitoring" element={<Layout><Monitoring /></Layout >} />
      <Route path="migrationProcess" element={<Layout ><MigrationProcess/></Layout>} />
      <Route path="migrationAssessment" element={<Layout ><MigrationAssessment/></Layout>} />
      <Route path="automatedTesting" element={<Layout ><AutomatedTesting/></Layout>} />
      <Route path="accelarator" element={<Layout ><Accelarator/></Layout>} />
      <Route path="about" element={<Layout ><About/></Layout>} />
      <Route path="contacts" element={<Layout ><Contacts/></Layout>} />
      <Route path="faqs" element={<Layout ><FAQ/></Layout>} />
      <Route path="ReadinessCheckMainPage" element={<Layout ><ReadinessCheckMainPage/></Layout>} />
      
      {/* <Route path="migrationtable" element={<Layout ><Table /></Layout>} /> */}
      {/* <Route path="migrationtable2" element={<Layout ></Layout>} /> */}
      <Route path="migrate" element={<Layout><Migrate /></Layout>}></Route>
    </Routes>
  
    {/* <div>
      <Layout/>
    </div> */}
    </>
  );
}

export default App;
