import Hologram from "../assets/Hologram.svg";
import Banner from "../assets/Banner.png";
import "../index.css"

const Home = () => {
  return (
    <div className="relative h-screen overflow-x-hidden"> {/* Full height and overflow */}
      <div className="flex animate-scroll flex-col w-[95%] mx-auto">
        <img src={Banner} alt="Cloud" className="h-[300px] rounded w-full object-center border border-gray-200 mt-6" />
        <h3 className="mt-6 mb-2 font-bold text-xl text-[#32363A]">Migration Process</h3>
        <p>
          This process ensures all type of integration are optimized and rationalized for the new environment leveraging SAP Integration Suite's enhanced capabilities. The objective is a smooth transition with enhanced scalability and performance. It supports migrating from SAP PO 7.5 to Integration Suite & Neo to Cloud Foundry.
        </p>
        {/* <h3 className="mt-6 mb-2 font-bold text-xl text-[#32363A]">Migration Assessment</h3>
        <p>
          This assessment helps to plan overall migration process to enhance integration performance. It identifies the technical & time efforts while extracting design artifacts from current landscape. It assess dependencies, compatibility, mapping to ensure seamless transition.
        </p> */}
        <h3 className="mt-6 mb-2 font-bold text-xl text-[#32363A]">Automated Testing</h3>
        <p>
          This automated testing help to expand the test coverage which ensures the quality & performance. This process involves creating and executing automated multiple test scripts to validate with migrated integration iFlow to reduce manual testing efforts.
        </p>
      </div>
    </div>
  );
};

export default Home;
