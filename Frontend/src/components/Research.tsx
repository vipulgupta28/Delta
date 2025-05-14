
import Navbar from "./HomeComponents/Navbar";
import Sidebar from "./HomeComponents/Sidebar";


const Research: React.FC = () => {
 

  
  

  return (
    <div className="flex flex-col h-screen w-screen bg-black text-white font-sans">

      <Navbar />


      <div className="flex flex-1 overflow-hidden">

        <div className="w-60 mt-10 flex-shrink-0">
          <Sidebar />
        </div>

   
        <div className="flex-1 mt-10 px-10 ml-10 overflow-y-auto">
       
          <div className=" space-y-6">
            <h1 className="text-3xl font-extrabold tracking-tight border-b border-gray-700 pb-2">
              Read Our Finest Researches
            </h1>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Research;