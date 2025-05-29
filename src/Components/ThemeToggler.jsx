import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

const ThemeToggler = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  return (
    <div className="fixed bottom-8 left-10 z-50">
      <div
        onClick={() => setDarkMode(!darkMode)}
        className={`w-14 h-8 flex items-center px-1 rounded-full cursor-pointer relative z-50 transition-colors duration-300 ${
          darkMode ? "bg-gray-300" : "bg-gray-800"
        }`}
      >
        {/* Toggle knob */}
        <div
          className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
            darkMode ? "translate-x-6" : "translate-x-0"
          }`}
        />
        {/* Icon inside switch */}
        <div className="absolute left-1/2 top-1/2  -translate-y-1/2 pointer-events-none">
          {darkMode ? (
            <FaMoon className="text-white text-sm -translate-x-[130%]" />
          ) : (
            <FaSun
              className="text-yellow-500 text-sm translate-x-[50%]"
              size={15}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ThemeToggler;
