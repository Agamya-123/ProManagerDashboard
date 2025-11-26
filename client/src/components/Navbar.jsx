import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, CheckSquare } from 'lucide-react';

const Navbar = () => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path
            ? 'bg-white/10 text-white shadow-sm backdrop-blur-sm'
            : 'text-indigo-100 hover:bg-white/5 hover:text-white';
    };

    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    const isAdmin = user?.role === 'Admin';

    return (
        <nav className="bg-gradient-to-r from-primary-700 to-indigo-800 shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2 text-white font-bold text-xl tracking-tight group">
                            <div className="bg-white/20 p-1.5 rounded-lg group-hover:bg-white/30 transition-colors backdrop-blur-sm">
                                <LayoutDashboard className="w-6 h-6" />
                            </div>
                            <span className="font-outfit">ProManager</span>
                        </Link>
                        <div className="ml-10 flex items-baseline space-x-4">
                            <Link to="/" className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center space-x-2 transition-all duration-200 ${isActive('/')}`}>
                                <LayoutDashboard className="w-4 h-4" />
                                <span>Dashboard</span>
                            </Link>
                            {isAdmin && (
                                <Link to="/employees" className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center space-x-2 transition-all duration-200 ${isActive('/employees')}`}>
                                    <Users className="w-4 h-4" />
                                    <span>Employees</span>
                                </Link>
                            )}
                            <Link to="/tasks" className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center space-x-2 transition-all duration-200 ${isActive('/tasks')}`}>
                                <CheckSquare className="w-4 h-4" />
                                <span>Tasks</span>
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link to="/profile" className="flex items-center space-x-3 group" title="View Profile">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-medium text-white group-hover:text-indigo-200 transition-colors">{user?.name}</p>
                                <p className="text-xs text-indigo-200">{user?.role}</p>
                            </div>
                            <div className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center text-white font-bold shadow-sm ring-1 ring-white/20 group-hover:ring-white/50 transition-all backdrop-blur-sm">
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                        </Link>
                        <div className="h-6 w-px bg-white/10 mx-2"></div>
                        <button
                            onClick={() => {
                                localStorage.removeItem('isAuthenticated');
                                window.location.href = '/login';
                            }}
                            className="text-indigo-100 hover:text-white text-sm font-medium transition-colors"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
