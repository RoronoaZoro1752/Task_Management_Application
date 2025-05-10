import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <div className="relative overflow-hidden rounded-b-4xl shadow-xl">
      {/* Background Blobs */}
      <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-purple-300 rounded-full blur-[180px] z-0" />
      <div className="absolute -top-10 right-0 w-[300px] h-[300px] bg-pink-300 rounded-full blur-[160px] z-0" />

      {/* Header Content */}
      <div className="py-4 px-8 flex justify-between items-center relative z-10">
        <p className="text-xl font-semibold hover:cursor-pointer">
          Task Management System
        </p>
        <div className="flex gap-4">
          {!isLoggedIn ? (
            <Link to="/signin" className=" hover:underline">
              Login
            </Link>
          ) : (
            <>
              <Link to="/dashboard" className="hover:underline">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className=" hover:underline"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
