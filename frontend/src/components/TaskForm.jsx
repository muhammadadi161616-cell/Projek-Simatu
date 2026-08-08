import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { validateTaskTitle } from '../utils/validation';
import UserService from '../services/UserService';

const TaskForm = ({ task, onSubmit, onClose, userRole }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('Pending');
    const [priority, setPriority] = useState('Medium');
    const [dueDate, setDueDate] = useState('');
    const [assigneeId, setAssigneeId] = useState('');
    const [users, setUsers] = useState([]);

    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (userRole === 'admin') {
            const loadUsers = async () => {
                try {
                    const data = await UserService.getAll();
                    setUsers(data);
                } catch (err) {
                    console.error('Gagal mengambil daftar pengguna', err);
                }
            };
            loadUsers();
        }
    }, [userRole]);

    useEffect(() => {
        if (task) {
            setTitle(task.title || '');
            setDescription(task.description || '');
            setStatus(task.status || 'Pending');
            setPriority(task.priority || 'Medium');
            setDueDate(task.due_date ? task.due_date.substring(0, 10) : '');
            setAssigneeId(task.user_id || '');
        } else {
            setTitle('');
            setDescription('');
            setStatus('Pending');
            setPriority('Medium');
            setDueDate('');
            setAssigneeId('');
        }
        setError('');
    }, [task]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Frontend form validation
        const titleError = validateTaskTitle(title);
        if (titleError) {
            setError(titleError);
            return;
        }

        setSubmitting(true);
        setError('');

        const taskData = {
            title,
            description,
            status,
            priority,
            due_date: dueDate || null,
        };

        if (userRole === 'admin' && assigneeId) {
            taskData.assignee_id = assigneeId;
        }

        try {
            await onSubmit(taskData);
            onClose();
        } catch (err) {
            setError(err.message || 'Gagal menyimpan tugas. Silakan periksa kembali formulir Anda.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800">
                        {task ? 'Edit Tugas' : 'Tambah Tugas Baru'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="p-3 text-sm font-semibold text-red-700 bg-red-50 border border-red-100 rounded-xl">
                            {error}
                        </div>
                    )}

                    {/* Task Title */}
                    <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Judul Tugas <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Contoh: Menyusun laporan keuangan mingguan"
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Deskripsi
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Jelaskan rincian tugas ini..."
                            rows="3"
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all resize-none"
                        />
                    </div>

                    {/* Dual fields: Status & Priority */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Status
                            </label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                            >
                                <option value="Pending">Pending</option>
                                <option value="In Progress">Dalam Proses</option>
                                <option value="Completed">Selesai</option>
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Prioritas
                            </label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                            >
                                <option value="Low">Rendah (Low)</option>
                                <option value="Medium">Sedang (Medium)</option>
                                <option value="High">Tinggi (High)</option>
                            </select>
                        </div>
                    </div>

                    {/* Dual fields: Due Date & Assignee (if admin) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Tenggat Waktu (Due Date)
                            </label>
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                            />
                        </div>

                        {userRole === 'admin' && (
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    Pelaksana Tugas
                                </label>
                                <select
                                    value={assigneeId}
                                    onChange={(e) => setAssigneeId(e.target.value)}
                                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                                >
                                    <option value="">Pilih Pelaksana (Default: Diri Sendiri)</option>
                                    {users.map(u => (
                                        <option key={u.id} value={u.id}>
                                            {u.name} ({u.role})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-semibold transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-5 py-2 text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 rounded-xl text-sm font-semibold shadow-md shadow-indigo-100 transition-all flex items-center gap-2"
                        >
                            {submitting && (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            )}
                            {task ? 'Simpan Perubahan' : 'Tambah Tugas'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskForm;
