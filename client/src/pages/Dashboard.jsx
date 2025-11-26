import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';
import { Users, CheckSquare, Clock, AlertCircle } from 'lucide-react';
import TaskChart from '../components/TaskChart';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalEmployees: 0,
        totalTasks: 0,
        pendingTasks: 0,
        completedTasks: 0
    });
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [empRes, taskRes] = await Promise.all([
                    API.get('/employees'),
                    API.get('/tasks')
                ]);

                const employees = empRes.data.data;
                const tasksData = taskRes.data.data;
                setTasks(tasksData);

                setStats({
                    totalEmployees: employees.length,
                    totalTasks: tasksData.length,
                    pendingTasks: tasksData.filter(t => t.status !== 'Done').length,
                    completedTasks: tasksData.filter(t => t.status === 'Done').length
                });
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };

        fetchData();
    }, []);

    const StatCard = ({ title, value, icon: Icon, color, gradient }) => (
        <div className={`relative overflow-hidden rounded-2xl p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${gradient}`}>
            <div className="relative z-10 flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-white/80">{title}</p>
                    <p className="mt-2 text-4xl font-bold text-white">{value}</p>
                </div>
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                    <Icon className="h-8 w-8 text-white" />
                </div>
            </div>
            <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-white/10 blur-2xl"></div>
        </div>
    );

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-slate-500 mt-1">Overview of your team and tasks</p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <Link to="/employees" className="block">
                    <StatCard
                        title="Total Employees"
                        value={stats.totalEmployees}
                        icon={Users}
                        gradient="bg-gradient-to-br from-blue-500 to-blue-600"
                    />
                </Link>
                <Link to="/tasks" className="block">
                    <StatCard
                        title="Total Tasks"
                        value={stats.totalTasks}
                        icon={CheckSquare}
                        gradient="bg-gradient-to-br from-violet-500 to-violet-600"
                    />
                </Link>
                <Link to="/tasks" className="block">
                    <StatCard
                        title="Pending Tasks"
                        value={stats.pendingTasks}
                        icon={Clock}
                        gradient="bg-gradient-to-br from-amber-400 to-amber-500"
                    />
                </Link>
                <Link to="/tasks" className="block">
                    <StatCard
                        title="Completed Tasks"
                        value={stats.completedTasks}
                        icon={AlertCircle}
                        gradient="bg-gradient-to-br from-emerald-400 to-emerald-500"
                    />
                </Link>
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">Recent Activity</h2>
                        <div className="space-y-4">
                            {/* Placeholder for recent activity or task list preview */}
                            <p className="text-slate-500 text-sm">No recent activity to show.</p>
                        </div>
                    </div>
                </div>
                <div>
                    <TaskChart tasks={tasks} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
