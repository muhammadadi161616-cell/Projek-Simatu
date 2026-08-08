import React, { useState, useEffect } from 'react';
import { Plus, Search, RefreshCw, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import TaskService from '../../services/TaskService';
import TaskTable from '../../components/TaskTable';
import TaskForm from '../../components/TaskForm';

const UserTasks = () => {
    const { user } = useAuth();
    
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Filter states
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [priority, setPriority] = useState('');

    // Modal state
    const [showFormModal, setShowFormModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    const fetchTasks = async () => {
        setLoading(true);
        setError('');
        try {
            const filters = {};
            if (search.trim() !== '') filters.search = search;
            if (status !== '') filters.status = status;
            if (priority !== '') filters.priority = priority;

            const data = await TaskService.getAll(filters);
            setTasks(data);
        } catch (err) {
            setError(err.message || 'Gagal memuat daftar tugas Anda.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchTasks();
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [search, status, priority]);

    const handleCreateOrUpdate = async (taskData) => {
        try {
            if (editingTask) {
                await TaskService.update(editingTask.id, taskData);
            } else {
                await TaskService.create(taskData);
            }
            fetchTasks();
        } catch (err) {
            throw err;
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus tugas ini?')) {
            try {
                await TaskService.deleteTask(id);
                fetchTasks();
            } catch (err) {
                alert(err.message || 'Gagal menghapus tugas.');
            }
        }
    };

    const openCreateModal = () => {
        setEditingTask(null);
        setShowFormModal(true);
    };

    const openEditModal = (task) => {
        setEditingTask(task);
        setShowFormModal(true);
    };

    const clearFilters = () => {
        setSearch('');
        setStatus('');
        setPriority('');
    };

    return (
        <div className="space-y-6">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight">Daftar Tugas Saya</h2>
                    <p className="text-sm text-slate-400 font-medium">Kelola dan selesaikan tugas-tugas harian Anda secara teratur.</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 px-5 py-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded-2xl text-sm font-bold shadow-lg shadow-indigo-150 transition-all hover:shadow-indigo-250 select-none self-stretch sm:self-auto justify-center"
                >
                    <Plus className="w-5 h-5" />
                    Tambah Tugas
                </button>
            </div>

            {error && (
                <div className="p-4 text-sm font-semibold text-red-700 bg-red-50 border border-red-100 rounded-2xl">
                    {error}
                </div>
            )}

            {/* Filters Bar */}
            <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search Field */}
                    <div className="relative flex-1">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                            <Search className="w-4 h-4" />
                        </span>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari tugas berdasarkan judul atau deskripsi..."
                            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                        />
                    </div>

                    {/* Filters dropdowns */}
                    <div className="flex flex-wrap gap-3">
                        <div className="min-w-[140px]">
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                            >
                                <option value="">Semua Status</option>
                                <option value="Pending">Pending</option>
                                <option value="In Progress">Dalam Proses</option>
                                <option value="Completed">Selesai</option>
                            </select>
                        </div>

                        <div className="min-w-[140px]">
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                            >
                                <option value="">Semua Prioritas</option>
                                <option value="Low">Low (Rendah)</option>
                                <option value="Medium">Medium (Sedang)</option>
                                <option value="High">High (Tinggi)</option>
                            </select>
                        </div>

                        {(search || status || priority) && (
                            <button
                                onClick={clearFilters}
                                className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 rounded-xl transition-colors"
                            >
                                <X className="w-3.5 h-3.5" />
                                Hapus Filter
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Task List Table */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-16 bg-white border border-slate-200 rounded-2xl shadow-sm">
                    <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin mb-3" />
                    <span className="text-xs font-semibold text-slate-500">Memperbarui daftar tugas...</span>
                </div>
            ) : (
                <TaskTable
                    tasks={tasks}
                    onEdit={openEditModal}
                    onDelete={handleDelete}
                    userRole="user"
                    currentUserId={user?.id}
                />
            )}

            {/* Form Modal */}
            {showFormModal && (
                <TaskForm
                    task={editingTask}
                    onSubmit={handleCreateOrUpdate}
                    onClose={() => setShowFormModal(false)}
                    userRole="user"
                />
            )}
        </div>
    );
};

export default UserTasks;
