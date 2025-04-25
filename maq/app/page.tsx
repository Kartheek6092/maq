"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import { LogIn } from "lucide-react";
import { RiLoginCircleFill } from "react-icons/ri";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [companyName, setCompanyName] = useState("");
  const [logo, setLogo] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      const token = Cookies.get("session_token");
      const userRole = Cookies.get("userRole");

      if (token && userRole) {
        setCheckingAuth(true);
        if (userRole === "admin") {
          router.replace("/admin");
        } else if (userRole === "user") {
          router.replace("/instructions");
        }
      } else {
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const res = await axios.get("/api/admin/assignments/latest");
        if (res.data && res.data.companyName && res.data.logo) {
          setCompanyName(res.data.companyName);
          setLogo(res.data.logo);
        } else {
          console.warn("Company info API returned incomplete data:", res.data);
        }
      } catch (err) {
        setError("Failed to load application details. Please try again later.");
      }
    };

    fetchCompanyInfo();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!username || !password) {
      setError("Username and password are required.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("/api/auth/login", { username, password });

      if (res.status === 200) {
        const { token, role, ...userData } = res.data;
        Cookies.set("session_token", token, {
          path: "/",
          secure: true,
          sameSite: "strict",
        });
        Cookies.set("userRole", role, {
          path: "/",
          secure: true,
          sameSite: "strict",
        });

        if (role === "admin") {
          router.push("/admin");
        } else if (role === "user") {
          sessionStorage.setItem("user", JSON.stringify(userData));
          router.push("/instructions");
          localStorage.setItem("check", "true");
        } else {
          setError("Invalid user role received. Please contact support.");
        }
      } else {
        setError(`Login failed with status: ${res.status}. Please try again.`);
      }
    } catch (err: any) {
      setLoading(false);
      if (err.response) {
        setError(
          err.response.data?.message ||
          `Login failed: ${err.response.statusText}`
        );
      } else if (err.request) {
        setError(
          "Network error. Could not connect to the server. Please check your internet connection."
        );
      } else {
        setError(
          "An unexpected client-side error occurred during login. Please try again."
        );
      }
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-50">
        <p className="text-gray-600 italic">Checking authentication...</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col font-sans text-gray-800 bg-white "
      style={{
        backgroundImage: `url('/login-bg.jpg')`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      {/* Header */}
      <header className=" px-4 py-4 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex justify-between items-center w-full">
          <div></div>
          <div className="flex gap-4 float-left items-center">
            <div>
              <h1 className="text-white text-right font-bold text-lg truncate">
                {companyName || "[CONDUCTOR INSTITUTE]"}
              </h1>
              <p className="text-green-500 text-sm text-right -mt-1">
                Excellence in Assessment
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-600 rounded-full overflow-hidden flex items-center justify-center">
              {logo ? (
                <img
                  src={logo}
                  alt="Logo"
                  className="w-full h-full object-cover"
                  onError={() => console.error("Error loading logo")}
                />
              ) : (
                <span className="text-white font-bold text-lg sm:text-xl">
                  ?
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Background + Login */}
      <form
        onSubmit={handleLogin}
        className="relative h-[80vh] grow bg-cover bg-center py-10 sm:py-20 px-4 flex justify-center items-center"
      // style={{ backgroundImage: `url('/login-bg.jpg')` }} 
      >
        <div className="absolute inset-0 z-0" aria-hidden="true" />

        <div
          className="relative z-10 flex flex-col justify-between rounded-xl p-6 w-full max-w-2xl h-4/7 shadow-xl bg-white/40  backdrop-blur-sm border border-white/30"
        >
          <h2 className="text-blue-900 font-bold text-lg mb-4 sm:mb-6 flex items-center space-x-2">
            <RiLoginCircleFill size={25} className="" />
            <span>Login Portal</span>
          </h2>

          {/* Username */}
          <div className="mb-2 sm:mb-3 text-[#000000]">
            <label
              htmlFor="username"
              className="text-xs font-semibold block mb-1"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
              aria-label="Username"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-3 sm:mb-4">
            <label
              htmlFor="password"
              className="text-xs font-semibold block mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              aria-label="Password"
              required
            />
          </div>

          {/* Error Message */}
          {error && (
            <p
              className="text-red-800 bg-red-200 w-fit self-center px-2 text-xs text-center mb-2"
              aria-live="assertive"
            >
              {error}
            </p>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full ${loading
              ? "bg-blue-400 cursor-wait"
              : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
              } text-white py-2 rounded text-sm font-semibold transition`}
          >
            {loading ? "Logging in..." : `LOGIN`}
          </button>

          <p className="text-gray-700 text-xs text-center mt-2">
            Click Login to proceed
          </p>
        </div>
      </form>

      {/* Footer */}
      <footer className=" border-t h-[6vh] flex items-center justify-center py-2 text-xs text-gray-500">
        <p>© 2025 {companyName}</p>
      </footer>
    </div>
  );
}
