// src/admin/components/Sidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaExchangeAlt } from 'react-icons/fa';
import {
  FiHome,
  FiUsers,
  FiPackage,
  FiShoppingCart,
  FiBarChart2,
  FiSettings,
  FiLogOut,
  FiFileText,
  FiMessageSquare,
  FiTool,
  FiGlobe,
  FiCpu,
  FiAward,
} from "react-icons/fi";
import { useAdmin } from "../hooks/useAdmin";

export default function Sidebar({ isOpen }) {
  const location = useLocation();
  const { adminUser, logout } = useAdmin();

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { path: "/admin/dashboard",         icon: FiHome,        label: "Dashboard"         },
    { path: "/admin/users",             icon: FiUsers,       label: "Users"             },
    { path: "/admin/products",          icon: FiPackage,     label: "Products"          },
    { path: "/admin/orders",            icon: FiShoppingCart,label: "Orders"            },
    { path: "/admin/memberships",       icon: FiAward,       label: "VIP Memberships"   },
    { path: "/admin/engineer-requests", icon: FiTool,        label: "Engineer Requests" },
    { path: "/admin/repairs",           icon: FiCpu,         label: "Repairs"           },
    { path: "/admin/swap-deals",        icon: FaExchangeAlt, label: "Swap Deals"        },
    { path: "/admin/digital-services",  icon: FiGlobe,       label: "Digital Services"  },
    { path: "/admin/analytics",         icon: FiBarChart2,   label: "Analytics"         },
    { path: "/admin/blog",              icon: FiFileText,    label: "Blog"              },
    { path: "/admin/chatbot",           icon: FiMessageSquare,label: "Chatbot"          },
    { path: "/admin/settings",          icon: FiSettings,    label: "Settings"          },
  ];

  const handleLogout = () => {
    logout();
    window.location.href = "/admin/login";
  };

  return (
    <aside
      className={`${
        isOpen ? "w-64" : "w-20"
      } bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 text-white
      transition-all duration-300 flex flex-col fixed left-0 top-0 h-screen z-50`}
    >
      {/* ─── Logo ─── */}
      <div className="p-5 border-b border-gray-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700
            rounded-xl flex items-center justify-center font-bold text-lg
            shadow-lg shadow-blue-500/20 flex-shrink-0">
            75
          </div>
          {isOpen && (
            <div className="overflow-hidden">
              <h1 className="font-bold text-lg text-white leading-tight">
                ControlCenter
              </h1>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                Admin Panel
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ─── Navigation ─── */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto
        scrollbar-thin scrollbar-thumb-gray-700">
        {isOpen && (
          <p className="text-[10px] text-gray-500 uppercase tracking-widest
            font-semibold px-3 mb-2">
            Main Menu
          </p>
        )}

        {menuItems.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              title={!isOpen ? item.label : ""}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl
                transition-all duration-200 relative ${
                active
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1
                  h-6 bg-white rounded-r-full -ml-3" />
              )}

              <Icon
                size={20}
                className={`flex-shrink-0 transition-transform duration-200 ${
                  active ? "text-white" : "group-hover:scale-110"
                }`}
              />

              {isOpen && (
                <span className="font-medium text-sm">{item.label}</span>
              )}

              {active && isOpen && (
                <div className="ml-auto w-2 h-2 bg-white rounded-full
                  animate-pulse" />
              )}

              {!isOpen && (
                <div className="absolute left-full ml-3 px-3 py-1.5
                  bg-gray-900 text-white text-sm rounded-lg opacity-0
                  invisible group-hover:opacity-100 group-hover:visible
                  transition-all duration-200 whitespace-nowrap shadow-xl
                  z-50 border border-gray-700">
                  {item.label}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2
                    -ml-1 w-2 h-2 bg-gray-900 rotate-45 border-l border-b
                    border-gray-700" />
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* ─── Bottom Section ─── */}
      <div className="p-3 border-t border-gray-700/50">
        {isOpen && (
          <div className="bg-gray-800/50 rounded-xl p-3 mb-3">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">
              Quick Info
            </p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">Status</span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-500 rounded-full
                  animate-pulse" />
                <span className="text-green-400 font-medium">Online</span>
              </span>
            </div>
            <div className="flex items-center justify-between text-xs mt-1.5">
              <span className="text-gray-400">Role</span>
              <span className="text-blue-400 font-medium capitalize">
                {adminUser?.role || "admin"}
              </span>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          title={!isOpen ? "Logout" : ""}
          className={`group relative flex items-center gap-3 w-full px-3
            py-2.5 rounded-xl text-gray-400 hover:text-red-400
            hover:bg-red-500/10 transition-all duration-200 ${
            !isOpen && "justify-center"
          }`}
        >
          <FiLogOut
            size={20}
            className="flex-shrink-0 group-hover:rotate-12
              transition-transform duration-200"
          />
          {isOpen && <span className="font-medium text-sm">Logout</span>}

          {!isOpen && (
            <div className="absolute left-full ml-3 px-3 py-1.5 bg-gray-900
              text-red-400 text-sm rounded-lg opacity-0 invisible
              group-hover:opacity-100 group-hover:visible transition-all
              duration-200 whitespace-nowrap shadow-xl z-50 border
              border-gray-700">
              Logout
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}