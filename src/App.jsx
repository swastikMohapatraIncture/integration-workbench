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
import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";
import Migrate from "./pages/Migrate";
import Monitoring from "./pages/Monitroing";
import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReadinessCheckMainPage from "./components/NeoToCloudFoundry/pages/ReadinessCheckMainPage";
import NeoMigration from "./components/NeoToCloudFoundry/pages/NeoMigration";
import GetArtifactsPage from "./components/NeoToCloudFoundry/pages/GetArtifactsPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="home"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="monitoring"
          element={
            <Layout>
              <Monitoring />
            </Layout>
          }
        />
        <Route
          path="migrationProcess"
          element={
            <Layout>
              <MigrationProcess />
            </Layout>
          }
        />
        <Route
          path="migrationAssessment/neo"
          element={
            <Layout>
              <MigrationAssessment renderTab={1} />
            </Layout>
          }
        />
        <Route
          path="automatedTesting"
          element={
            <Layout>
              <AutomatedTesting />
            </Layout>
          }
        />
        <Route
          path="accelarator"
          element={
            <Layout>
              <Accelarator />
            </Layout>
          }
        />
        <Route
          path="about"
          element={
            <Layout>
              <About />
            </Layout>
          }
        />
        <Route
          path="contacts"
          element={
            <Layout>
              <Contacts />
            </Layout>
          }
        />
        <Route
          path="faqs"
          element={
            <Layout>
              <FAQ />
            </Layout>
          }
        />
        <Route
          path="migrate"
          element={
            <Layout>
              <Migrate />
            </Layout>
          }
        ></Route>
        <Route
          path="/readinesscheck"
          element={
            <Layout>
              <ReadinessCheckMainPage />
            </Layout>
          }
        ></Route>
        <Route
          path="/neomigration"
          element={
            <Layout>
              <NeoMigration />
            </Layout>
          }
        ></Route>
        <Route
          path="/getartifacts"
          element={
            <Layout>
              <GetArtifactsPage />
            </Layout>
          }
        ></Route>
      </Routes>
      <ToastContainer
        position="bottom-center"
        autoClose={1500}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Zoom}
      />
    </>
  );
}

export default App;
