import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

function AdminLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#F7F8FC]">
      {/* Overlay Mobile */}

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar Desktop */}

      <aside className="hidden w-[280px] shrink-0 border-r border-gray-200 bg-white lg:block">
        <Sidebar onClose={() => setOpen(false)} />
      </aside>

      {/* Sidebar Mobile */}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col bg-white shadow-xl transition-transform duration-300 lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="shrink-0 flex justify-end p-4">
          <button onClick={() => setOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className="min-h-0 flex-1">
          <Sidebar onClose={() => setOpen(false)} />
        </div>
      </aside>
      {/* Main */}

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile Top Bar */}

        <div className="flex items-center justify-between border-b bg-white px-4 py-3 lg:hidden">
          <button onClick={() => setOpen(true)}>
            <Menu size={26} />
          </button>

          <h2 className="font-bold">Order Menu</h2>

          <div />
        </div>

        {/* Header Desktop */}

        <div className="hidden lg:block">
          <Header />
        </div>

        {/* Content */}

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="mx-auto max-w-[1500px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
