import hologram from "../assets/hologram.jpg";
import "../index.css"

const Home = () => {
  return (
    <div className="relative h-screen overflow-x-hidden"> {/* Full height and overflow */}
      <div className="flex animate-scroll flex-col w-[95%] mx-auto">
        <img src={hologram} alt="Cloud" className="h-[250px] object-cover border border-gray-200 mt-6" />
        <h3 className="mt-6 mb-2 font-bold text-xl">Migration Process</h3>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta quae, quidem voluptate in animi expedita porro illum ullam provident quasi voluptatum harum similique! Doloremque ad veritatis animi? Autem, ducimus libero?
          Officia incidunt maiores voluptates pariatur modi, voluptas qui! Facilis tenetur, in temporibus ad, voluptates eligendi odio aperiam accusamus ea est quas laborum officiis architecto asperiores quasi debitis maiores obcaecati nulla.
        </p>
        <h3 className="mt-6 mb-2 font-bold text-xl">Migration Assessment</h3>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta quae, quidem voluptate in animi expedita porro illum ullam provident quasi voluptatum harum similique! Doloremque ad veritatis animi? Autem, ducimus libero?
          Officia incidunt maiores voluptates pariatur modi, voluptas qui! Facilis tenetur, in temporibus ad, voluptates eligendi odio aperiam accusamus ea est quas laborum officiis architecto asperiores quasi debitis maiores obcaecati nulla.
        </p>
        <h3 className="mt-6 mb-2 font-bold text-xl">Automated Testing</h3>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta quae, quidem voluptate in animi expedita porro illum ullam provident quasi voluptatum harum similique! Doloremque ad veritatis animi? Autem, ducimus libero?
          Officia incidunt maiores voluptates pariatur modi, voluptas qui! Facilis tenetur, in temporibus ad, voluptates eligendi odio aperiam accusamus ea est quas laborum officiis architecto asperiores quasi debitis maiores obcaecati nulla.
        </p>
      </div>
    </div>
  );
};

export default Home;
