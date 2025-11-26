import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { LayoutDashboard, Lock, Mail, ArrowRight } from 'lucide-react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log("Login button clicked"); // Debug log
        console.log("Email:", email, "Password:", password); // Debug log
        try {
            console.log("Sending request to /auth/login..."); // Debug log
            const res = await API.post('/auth/login', { email, password });
            console.log("Response:", res); // Debug log
            
            if (res.data.user) {
                localStorage.setItem('user', JSON.stringify(res.data.user));
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('isAuthenticated', 'true');
                window.location.href = '/';
            }
        } catch (error) {
            console.error('Login failed:', error);
            alert(error.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-100/40 via-slate-50 to-slate-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-2xl shadow-primary-500/10 border border-slate-100">
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30 transform rotate-3">
                        <LayoutDashboard className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="mt-6 text-3xl font-bold text-slate-900 tracking-tight">Welcome back</h2>
                    <p className="mt-2 text-sm text-slate-500">
                        Sign in to access your dashboard
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email-address" className="block text-sm font-medium text-slate-700 mb-1">
                                Email address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent sm:text-sm bg-slate-50 transition-all"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent sm:text-sm bg-slate-50 transition-all"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 shadow-lg shadow-primary-500/30 transition-all hover:-translate-y-0.5"
                        >
                            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                <ArrowRight className="h-5 w-5 text-primary-300 group-hover:text-primary-200 transition-colors" />
                            </span>
                            Sign in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
