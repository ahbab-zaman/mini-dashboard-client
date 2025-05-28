import { useState } from "react";
import logo from "../assets/logo-icon.svg";
import google from "../assets/google-icon.svg";
import { Link, useNavigate } from "react-router"; // make sure you use react-router-dom
import axios from "axios";
import toast from "react-hot-toast";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email: form.email,
        password: form.password,
      });

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success("Logged in successfully!");
      navigate("/"); // redirect to home or dashboard
    } catch (err) {
      console.error("Login failed", err.response?.data || err.message);
      toast.error(
        err.response?.data || "Login failed. Please check your credentials."
      );
    }
  };

  return (
    <section className="flex lg:flex-row flex-col text-white min-h-screen">
      {/* Left Section */}
      <div className="lg:w-1/2 w-full hidden lg:flex relative z-50">
        <div className="w-full relative overflow-hidden bg-[#111c2d] z-20">
          <div className="circle-top"></div>
          <div>
            <img src={logo} alt="Logo-Dark" className="circle-bottom" />
          </div>
          <div className="flex flex-col justify-center items-start px-6 h-[500px] max-w-[360px] mx-auto">
            <h2 className="text-3xl lg:text-5xl font-medium leading-tight mb-3">
              Welcome to <br /> Nailed IT
            </h2>
            <p className="text-[#C3C6CA] font-semibold mb-3">
              Nailed IT helps developers to build organized and well coded
              dashboards full of beautiful and rich modules.
            </p>
            <button className="bg-blue-400 text-white font-medium px-4 py-2 rounded-full">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="lg:w-1/2 w-full bg-[#1A2537] p-6 flex flex-col items-center">
        <img src={logo} alt="logo" className="w-24 mb-4" />
        <h2 className="text-[#E9EAEB] font-bold text-2xl lg:text-3xl mt-4 mb-6">
          Sign In
        </h2>

        {/* Google Button */}
        <div className="flex items-center justify-center gap-3 border border-blue-400 w-full max-w-xs py-2 rounded-full cursor-pointer">
          <img className="w-6" src={google} alt="Google icon" />
          <h4 className="text-blue-400 font-semibold">Google</h4>
        </div>

        {/* Divider */}
        <div className="flex items-center w-full max-w-xs my-6">
          <div className="flex-grow border-t border-gray-600"></div>
          <span className="mx-4 text-white font-semibold text-sm">
            or sign in with
          </span>
          <div className="flex-grow border-t border-gray-600"></div>
        </div>

        {/* Email Input */}
        <div className="flex flex-col w-full max-w-xs">
          <label className="mb-2 font-semibold" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="border border-[#465670] p-2 rounded-md focus:outline-none bg-transparent"
          />
        </div>

        {/* Password Input */}
        <div className="flex flex-col w-full max-w-xs mt-4">
          <label className="mb-2 font-semibold" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            className="border border-[#465670] p-2 rounded-md focus:outline-none bg-transparent"
          />
        </div>

        {/* Forget Password */}
        <div className="flex justify-between w-full max-w-xs mt-4 text-sm">
          <div></div>
          <h4 className="text-blue-400 font-semibold cursor-pointer">
            Forget Password?
          </h4>
        </div>

        {/* Sign In Button */}
        <div className="mt-6 w-full max-w-xs">
          <button
            onClick={handleSubmit}
            className="w-full py-2 bg-blue-400 text-white rounded-full font-semibold cursor-pointer"
          >
            Sign In
          </button>
        </div>
        <div className="mt-4">
          New to Nailed IT?
          <span className="text-blue-400 font-semibold">
            <Link to="/register">Create Account</Link>
          </span>
        </div>
      </div>
    </section>
  );
};

export default Login;
