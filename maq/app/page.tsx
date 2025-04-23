'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from 'js-cookie';
import { User, ShieldCheck, LogIn } from "lucide-react";

export default function Home() {
  const [role, setRole] = useState("user");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [companyName, setCompanyName] = useState('');
  const [logo, setLogo] = useState('');


  useEffect(() => {
    const token = Cookies.get('session_token');
    const userRole = Cookies.get('userRole');

    if (token && userRole) {
      if (userRole === 'admin') {
        router.replace('/admin');
      } else if (userRole === 'user') {
        router.replace('/instructions');
      }
    } else {
      // ✅ No token, allow page to render
      setCheckingAuth(false);
    }
  }, [router]);

  useEffect(() => {
    const fetchLatestAssignment = async () => {
      try {
        const res = await axios.get('/api/admin/assignments/latest');
        if (res.data) {
          console.log("Assignment fetched successfully", res.data);

          const { companyName, logo } = res.data;
          setCompanyName(companyName);
          setLogo(logo);
        }
      } catch (err) {
        console.log('Error fetching latest assignment', err);
      }
    };

    fetchLatestAssignment();
  }, []);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!username || !password) {
      setError('Username and password are required');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post('/api/auth/login', { username, password });

      if (res.status === 200) {
        const user = res.data;

        // ✅ Set user role in cookies
        Cookies.set('userRole', user.role, { path: '/', secure: true });

        // ✅ Redirect based on role
        if (user.role === "admin") {
          router.push('/admin');
        } else if (user.role === "user") {
          sessionStorage.setItem("user", JSON.stringify(user));
          router.push('/instructions');
        } else {
          setError('Unknown user role. Please contact support.');
        }
      } else {
        setError('Unexpected error occurred. Please try again.');
      }
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data?.message || 'Invalid credentials');
      } else if (err.request) {
        setError('Network error. Please check your connection.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return null; // or a spinner, skeleton, etc.
  }

  console.log(companyName, logo);

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800 bg-slate-50">
      {/* Header */}
      <header className="bg-white h-[10vh] border-b shadow-sm px-6 py-4 flex flex-col md:flex-row justify-between items-center">
        <div className="flex gap-4">
          <div className="w-12 h-12 bg-emerald-600 rounded-full overflow-hidden flex items-center justify-center">
            {logo ? (
              <img
                src={logo}
                alt="Logo"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white font-bold text-xl">?</span>
            )}
          </div>
          <div>
            <h1 className="text-blue-900 font-bold text-lg">
              {companyName || "[CONDUCTOR INSTITUTE]"}
            </h1>
            <p className="text-emerald-600 text-sm -mt-1">
              Excellence in Assessment
            </p>
          </div>
        </div>
        <div className="text-sm mt-3 md:mt-0 text-right"></div>
      </header>

      {/* Background + Login */}
      <form
        onSubmit={handleLogin}
        className="relative h-[80vh] grow  bg-cover bg-center py-20 px-4 flex justify-center items-center"
      >
        <div className="absolute inset-0 bg-blue-950/90 z-0" />

        <div className="relative z-10 bg-white rounded-xl p-6 w-full max-w-sm shadow-lg">
          <h2 className="text-blue-900 font-bold text-lg mb-6 flex items-center space-x-2">
            <LogIn className="w-5 h-5" />
            <span>Login Portal</span>
          </h2>

          {/* Username */}
          <div className="mb-3">
            <label className="text-xs font-semibold block mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="text-xs font-semibold block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-xs text-center mb-2">{error}</p>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full ${loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
              } text-white py-2 rounded text-sm font-semibold transition`}
          >
            {loading ? "Logging in..." : `LOGIN`}
          </button>

          <p className="text-gray-500 text-xs text-center mt-2">
            Click Login to proceed
          </p>
        </div>
      </form>

      {/* Footer */}
      <footer className="bg-white border-t h-[6vh] text-center py-4 text-xs text-gray-500">
        © 2025 {companyName} Testing Agency
      </footer>
    </div>
  );
}
