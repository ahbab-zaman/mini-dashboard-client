// Sidebar.jsx
import logo from "../assets/logo-icon.svg";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardCheck,
  LogIn,
  LogOut,
  Menu,
  Target,
  UserRoundPen,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { isLoggedIn, logout } from "../utils/auth";
import toast from "react-hot-toast";

const links = [
  { name: "Tasks", href: "/", icon: <ClipboardCheck /> },
  { name: "Goals", href: "/goals", icon: <Target /> },
  { name: "Profile", href: "/profile", icon: <UserRoundPen /> },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    logout();
    toast.success("Log out successful");
    navigate("/login");
  };

  return (
    <>
      {/* Menu Icon for Small Screens */}
      <div className="md:hidden p-4 flex justify-between items-center text-white">
        <h2 className="text-2xl font-bold px-[22px] flex items-center gap-2">
          <img className="w-10" src={logo} alt="" /> Nailed IT{" "}
        </h2>
        <div>
          <button onClick={() => setIsOpen(true)}>
            <Menu size={28} />
          </button>
        </div>
      </div>

      {/* Sidebar for Large Screens */}
      <div className="hidden md:flex flex-col lg:w-72 w-screen h-screen text-white p-6 space-y-6 fixed top-0 left-0 ">
        <h2 className="text-2xl font-bold mb-[80px] px-[22px] flex items-center gap-2">
          <img className="w-10" src={logo} alt="" /> Nailed IT{" "}
        </h2>
        <h4 className="font-bold px-6">Dashboard</h4>
        {links.map((link) => (
          <div className="text-lg">
            <Link
              key={link.name}
              to={link.href}
              className="hover:bg-[#182F47] px-4 py-2 rounded transition duration-300 flex items-center gap-2"
            >
              <p>{link.icon}</p>
              {link.name}
            </Link>
          </div>
        ))}

        <div className="flex flex-col text-lg">
          {isLoggedIn ? (
            <>
              <button onClick={handleLogout}>
                <Link
                  to="/login"
                  className="flex gap-2 hover:bg-[#182F47] px-4 py-2 rounded transition duration-300"
                >
                  <p className="flex items-center gap-2">
                    <LogOut /> Logout
                  </p>
                </Link>
              </button>
            </>
          ) : (
            <div>
              <Link className="flex gap-2 hover:bg-[#182F47] px-4 py-2 rounded transition duration-300">
                <button className="flex items-center gap-2">
                  <LogIn /> Login
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar for Small Screens with Animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 h-full w-[220px] bg-[#1A2537] text-white z-50 p-6 border-[1px] border-gray-400 "
          >
            <div className="flex flex-col justify-between items-end mb-6">
              <button onClick={() => setIsOpen(false)}>
                <X size={28} />
              </button>
            </div>

            <h4 className="px-6 font-bold mb-4">Dashboard</h4>
            <nav className="space-y-4">
              {links.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex gap-2 hover:bg-purple-500 px-4 py-2 rounded transition duration-300"
                >
                  <p>{link.icon}</p>
                  {link.name}
                </Link>
              ))}
            </nav>
            <div className="flex flex-col text-lg">
              {isLoggedIn ? (
                <div>
                  <Link
                    to="/login"
                    className="flex gap-2 hover:bg-[#182F47] px-4 py-2 rounded transition duration-300"
                  >
                    <p
                      onClick={handleLogout}
                      className="flex items-center gap-2"
                    >
                      <LogOut /> Logout
                    </p>
                  </Link>
                </div>
              ) : (
                <div>
                  <Link className="flex gap-2 hover:bg-[#182F47] px-4 py-2 rounded transition duration-300">
                    <button className="flex items-center gap-2">
                      <LogIn /> Login
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
