import React from 'react';
import { Menu, User, Calendar } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Navbar = ({ onToggleSidebar, title }) => {
    const { user } = useAuth();
    const currentDate = new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-white/80 backdrop-blur-md border-b border-slate-200">
            {/* Left Side: Sidebar Toggle & Page Title */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onToggleSidebar}
                    className="p-2 text-slate-600 hover:bg-slate-50 border border-slate-200 rounded-lg lg:hidden transition-colors"
                >
                    <Menu className="w-5 h-5" />
                </button>
                <h1 className="text-xl font-bold text-slate-800 tracking-tight capitalize">
                    {title}
                </h1>
            </div>

            {/* Right Side: Date and User info */}
            <div className="flex items-center gap-6">
                {/* Date Display */}
                <div className="hidden md:flex items-center gap-2 text-slate-500 text-xs font-medium">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>{currentDate}</span>
                </div>

                {/* Vertical Divider */}
                <div className="hidden md:block w-px h-6 bg-slate-200" />

                {/* User Profile */}
                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <span className="block text-sm font-semibold text-slate-700 leading-tight">
                            {user?.name}
                        </span>
                        <span className="block text-[11px] text-slate-400 font-medium font-mono">
                            {user?.email}
                        </span>
                    </div>
                    <div className="flex items-center justify-center w-9 h-9 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-600">
                        <User className="w-4 h-4" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
