import React from 'react';
import { Layers, Clock, Loader2, CheckCircle2, TrendingUp } from 'lucide-react';

const DashboardStats = ({ stats }) => {
    const total = stats.total || 0;
    
    // Extrapolate values from backend stats
    const getCountByStatus = (statusName) => {
        const found = stats.statusStats?.find(s => s.status === statusName);
        return found ? found.count : 0;
    };

    const getCountByPriority = (priorityName) => {
        const found = stats.priorityStats?.find(p => p.priority === priorityName);
        return found ? found.count : 0;
    };

    const pending = getCountByStatus('Pending');
    const inProgress = getCountByStatus('In Progress');
    const completed = getCountByStatus('Completed');

    const low = getCountByPriority('Low');
    const medium = getCountByPriority('Medium');
    const high = getCountByPriority('High');

    // Calculate percentages
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    const progressRate = total > 0 ? Math.round((inProgress / total) * 100) : 0;
    const pendingRate = total > 0 ? Math.round((pending / total) * 100) : 0;

    // SVG Circular progress params
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (completionRate / 100) * circumference;

    const cards = [
        {
            title: 'Total Tugas',
            value: total,
            description: 'Semua tugas terdaftar',
            icon: Layers,
            bgClass: 'bg-indigo-50 border-indigo-100 text-indigo-700',
            iconBg: 'bg-indigo-100/80',
        },
        {
            title: 'Tugas Tertunda',
            value: pending,
            description: 'Menunggu dikerjakan',
            icon: Clock,
            bgClass: 'bg-amber-50 border-amber-100 text-amber-700',
            iconBg: 'bg-amber-100/80',
        },
        {
            title: 'Dalam Proses',
            value: inProgress,
            description: 'Sedang diselesaikan',
            icon: Loader2,
            bgClass: 'bg-sky-50 border-sky-100 text-sky-700',
            iconBg: 'bg-sky-100/80',
            iconAnim: 'animate-spin-slow',
        },
        {
            title: 'Selesai',
            value: completed,
            description: 'Tugas yang telah rampung',
            icon: CheckCircle2,
            bgClass: 'bg-emerald-50 border-emerald-100 text-emerald-700',
            iconBg: 'bg-emerald-100/80',
        }
    ];

    return (
        <div className="space-y-6">
            {/* Grid Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, idx) => (
                    <div 
                        key={idx} 
                        className={`flex items-center justify-between p-5 bg-white border border-slate-200 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5`}
                    >
                        <div className="space-y-1.5">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                {card.title}
                            </span>
                            <h3 className="text-3xl font-bold text-slate-800">
                                {card.value}
                            </h3>
                            <p className="text-xs text-slate-400 font-medium">
                                {card.description}
                            </p>
                        </div>
                        <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${card.bgClass} ${card.iconBg}`}>
                            <card.icon className={`w-6 h-6 ${card.iconAnim || ''}`} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Statistics Charts & Prioritas Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Circular Completion Chart */}
                <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm lg:col-span-1 flex flex-col items-center justify-center text-center">
                    <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide self-start mb-6">
                        Persentase Penyelesaian
                    </h4>
                    <div className="relative flex items-center justify-center w-40 h-40">
                        <svg className="w-full h-full transform -rotate-90">
                            {/* Background Circle */}
                            <circle
                                cx="80"
                                cy="80"
                                r={radius}
                                stroke="#f1f5f9"
                                strokeWidth="8"
                                fill="transparent"
                                className="origin-center scale-[1.8]"
                            />
                            {/* Foreground Progress Circle */}
                            <circle
                                cx="80"
                                cy="80"
                                r={radius}
                                stroke="#4f46e5"
                                strokeWidth="8"
                                fill="transparent"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                                className="origin-center scale-[1.8] transition-all duration-500 ease-in-out"
                            />
                        </svg>
                        <div className="absolute flex flex-col items-center justify-center">
                            <span className="text-3xl font-extrabold text-slate-800">{completionRate}%</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Selesai</span>
                        </div>
                    </div>
                    <div className="w-full mt-6 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4 text-xs font-semibold">
                        <div>
                            <span className="block text-slate-400">Tunda</span>
                            <span className="block text-slate-700 font-bold mt-0.5">{pendingRate}%</span>
                        </div>
                        <div>
                            <span className="block text-slate-400">Proses</span>
                            <span className="block text-slate-700 font-bold mt-0.5">{progressRate}%</span>
                        </div>
                        <div>
                            <span className="block text-slate-400">Selesai</span>
                            <span className="block text-slate-700 font-bold mt-0.5">{completionRate}%</span>
                        </div>
                    </div>
                </div>

                {/* Priority Progress Bars */}
                <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm lg:col-span-2 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                                Pembagian Prioritas Tugas
                            </h4>
                            <div className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-lg">
                                <TrendingUp className="w-3.5 h-3.5" />
                                <span>Distribusi</span>
                            </div>
                        </div>

                        <div className="space-y-5">
                            {/* High Priority */}
                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center text-xs font-semibold">
                                    <span className="text-red-600 font-bold uppercase">High</span>
                                    <span className="text-slate-500">{high} Tugas</span>
                                </div>
                                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                                    <div 
                                        style={{ width: `${total > 0 ? (high / total) * 100 : 0}%` }}
                                        className="bg-red-500 h-full rounded-full transition-all duration-500"
                                    />
                                </div>
                            </div>

                            {/* Medium Priority */}
                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center text-xs font-semibold">
                                    <span className="text-amber-600 font-bold uppercase">Medium</span>
                                    <span className="text-slate-500">{medium} Tugas</span>
                                </div>
                                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                                    <div 
                                        style={{ width: `${total > 0 ? (medium / total) * 100 : 0}%` }}
                                        className="bg-amber-500 h-full rounded-full transition-all duration-500"
                                    />
                                </div>
                            </div>

                            {/* Low Priority */}
                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center text-xs font-semibold">
                                    <span className="text-emerald-600 font-bold uppercase">Low</span>
                                    <span className="text-slate-500">{low} Tugas</span>
                                </div>
                                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                                    <div 
                                        style={{ width: `${total > 0 ? (low / total) * 100 : 0}%` }}
                                        className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-xs text-slate-400 border-t border-slate-100 pt-4 mt-6 flex justify-between font-medium">
                        <span>Total Data: {total} Tugas</span>
                        <span>Update otomatis berdasarkan aktivitas basis data</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardStats;
