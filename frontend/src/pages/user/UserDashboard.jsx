import React, { useState, useEffect } from 'react';
import { RefreshCw, History, Calendar, CheckSquare } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import TaskService from '../../services/TaskService';
import ActivityLogService from '../../services/ActivityLogService';
import DashboardStats from '../../components/DashboardStats';

const UserDashboard = () => {
    const { user } = useAuth();
    
    const [stats, setStats] = useState({ total: 0, statusStats: [], priorityStats: [] });
    const [recentLogs, setRecentLogs] = useState([]);
    
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState('');

    const fetchData = async (isRefresh = false) => {
        if (isRefresh) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }
        setError('');
        
        try {
            const [statsData, logsData] = await Promise.all([
                TaskService.getStats(),
                ActivityLogService.getAll()
            ]);
            setStats(statsData);
            setRecentLogs(logsData.slice(0, 5)); // show latest 5 personal logs
        } catch (err) {
            setError(err.message || 'Gagal memuat data dashboard.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const formatLogDate = (dateStr) => {
        return new Date(dateStr).toLocaleString('id-ID', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getActionBadge = (action) => {
        switch (action) {
            case 'LOGIN':
                return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'LOGOUT':
                return 'bg-slate-50 text-slate-700 border-slate-100';
            case 'CREATE_TASK':
                return 'bg-indigo-50 text-indigo-700 border-indigo-100';
            case 'UPDATE_TASK':
                return 'bg-sky-50 text-sky-700 border-sky-100';
            case 'DELETE_TASK':
                return 'bg-red-50 text-red-700 border-red-100';
            default:
                return 'bg-amber-50 text-amber-700 border-amber-100';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50svh]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm font-semibold text-slate-500">Memuat statistik dashboard...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Top Bar Greeting */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
                <div className="space-y-1">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight">
                        Halo, {user?.name}!
                    </h2>
                    <p className="text-sm text-slate-400 font-medium">
                        Kelola tugas harian Anda dan pantau produktivitas di sini.
                    </p>
                </div>
                <button
                    onClick={() => fetchData(true)}
                    disabled={refreshing}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all select-none"
                >
                    <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {error && (
                <div className="p-4 text-sm font-semibold text-red-700 bg-red-50 border border-red-100 rounded-2xl">
                    {error}
                </div>
            )}

            {/* Stats Dashboard */}
            <DashboardStats stats={stats} />

            {/* Bottom Row: Recent logs & Overview info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activities list */}
                <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm lg:col-span-2 space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                        <History className="w-5 h-5 text-indigo-500" />
                        <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                            Aktivitas Saya Terbaru
                        </h4>
                    </div>

                    {recentLogs.length === 0 ? (
                        <div className="py-8 text-center text-xs font-semibold text-slate-400">
                            Belum ada riwayat aktivitas tercatat.
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {recentLogs.map((log) => (
                                <div key={log.id} className="flex flex-col sm:flex-row sm:items-center justify-between py-3.5 gap-2">
                                    <div className="space-y-0.5">
                                        <span className="block text-sm font-semibold text-slate-800 leading-snug">
                                            {log.details}
                                        </span>
                                        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                                            <span>Oleh Anda</span>
                                            <span>•</span>
                                            <span className="font-mono text-[10px]">{formatLogDate(log.created_at)}</span>
                                        </div>
                                    </div>
                                    <span className={`inline-flex px-2 py-0.5 text-[10px] font-extrabold border rounded-lg uppercase tracking-wider self-start sm:self-center font-mono ${getActionBadge(log.action)}`}>
                                        {log.action}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick Shortcuts */}
                <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm lg:col-span-1 flex flex-col justify-between">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                            <CheckSquare className="w-5 h-5 text-indigo-500" />
                            <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                                Info Simatu
                            </h4>
                        </div>
                        <div className="space-y-3.5 text-xs font-medium text-slate-500 leading-relaxed">
                            <p>
                                Simatu (Sistem Manajemen Tugas) dirancang untuk mempermudah pemantauan tugas-tugas tim maupun individu.
                            </p>
                            <p>
                                Gunakan menu <strong>Tugas Saya</strong> untuk melakukan tambah, ubah, dan hapus tugas Anda. Perubahan status tugas akan dicatat di dalam riwayat aktivitas secara real-time.
                            </p>
                        </div>
                    </div>
                    <div className="pt-4 border-t border-slate-100 mt-6 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                        © 2026 Simatu App v1.0
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
