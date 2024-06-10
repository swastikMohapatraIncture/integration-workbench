import { useState, useEffect } from "react";
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
import Loader from "./components/Loader";

function App() {
  const [token, setToken] = useState(null)
  useEffect(() => {
    const getToken = () => {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", "Basic c2ItV29ya0JlbmNoQXBwbGljYXRpb25fWHN1YSF0Mzc5NTgwOm1DMHNFR3M5V3pVa0d1ZmVzOXQ0enNzN1hKQT0=");
      myHeaders.append("Cookie", "__VCAP_ID__=39b099b4-f39d-4e60-5a99-0e46; JSESSIONID=EF6737ECDC9B8430354CE498583A2778; __VCAP_ID__=2d27c4d9-1cb0-4f2a-68d6-56e6");
      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
      };

      fetch("https://inc-cust-poc.authentication.eu10.hana.ondemand.com/oauth/token?grant_type=client_credentials", requestOptions)
        .then((response) => response.text())
        .then((result) => {
          let obj = JSON.parse(result)
          if (obj?.access_token) {
            setToken(obj?.access_token)
            localStorage.setItem("token", obj?.access_token);
          }
        })
        .catch((error) => console.error(error));
    }

    getToken()

  }, [])

  if (!token) {
    <Loader></Loader>
  }
  else {
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
    )
  }
}

export default App;
