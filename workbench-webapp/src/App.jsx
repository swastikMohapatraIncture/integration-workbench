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

import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "./components/Loader";
import AutomationMainPage from "./pages/AutomationMainPage";

function App() {
  const [token, setToken] = useState(null);
  useEffect(() => {
    const getToken = () => {
      axios.get("/user").then((res) => {
        if (res?.data?.token) {
          setToken(res?.data?.token);
          localStorage.setItem("token", res?.data?.token);
        }
        console.log(res);
      });
      // fetch("/user")
      //   .then((response) => response.text())
      //   .then((result) => {
      //     let obj = JSON.parse(result)
      //     if (obj?.access_token) {
      //       setToken(obj?.access_token)
      //       localStorage.setItem("token", obj?.access_token);
      //     }
      //   })
      //   .catch((error) => console.error(error));
    };

    getToken();
  }, []);

  if (!token) {
    <Loader></Loader>;
  } else {
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
            path="migrationAssessment"
            element={
              <Layout>
                <MigrationAssessment />
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
                {/* <AutomatedTesting /> */}
                <AutomationMainPage />
              </Layout>
            }
          />
          {/* <Route
            path="accelarator"
            element={
              <Layout>
                <Accelarator />
              </Layout>
            }
          /> */}
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
}

export default App;
