import React, { useState } from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const DashboardLayout = () => {
    const { isAuthenticated, loading } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    // Route title mapping
    const getPageTitle = () => {
        const path = location.pathname;
        if (path === '/') return 'Dashboard';
        if (path.startsWith('/tasks')) return 'Manajemen Tugas';
        if (path.startsWith('/logs')) return 'Riwayat Aktivitas';
        return 'Simatu';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm font-semibold text-slate-500">Memuat Sesi...</span>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-screen bg-slate-50/50">
            {/* Sidebar component */}
            <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

            {/* Main content wrapper */}
            <div className="lg:pl-64 flex flex-col min-h-screen">
                {/* Navbar component */}
                <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} title={getPageTitle()} />

                {/* Subpage content */}
                <main className="flex-1 p-6 max-w-[1600px] w-full mx-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
