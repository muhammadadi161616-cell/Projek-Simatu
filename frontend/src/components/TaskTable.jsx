import React from 'react';
import { Pencil, Trash2, Calendar, User, ChevronUp } from 'lucide-react';

const TaskTable = ({ tasks, onEdit, onDelete, userRole, currentUserId }) => {

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Completed':
                return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'In Progress':
                return 'bg-sky-50 text-sky-700 border-sky-100';
            default:
                return 'bg-amber-50 text-amber-700 border-amber-100';
        }
    };

    const getPriorityStyle = (priority) => {
        switch (priority) {
            case 'High':
                return 'bg-red-50 text-red-700 border-red-100';
            case 'Medium':
                return 'bg-amber-50 text-amber-700 border-amber-100';
            default:
                return 'bg-emerald-50 text-emerald-700 border-emerald-100';
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    if (tasks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-slate-200 rounded-2xl shadow-sm">
                <div className="flex items-center justify-center w-12 h-12 bg-slate-50 border border-slate-100 rounded-full text-slate-400 mb-4">
                    <Calendar className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-700">Tidak ada tugas ditemukan</h4>
                <p className="text-xs text-slate-400 font-medium max-w-xs mt-1">
                    Buat tugas baru untuk memulai pengelolaan aktivitas harian Anda.
                </p>
            </div>
        );
    }

    return (
        <div className="w-full bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/75 border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider">
                            <th className="px-6 py-4">Tugas</th>
                            <th className="px-6 py-4">Prioritas</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Tenggat</th>
                            {userRole === 'admin' && <th className="px-6 py-4">Pelaksana</th>}
                            <th className="px-6 py-4 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                        {tasks.map((task) => {
                            const isOwner = task.user_id === currentUserId;
                            const canManage = userRole === 'admin' || isOwner;

                            return (
                                <tr key={task.id} className="hover:bg-slate-50/50 transition-colors">
                                    {/* Task details */}
                                    <td className="px-6 py-4 max-w-sm">
                                        <div>
                                            <span className="block font-semibold text-slate-800 text-sm leading-snug">
                                                {task.title}
                                            </span>
                                            {task.description && (
                                                <span className="block text-xs text-slate-400 font-medium mt-0.5 line-clamp-2 leading-relaxed">
                                                    {task.description}
                                                </span>
                                            )}
                                        </div>
                                    </td>

                                    {/* Priority */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-1 text-xs font-bold border rounded-lg uppercase tracking-wide ${getPriorityStyle(task.priority)}`}>
                                            {task.priority}
                                        </span>
                                    </td>

                                    {/* Status */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-1 text-xs font-bold border rounded-lg ${getStatusStyle(task.status)}`}>
                                            {task.status === 'In Progress' ? 'Dalam Proses' : task.status === 'Completed' ? 'Selesai' : 'Pending'}
                                        </span>
                                    </td>

                                    {/* Due Date */}
                                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 font-medium font-mono">
                                        {formatDate(task.due_date)}
                                    </td>

                                    {/* Assignee / Creator (Admin ONLY) */}
                                    {userRole === 'admin' && (
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold bg-slate-50 border border-slate-100 px-2 py-1 rounded-lg w-fit">
                                                <User className="w-3.5 h-3.5 text-slate-400" />
                                                <span>{task.creator_name || `User ID: ${task.user_id}`}</span>
                                            </div>
                                        </td>
                                    )}

                                    {/* Actions */}
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        {canManage ? (
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => onEdit(task)}
                                                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 rounded-lg transition-all"
                                                    title="Edit Tugas"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => onDelete(task.id)}
                                                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-lg transition-all"
                                                    title="Hapus Tugas"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-slate-300 font-bold uppercase tracking-wider">No Access</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TaskTable;
