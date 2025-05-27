import { Outlet } from "react-router";
import Sidebar from "./Components/Sidebar";

const App = () => {
  return (
    <div className="flex items-center">
      <div className="lg:w-[350px] w-screen h-screen bg-[#1A2537] text-white">
        <Sidebar />
      </div>
      <div className="lg:w-screen w-auto bg-[#1F2A3D] h-screen text-white">
        <Outlet />
      </div>
    </div>
  );
};

export default App;
