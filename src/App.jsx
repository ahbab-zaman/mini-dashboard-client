import { Outlet } from "react-router";
import Sidebar from "./Components/Sidebar";

const App = () => {
  return (
    <div className="flex lg:flex-row flex-col items-center">
      <div className="lg:w-[350px] w-screen lg:h-screen h-auto bg-[#1A2537] text-white sidebar">
        <Sidebar />
      </div>
      <div className="lg:w-screen w-full bg-[#1F2A3D] lg:h-screen h-full text-white overflow-y-scroll outlet">
        <Outlet />
      </div>
    </div>
  );
};

export default App;
