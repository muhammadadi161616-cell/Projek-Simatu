import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, History, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const { logout, user } = useAuth();

    const menuItems = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Tugas', path: '/tasks', icon: CheckSquare },
        { name: 'Riwayat', path: '/logs', icon: History },
    ];

    const activeClassName = "flex items-center px-4 py-3 text-indigo-600 bg-indigo-50 border-r-4 border-indigo-600 font-medium transition-all duration-200";
    const inactiveClassName = "flex items-center px-4 py-3 text-gray-600 hover:text-indigo-600 hover:bg-gray-50 font-medium transition-all duration-200";

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div 
                    onClick={toggleSidebar} 
                    className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
                />
            )}

            <aside className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 bg-white border-r border-slate-200 transition-transform duration-300 transform lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Logo and Brand */}
                <div className="flex items-center h-16 px-6 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-2.5">
                        <div className="flex items-center justify-center w-9 h-9 bg-indigo-600 rounded-xl shadow-md shadow-indigo-200">
                            <span className="text-white font-bold text-lg">S</span>
                        </div>
                        <div>
                            <span className="text-slate-800 font-bold text-lg tracking-wide">Simatu</span>
                            <p className="text-[10px] text-slate-400 font-medium -mt-1">Task Management</p>
                        </div>
                    </div>
                </div>

                {/* User info */}
                <div className="p-4 mx-4 my-4 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 text-indigo-700 font-semibold rounded-full uppercase">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="overflow-hidden">
                            <h4 className="text-sm font-semibold text-slate-700 truncate">{user?.name}</h4>
                            <span className="inline-block px-2 py-0.5 mt-0.5 text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-full capitalize">
                                {user?.role}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 space-y-1 px-3">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            onClick={() => { if(window.innerWidth < 1024) toggleSidebar(); }}
                            className={({ isActive }) => isActive ? activeClassName : inactiveClassName}
                        >
                            <item.icon className="w-5 h-5 mr-3 transition-colors" />
                            {item.name}
                        </NavLink>
                    ))}
                </nav>

                {/* Footer Section & Logout */}
                <div className="p-4 border-t border-slate-100">
                    <button
                        onClick={logout}
                        className="flex items-center w-full px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl font-medium transition-all duration-200"
                    >
                        <LogOut className="w-5 h-5 mr-3" />
                        Keluar
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
