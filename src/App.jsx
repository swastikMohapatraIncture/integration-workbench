<<<<<<< Updated upstream
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Layout from "./Layout/Layout";
import Demo from "./pages/Demo";
import MigrationProcess from "./pages/MigrationProcess";
import AutomatedTesting from "./pages/AutomatedTesting";
import Accelarator from "./pages/Accelarator";
import About from "./pages/About";
import Contacts from "./pages/Contacts";
import FAQ from "./pages/FAQ";
import MigrationAssessment from "./pages/MigrationAssessment";
=======
import './App.css'
import {
  Routes,
  Route
} from "react-router-dom";
import Layout from './Layout/Layout'
import HomePage from './pages/HomePage';
>>>>>>> Stashed changes

function App() {
  return (
    <>
<<<<<<< Updated upstream
      <Routes>
        <Route path="*" element={<Demo />} />
        <Route path="home" element={<Layout />} />
        <Route path="migrationProcess" element={<Layout ><MigrationProcess/></Layout>} />
        <Route path="migrationAssessment" element={<Layout ><MigrationAssessment/></Layout>} />
        <Route path="automatedTesting" element={<Layout ><AutomatedTesting/></Layout>} />
        <Route path="accelarator" element={<Layout ><Accelarator/></Layout>} />
        <Route path="about" element={<Layout ><About/></Layout>} />
        <Route path="contacts" element={<Layout ><Contacts/></Layout>} />
        <Route path="faqs" element={<Layout ><FAQ/></Layout>} />
      </Routes>
      {/* <div>
=======
    <Routes>
      <Route path="/" element={<HomePage/>}/>
      <Route path="home" element={<Layout/>}/>
    </Routes>
    {/* <div>
>>>>>>> Stashed changes
      <Layout/>
    </div> */}
    </>
  );
}

export default App;
