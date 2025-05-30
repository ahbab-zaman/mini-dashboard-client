import { useEffect, useState } from "react";

const Navbar = () => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("username");
    if (storedName) {
      setUsername(storedName);
    }
  }, []);
  return (
    <div className="flex justify-between items-center">
      <div></div>
      <h2 className="text-3xl font-bold text-center p-3">
        {username && <span>Hello, {username} 👋</span>}
      </h2>
      <div></div>
    </div>
  );
};

export default Navbar;
