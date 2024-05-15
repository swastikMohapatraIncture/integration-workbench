import './App.css'
import {
  Routes,
  Route
} from "react-router-dom";
import Layout from './Layout/Layout'
import Demo from './pages/Demo';

function App() {

  return (
    <>
    <Routes>
      <Route path="*" element={<Demo/>}/>
      <Route path="home" element={<Layout/>}/>
    </Routes>
    {/* <div>
      <Layout/>
    </div> */}
    </>
  )
}

export default App
