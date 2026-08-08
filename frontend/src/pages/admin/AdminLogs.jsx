import React, { useState, useEffect } from 'react';
import { History, RefreshCw, User, Info } from 'lucide-react';
import ActivityLogService from '../../services/ActivityLogService';

const AdminLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchLogs = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await ActivityLogService.getAll();
            setLogs(data);
        } catch (err) {
            setError(err.message || 'Gagal memuat riwayat aktivitas sistem.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const formatFullDate = (dateStr) => {
        return new Date(dateStr).toLocaleString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight">Log Aktivitas Sistem</h2>
                    <p className="text-sm text-slate-400 font-medium">Rekaman log audit seluruh tindakan pengguna dalam sistem secara real-time.</p>
                </div>
                <button
                    onClick={fetchLogs}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm transition-all"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {error && (
                <div className="p-4 text-sm font-semibold text-red-700 bg-red-50 border border-red-100 rounded-2xl">
                    {error}
                </div>
            )}

            {/* List */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-16 bg-white border border-slate-200 rounded-2xl shadow-sm">
                    <RefreshCw className="w-8 h-8 text-red-500 animate-spin mb-3" />
                    <span className="text-xs font-semibold text-slate-500">Memuat log aktivitas sistem...</span>
                </div>
            ) : logs.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-slate-200 rounded-2xl shadow-sm">
                    <div className="flex items-center justify-center w-12 h-12 bg-slate-50 border border-slate-100 rounded-full text-slate-400 mb-4">
                        <History className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-700">Tidak ada riwayat aktivitas sistem</h4>
                    <p className="text-xs text-slate-400 mt-1 max-w-xs">
                        Seluruh aktivitas pengguna akan tercatat di sini saat sistem digunakan.
                    </p>
                </div>
            ) : (
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/75 border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    <th className="px-6 py-4">Pengguna</th>
                                    <th className="px-6 py-4">Tipe Aksi</th>
                                    <th className="px-6 py-4">Keterangan</th>
                                    <th className="px-6 py-4">Waktu Kejadian</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                                {logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-slate-50/20 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-xl w-fit">
                                                <User className="w-3.5 h-3.5 text-slate-400" />
                                                <span>{log.user_name || `User ID: ${log.user_id}`}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2.5 py-0.5 text-[10px] font-extrabold border rounded-lg uppercase tracking-wide font-mono ${getActionBadge(log.action)}`}>
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 max-w-sm">
                                            <div className="flex items-start gap-2">
                                                <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                                <span className="text-slate-700 font-semibold leading-normal">
                                                    {log.details}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 font-medium font-mono">
                                            {formatFullDate(log.created_at)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminLogs;
