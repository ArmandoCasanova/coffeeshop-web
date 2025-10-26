import { useState } from "react";
import { Outlet } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import Sidebar from "../components/Sidebar";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative min-h-screen md:flex bg-gray-50">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <Sidebar isOpen={sidebarOpen} />

      <main className="flex-1">
        <div className="p-4 md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-600 hover:text-brown-600"
          >
            <FiMenu size={28} />
          </button>
        </div>

        <Outlet />
      </main>
    </div>
  );
}
