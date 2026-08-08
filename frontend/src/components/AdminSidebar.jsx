import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, History, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const AdminSidebar = ({ isOpen, toggleSidebar }) => {
    const { logout, user } = useAuth();

    const menuItems = [
        { name: 'Dashboard Admin', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Semua Tugas', path: '/admin/tasks', icon: CheckSquare },
        { name: 'Log Aktivitas', path: '/admin/logs', icon: History },
    ];

    const activeClassName = "flex items-center px-4 py-3 text-red-600 bg-red-50 border-r-4 border-red-600 font-semibold transition-all duration-200";
    const inactiveClassName = "flex items-center px-4 py-3 text-slate-600 hover:text-red-600 hover:bg-slate-50 font-medium transition-all duration-200";

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div 
                    onClick={toggleSidebar} 
                    className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
                />
            )}

            <aside className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 bg-slate-900 text-slate-300 border-r border-slate-800 transition-transform duration-300 transform lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Logo and Brand */}
                <div className="flex items-center h-16 px-6 border-b border-slate-800 bg-slate-950/40">
                    <div className="flex items-center gap-2.5">
                        <div className="flex items-center justify-center w-9 h-9 bg-red-600 rounded-xl shadow-md shadow-red-900/50">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <span className="text-white font-extrabold text-lg tracking-wide">Simatu</span>
                            <p className="text-[10px] text-red-400 font-bold -mt-1 tracking-wider uppercase">Admin Control</p>
                        </div>
                    </div>
                </div>

                {/* User info */}
                <div className="p-4 mx-4 my-4 rounded-xl bg-slate-800/50 border border-slate-800/80">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-red-900/40 text-red-400 border border-red-900/50 font-bold rounded-full uppercase">
                            {user?.name?.charAt(0) || 'A'}
                        </div>
                        <div className="overflow-hidden">
                            <h4 className="text-sm font-semibold text-white truncate">{user?.name}</h4>
                            <span className="inline-block px-2.5 py-0.5 mt-0.5 text-[9px] font-extrabold text-red-400 bg-red-950/50 border border-red-900/50 rounded-full uppercase tracking-wider">
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
                            className={({ isActive }) => {
                                // Customized logic to make navigation highlight work properly with active state in tailwind
                                return isActive ? activeClassName : inactiveClassName;
                            }}
                        >
                            <item.icon className="w-5 h-5 mr-3 transition-colors" />
                            {item.name}
                        </NavLink>
                    ))}
                </nav>

                {/* Footer Section & Logout */}
                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={logout}
                        className="flex items-center w-full px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-slate-800/40 rounded-xl font-medium transition-all duration-200"
                    >
                        <LogOut className="w-5 h-5 mr-3" />
                        Keluar
                    </button>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;
