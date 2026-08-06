import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, UserPlus, ArrowRight, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { validateEmail, validatePassword, validateName } from '../utils/validation';

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Client-side validations
        const nameErr = validateName(name);
        const emailErr = validateEmail(email);
        const passErr = validatePassword(password);

        if (nameErr || emailErr || passErr) {
            setErrors({
                name: nameErr,
                email: emailErr,
                password: passErr
            });
            return;
        }

        setErrors({});
        setApiError('');
        setLoading(true);

        try {
            await register({ name, email, password, role });
            navigate('/', { replace: true });
        } catch (err) {
            setApiError(err.message || 'Pendaftaran gagal. Email mungkin sudah terdaftar.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-tr from-slate-100 via-slate-50 to-indigo-50/30">
            <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-100 overflow-hidden animate-fade-in">
                {/* Brand Banner */}
                <div className="p-8 text-center bg-slate-50/50 border-b border-slate-100">
                    <div className="flex items-center justify-center w-12 h-12 mx-auto bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-150 mb-4">
                        <span className="text-white font-extrabold text-xl">S</span>
                    </div>
                    <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Daftar Akun Baru</h2>
                    <p className="text-sm text-slate-400 font-medium mt-1">Gabung sekarang dan kelola tugas Anda dengan Simatu</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-4">
                    {apiError && (
                        <div className="p-3.5 text-sm font-semibold text-red-700 bg-red-50 border border-red-100 rounded-2xl">
                            {apiError}
                        </div>
                    )}

                    {/* Name field */}
                    <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                            Nama Lengkap
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                                <User className="w-4 h-4" />
                            </span>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Nama Anda"
                                className={`w-full pl-11 pr-4 py-2.5 bg-slate-50 border rounded-2xl text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all ${errors.name ? 'border-red-400 focus:border-red-400 focus:ring-red-500/20' : 'border-slate-200 focus:border-indigo-500'}`}
                            />
                        </div>
                        {errors.name && (
                            <span className="block text-xs font-bold text-red-500">{errors.name}</span>
                        )}
                    </div>

                    {/* Email field */}
                    <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                            Alamat Email
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                                <Mail className="w-4 h-4" />
                            </span>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="nama@email.com"
                                className={`w-full pl-11 pr-4 py-2.5 bg-slate-50 border rounded-2xl text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all ${errors.email ? 'border-red-400 focus:border-red-400 focus:ring-red-500/20' : 'border-slate-200 focus:border-indigo-500'}`}
                            />
                        </div>
                        {errors.email && (
                            <span className="block text-xs font-bold text-red-500">{errors.email}</span>
                        )}
                    </div>

                    {/* Password field */}
                    <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                            Kata Sandi
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                                <Lock className="w-4 h-4" />
                            </span>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="•••••••• (Min 6 Karakter)"
                                className={`w-full pl-11 pr-4 py-2.5 bg-slate-50 border rounded-2xl text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all ${errors.password ? 'border-red-400 focus:border-red-400 focus:ring-red-500/20' : 'border-slate-200 focus:border-indigo-500'}`}
                            />
                        </div>
                        {errors.password && (
                            <span className="block text-xs font-bold text-red-500">{errors.password}</span>
                        )}
                    </div>

                    {/* Role selection */}
                    <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                            Daftar Sebagai (Role)
                        </label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-xl cursor-pointer text-sm font-semibold select-none flex-1 text-center justify-center">
                                <input
                                    type="radio"
                                    name="role"
                                    value="user"
                                    checked={role === 'user'}
                                    onChange={() => setRole('user')}
                                    className="accent-indigo-600"
                                />
                                <span className="text-slate-600">User</span>
                            </label>
                            <label className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-xl cursor-pointer text-sm font-semibold select-none flex-1 text-center justify-center">
                                <input
                                    type="radio"
                                    name="role"
                                    value="admin"
                                    checked={role === 'admin'}
                                    onChange={() => setRole('admin')}
                                    className="accent-indigo-600"
                                />
                                <span className="text-slate-600">Admin</span>
                            </label>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-3 text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 rounded-2xl text-sm font-bold shadow-lg shadow-indigo-150 transition-all hover:shadow-indigo-200 mt-2"
                    >
                        {loading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                <UserPlus className="w-4 h-4" />
                                <span>Daftar</span>
                            </>
                        )}
                    </button>

                    {/* Login redirect */}
                    <div className="text-center pt-4 border-t border-slate-100 text-xs font-semibold text-slate-500">
                        <span>Sudah memiliki akun? </span>
                        <Link 
                            to="/login" 
                            className="inline-flex items-center gap-0.5 text-indigo-600 hover:text-indigo-700 transition-colors"
                        >
                            <span>Masuk</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
